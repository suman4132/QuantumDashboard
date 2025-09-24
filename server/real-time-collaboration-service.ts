import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { 
  LiveCollaborationSession, InsertLiveCollaborationSession,
  LiveEdit, InsertLiveEdit, Project, UserProfile, ChatMessage
} from '@shared/schema';
import { randomUUID } from 'crypto';

interface CollaborationClient {
  id: string;
  ws: WebSocket;
  userId: string;
  userName: string;
  sessionId: string;
  projectId: string;
  cursor?: { line: number; column: number };
  isTyping: boolean;
  lastActivity: Date;
}

export class RealTimeCollaborationService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, CollaborationClient> = new Map();
  private sessions: Map<string, LiveCollaborationSession> = new Map();
  private documentStates: Map<string, { content: string; version: number; edits: LiveEdit[] }> = new Map();

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/ws/collaboration'
    });

    this.wss.on('connection', (ws, request) => {
      this.handleConnection(ws, request);
    });

    console.log('🔄 Real-time collaboration service initialized');
  }

  private handleConnection(ws: WebSocket, request: any) {
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    const userName = url.searchParams.get('userName');
    const sessionId = url.searchParams.get('sessionId');
    const projectId = url.searchParams.get('projectId');

    if (!userId || !userName || !sessionId || !projectId) {
      ws.close(1008, 'Missing required parameters');
      return;
    }

    const clientId = randomUUID();
    const client: CollaborationClient = {
      id: clientId,
      ws,
      userId,
      userName,
      sessionId,
      projectId,
      isTyping: false,
      lastActivity: new Date(),
    };

    this.clients.set(clientId, client);

    // Send initial session state
    this.sendToClient(client, {
      type: 'session_joined',
      sessionId,
      participants: this.getSessionParticipants(sessionId),
      documentState: this.getDocumentState(projectId),
    });

    // Notify other participants
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      user: { id: userId, name: userName },
      timestamp: new Date(),
    }, clientId);

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(client, message);
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnection(client);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.handleDisconnection(client);
    });
  }

  private handleMessage(client: CollaborationClient, message: any) {
    client.lastActivity = new Date();

    switch (message.type) {
      case 'code_edit':
        this.handleCodeEdit(client, message);
        break;
      case 'cursor_move':
        this.handleCursorMove(client, message);
        break;
      case 'typing_start':
        this.handleTypingStart(client);
        break;
      case 'typing_stop':
        this.handleTypingStop(client);
        break;
      case 'voice_offer':
      case 'voice_answer':
      case 'voice_ice_candidate':
        this.handleVoiceSignaling(client, message);
        break;
      case 'screen_share_start':
        this.handleScreenShareStart(client, message);
        break;
      case 'screen_share_stop':
        this.handleScreenShareStop(client);
        break;
      case 'chat_message':
        this.handleChatMessage(client, message);
        break;
      case 'whiteboard_draw':
        this.handleWhiteboardDraw(client, message);
        break;
      case 'circuit_edit':
        this.handleCircuitEdit(client, message);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleCodeEdit(client: CollaborationClient, message: any) {
    const { operation, position, content, version } = message;

    // Create edit record
    const edit: Partial<LiveEdit> = {
      sessionId: client.sessionId,
      userId: client.userId,
      operation,
      position,
      content,
    };

    // Apply edit to document state
    const docState = this.getDocumentState(client.projectId);
    if (version !== docState.version) {
      // Version conflict - send sync request
      this.sendToClient(client, {
        type: 'sync_required',
        currentVersion: docState.version,
        documentState: docState,
      });
      return;
    }

    // Apply edit and increment version
    this.applyEdit(client.projectId, edit as LiveEdit);

    // Broadcast edit to other participants
    this.broadcastToSession(client.sessionId, {
      type: 'code_edit_applied',
      edit,
      newVersion: docState.version + 1,
      author: { id: client.userId, name: client.userName },
    }, client.id);
  }

  private handleCursorMove(client: CollaborationClient, message: any) {
    client.cursor = message.cursor;

    this.broadcastToSession(client.sessionId, {
      type: 'cursor_moved',
      userId: client.userId,
      userName: client.userName,
      cursor: message.cursor,
    }, client.id);
  }

  private handleTypingStart(client: CollaborationClient) {
    if (!client.isTyping) {
      client.isTyping = true;
      this.broadcastToSession(client.sessionId, {
        type: 'typing_started',
        userId: client.userId,
        userName: client.userName,
      }, client.id);
    }
  }

  private handleTypingStop(client: CollaborationClient) {
    if (client.isTyping) {
      client.isTyping = false;
      this.broadcastToSession(client.sessionId, {
        type: 'typing_stopped',
        userId: client.userId,
        userName: client.userName,
      }, client.id);
    }
  }

  private handleVoiceSignaling(client: CollaborationClient, message: any) {
    // Forward WebRTC signaling messages to target participant
    const targetUserId = message.targetUserId;
    const targetClient = this.findClientByUserIdInSession(client.sessionId, targetUserId);

    if (targetClient) {
      this.sendToClient(targetClient, {
        ...message,
        fromUserId: client.userId,
        fromUserName: client.userName,
      });
    }
  }

  private handleScreenShareStart(client: CollaborationClient, message: any) {
    this.broadcastToSession(client.sessionId, {
      type: 'screen_share_started',
      userId: client.userId,
      userName: client.userName,
      streamId: message.streamId,
    }, client.id);
  }

  private handleScreenShareStop(client: CollaborationClient) {
    this.broadcastToSession(client.sessionId, {
      type: 'screen_share_stopped',
      userId: client.userId,
      userName: client.userName,
    }, client.id);
  }

  private handleChatMessage(client: CollaborationClient, message: any) {
    const chatMessage = {
      id: randomUUID(),
      channelId: client.sessionId,
      userId: client.userId,
      userName: client.userName,
      content: message.content,
      type: message.messageType || 'text',
      attachments: message.attachments,
      timestamp: new Date(),
    };

    this.broadcastToSession(client.sessionId, {
      type: 'chat_message_received',
      message: chatMessage,
    });
  }

  private handleWhiteboardDraw(client: CollaborationClient, message: any) {
    this.broadcastToSession(client.sessionId, {
      type: 'whiteboard_updated',
      userId: client.userId,
      userName: client.userName,
      drawData: message.drawData,
      timestamp: new Date(),
    }, client.id);
  }

  private handleCircuitEdit(client: CollaborationClient, message: any) {
    const { circuitData, operation } = message;

    this.broadcastToSession(client.sessionId, {
      type: 'circuit_updated',
      userId: client.userId,
      userName: client.userName,
      circuitData,
      operation,
      timestamp: new Date(),
    }, client.id);
  }

  private handleDisconnection(client: CollaborationClient) {
    this.clients.delete(client.id);

    // Notify other participants
    this.broadcastToSession(client.sessionId, {
      type: 'user_left',
      user: { id: client.userId, name: client.userName },
      timestamp: new Date(),
    });

    // Clean up typing state
    if (client.isTyping) {
      this.broadcastToSession(client.sessionId, {
        type: 'typing_stopped',
        userId: client.userId,
        userName: client.userName,
      });
    }
  }

  private getSessionParticipants(sessionId: string) {
    const participants = Array.from(this.clients.values())
      .filter(client => client.sessionId === sessionId)
      .map(client => ({
        id: client.userId,
        name: client.userName,
        cursor: client.cursor,
        isTyping: client.isTyping,
        lastActivity: client.lastActivity,
      }));

    return participants;
  }

  private getDocumentState(projectId: string) {
    if (!this.documentStates.has(projectId)) {
      this.documentStates.set(projectId, {
        content: '// Welcome to collaborative quantum circuit editing\\n// Start typing to see real-time collaboration!\\n',
        version: 0,
        edits: [],
      });
    }
    return this.documentStates.get(projectId)!;
  }

  private applyEdit(projectId: string, edit: LiveEdit) {
    const docState = this.getDocumentState(projectId);
    
    // Apply the edit to the content
    switch (edit.operation) {
      case 'insert':
        if (edit.position !== undefined && edit.content) {
          const lines = docState.content.split('\\n');
          const lineIndex = Math.floor(edit.position);
          const charIndex = edit.position % 1 * 1000; // Simplified position handling
          
          if (lineIndex < lines.length) {
            const line = lines[lineIndex];
            lines[lineIndex] = line.slice(0, charIndex) + edit.content + line.slice(charIndex);
            docState.content = lines.join('\\n');
          }
        }
        break;
      case 'delete':
        if (edit.position !== undefined && edit.content) {
          const lines = docState.content.split('\\n');
          const lineIndex = Math.floor(edit.position);
          const charIndex = edit.position % 1 * 1000;
          
          if (lineIndex < lines.length) {
            const line = lines[lineIndex];
            const deleteLength = edit.content.length;
            lines[lineIndex] = line.slice(0, charIndex) + line.slice(charIndex + deleteLength);
            docState.content = lines.join('\\n');
          }
        }
        break;
      case 'replace':
        // Handle replace operation
        break;
    }

    docState.edits.push(edit);
    docState.version++;
  }

  private findClientByUserIdInSession(sessionId: string, userId: string): CollaborationClient | undefined {
    return Array.from(this.clients.values())
      .find(client => client.sessionId === sessionId && client.userId === userId);
  }

  private sendToClient(client: CollaborationClient, data: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  private broadcastToSession(sessionId: string, data: any, excludeClientId?: string) {
    const sessionClients = Array.from(this.clients.values())
      .filter(client => client.sessionId === sessionId && client.id !== excludeClientId);

    sessionClients.forEach(client => {
      this.sendToClient(client, data);
    });
  }

  // Public API methods
  async createSession(sessionData: InsertLiveCollaborationSession): Promise<LiveCollaborationSession> {
    const session: LiveCollaborationSession = {
      id: randomUUID(),
      ...sessionData,
      startedAt: new Date(),
      endedAt: null,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      session.endedAt = new Date();

      // Disconnect all clients in this session
      const sessionClients = Array.from(this.clients.values())
        .filter(client => client.sessionId === sessionId);

      sessionClients.forEach(client => {
        this.sendToClient(client, {
          type: 'session_ended',
          reason: 'Host ended the session',
        });
        client.ws.close(1000, 'Session ended');
      });
    }
  }

  getActiveSessions(): LiveCollaborationSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'active');
  }

  getSessionParticipantCount(sessionId: string): number {
    return Array.from(this.clients.values())
      .filter(client => client.sessionId === sessionId).length;
  }

  // AI-powered collaboration suggestions
  async generateCollaborationSuggestions(sessionId: string): Promise<Array<{
    type: 'workflow' | 'communication' | 'code_quality' | 'productivity';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }>> {
    const participants = this.getSessionParticipants(sessionId);
    const suggestions = [];

    // Check for productivity patterns
    if (participants.length > 1) {
      const activeParticipants = participants.filter(p => 
        new Date().getTime() - p.lastActivity.getTime() < 5 * 60 * 1000 // 5 minutes
      );

      if (activeParticipants.length < participants.length / 2) {
        suggestions.push({
          type: 'productivity' as const,
          title: 'Low Engagement Detected',
          description: 'Some team members appear inactive. Consider a quick sync or break.',
          priority: 'medium' as const,
        });
      }
    }

    // Check for code quality patterns
    const typingParticipants = participants.filter(p => p.isTyping);
    if (typingParticipants.length > 2) {
      suggestions.push({
        type: 'workflow' as const,
        title: 'Multiple Concurrent Edits',
        description: 'Multiple people are editing simultaneously. Consider assigning specific sections.',
        priority: 'medium' as const,
      });
    }

    // Communication suggestions
    if (participants.length > 3) {
      suggestions.push({
        type: 'communication' as const,
        title: 'Large Team Session',
        description: 'Consider using voice chat or breaking into smaller groups for more effective collaboration.',
        priority: 'low' as const,
      });
    }

    return suggestions;
  }
}

export const realTimeCollaborationService = new RealTimeCollaborationService();
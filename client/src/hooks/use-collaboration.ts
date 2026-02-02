import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Participant {
    id: string;
    name: string;
    cursor?: { line: number; column: number };
    isTyping?: boolean;
    lastActivity?: string; // ISO string
}

export interface ChatMessage {
    id: string;
    channelId: string;
    userId: string;
    userName: string;
    content: string;
    type: string;
    timestamp: string;
    attachments?: any[];
}

interface UseCollaborationProps {
    userId: string;
    userName: string;
    sessionId: string;
    projectId: string;
    enabled?: boolean;
}

export function useCollaboration({
    userId,
    userName,
    sessionId,
    projectId,
    enabled = true
}: UseCollaborationProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [documentContent, setDocumentContent] = useState('');
    const [version, setVersion] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!enabled || !userId || !sessionId) return;

        // Use current host but change protocol to ws/wss
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host; // includes port if any
        const wsUrl = `${protocol}//${host}/ws/collaboration?userId=${userId}&userName=${encodeURIComponent(userName)}&sessionId=${sessionId}&projectId=${projectId}`;

        console.log('Connecting to WebSocket:', wsUrl);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            toast({
                title: "Connected",
                description: "Joined collaboration session",
            });
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            toast({
                title: "Connection Error",
                description: "Failed to connect to collaboration server",
                variant: "destructive"
            });
        };

        return () => {
            ws.close();
        };
    }, [userId, sessionId, projectId, enabled]);

    const handleMessage = (message: any) => {
        switch (message.type) {
            case 'session_joined':
                setParticipants(message.participants);
                setDocumentContent(message.documentState.content);
                setVersion(message.documentState.version);
                break;

            case 'user_joined':
                setParticipants(prev => [...prev, message.user]);
                toast({
                    title: "User Joined",
                    description: `${message.user.name} has joined the session`,
                });
                break;

            case 'user_left':
                setParticipants(prev => prev.filter(p => p.id !== message.user.id));
                break;

            case 'chat_message_received':
                setChatMessages(prev => [...prev, message.message]);
                break;

            case 'code_edit_applied':
                // In a real editor, we would apply operational transform or CRDT here
                // For simplicity, we might just re-sync or apply simple patch
                // This usually requires a more complex editor binding (like Monaco or CodeMirror)
                break;

            default:
                // Handle other messages
                break;
        }
    };

    const sendChatMessage = useCallback((content: string) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'chat_message',
                content,
                timestamp: new Date().toISOString()
            }));
        }
    }, []);

    return {
        isConnected,
        participants,
        chatMessages,
        documentContent,
        sendChatMessage,
    };
}

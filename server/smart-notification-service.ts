import type {
  Notification, InsertNotification, UserProfile, Job, Project,
  Workspace, Achievement, Challenge, ChallengeParticipant,
  LiveCollaborationSession, ChatMessage
} from '@shared/schema';
import { randomUUID } from 'crypto';
import { realTimeCollaborationService } from './real-time-collaboration-service';
import { gamificationService } from './gamification-service';

export class SmartNotificationService {
  private notifications: Map<string, Notification> = new Map();
  private userPreferences: Map<string, NotificationPreferences> = new Map();
  private activeSubscriptions: Map<string, Set<string>> = new Map(); // userId -> Set of subscription types

  constructor() {
    // Initialize with default notification channels and preferences
    this.initializeNotificationChannels();
  }

  private initializeNotificationChannels() {
    // Set up periodic notification processing
    setInterval(() => {
      this.processContextualNotifications();
    }, 30 * 1000); // Every 30 seconds

    // Set up intelligent batching
    setInterval(() => {
      this.processBatchedNotifications();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Context-Aware Notification Generation
  async generateSmartNotifications(context: {
    eventType: string;
    data: any;
    userId?: string;
    workspaceId?: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<Notification[]> {
    const notifications: Notification[] = [];

    switch (context.eventType) {
      case 'job_completed':
        notifications.push(...await this.generateJobCompletionNotifications(context));
        break;
      case 'collaboration_request':
        notifications.push(...await this.generateCollaborationNotifications(context));
        break;
      case 'achievement_unlocked':
        notifications.push(...await this.generateAchievementNotifications(context));
        break;
      case 'project_milestone':
        notifications.push(...await this.generateProjectMilestoneNotifications(context));
        break;
      case 'team_insight':
        notifications.push(...await this.generateTeamInsightNotifications(context));
        break;
      case 'hardware_available':
        notifications.push(...await this.generateHardwareNotifications(context));
        break;
      case 'mentor_request':
        notifications.push(...await this.generateMentorshipNotifications(context));
        break;
      case 'challenge_update':
        notifications.push(...await this.generateChallengeNotifications(context));
        break;
      default:
        console.warn(`Unknown event type: ${context.eventType}`);
    }

    // Store and route notifications
    for (const notification of notifications) {
      await this.storeAndRouteNotification(notification);
    }

    return notifications;
  }

  private async generateJobCompletionNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const job = context.data as Job;

    if (job.status === 'done' && job.userId) {
      // Success notification for job owner
      notifications.push({
        id: randomUUID(),
        userId: job.userId,
        type: 'success',
        title: `✅ Job "${job.name}" completed successfully!`,
        message: `Your quantum job finished with ${job.shots} shots on ${job.backend}. View results to see the exciting outcomes!`,
        data: {
          jobId: job.id,
          backend: job.backend,
          runtime: job.duration,
          action: 'view_results',
        },
        priority: 'medium',
        channels: ['web', 'email'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        category: 'job',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });

      // Notify collaborators if it's a team project
      if (context.workspaceId) {
        const workspaceMembers = await this.getWorkspaceMembers(context.workspaceId);
        for (const member of workspaceMembers) {
          if (member.userId !== job.userId) {
            notifications.push({
              id: randomUUID(),
              userId: member.userId,
              type: 'info',
              title: `🎯 Team job completed by ${job.userId}`,
              message: `"${job.name}" has finished running. Check out the results and contribute your insights!`,
              data: {
                jobId: job.id,
                completedBy: job.userId,
                workspaceId: context.workspaceId,
                action: 'view_team_results',
              },
              priority: 'low',
              channels: ['web'],
              isRead: false,
              scheduledFor: null,
              expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
              createdAt: new Date(),
              category: 'job',
              actionUrl: null,
              actionLabel: null,
              readAt: null,
            });
          }
        }
      }
    } else if (job.status === 'failed' && job.userId) {
      // Error notification with smart troubleshooting
      const troubleshootingTips = await this.generateTroubleshootingTips(job.error || 'Unknown error');

      notifications.push({
        id: randomUUID(),
        userId: job.userId,
        type: 'error',
        title: `❌ Job "${job.name}" encountered an issue`,
        message: `Don't worry! Here are some suggestions to resolve this: ${troubleshootingTips.slice(0, 2).join(', ')}`,
        data: {
          jobId: job.id,
          error: job.error,
          troubleshootingTips,
          action: 'troubleshoot',
        },
        priority: 'high',
        channels: ['web', 'email'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        createdAt: new Date(),
        category: 'job',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });
    }

    return notifications;
  }

  private async generateCollaborationNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { requesterId, targetUserId, projectId, type } = context.data;

    // Collaboration request notification
    notifications.push({
      id: randomUUID(),
      userId: targetUserId,
      type: 'collaboration',
      title: `🤝 Collaboration invitation`,
      message: `${requesterId} would like to collaborate on an exciting quantum project. Join the team!`,
      data: {
        requesterId,
        projectId,
        collaborationType: type,
        action: 'accept_collaboration',
      },
      priority: 'medium',
      channels: ['web', 'email'],
      isRead: false,
      scheduledFor: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      category: 'collaboration',
      actionUrl: null,
      actionLabel: null,
      readAt: null,
    });

    return notifications;
  }

  private async generateAchievementNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { userId, achievementId } = context.data;

    const achievement = await this.getAchievement(achievementId);
    if (!achievement) return notifications;

    // Achievement unlock notification
    notifications.push({
      id: randomUUID(),
      userId,
      type: 'achievement',
      title: `🏆 Achievement Unlocked: ${achievement.name}!`,
      message: `${achievement.description} You've earned ${achievement.points} points! Keep up the excellent work!`,
      data: {
        achievementId,
        points: achievement.points,
        rarity: achievement.rarity,
        action: 'view_achievement',
      },
      priority: achievement.rarity === 'legendary' ? 'high' : 'medium',
      channels: ['web', 'push'],
      isRead: false,
      scheduledFor: null,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      category: 'gamification', // Achievement is gamification
      actionUrl: null,
      actionLabel: null,
      readAt: null,
    });

    // Notify team members for significant achievements
    if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
      const userWorkspaces = await this.getUserWorkspaces(userId);
      for (const workspace of userWorkspaces) {
        const members = await this.getWorkspaceMembers(workspace.id);
        for (const member of members) {
          if (member.userId !== userId) {
            notifications.push({
              id: randomUUID(),
              userId: member.userId,
              type: 'team_celebration',
              title: `🎉 Team member achieved ${achievement.name}!`,
              message: `${userId} just unlocked a ${achievement.rarity} achievement! Congratulate them on this amazing milestone!`,
              data: {
                achieverId: userId,
                achievementId,
                workspaceId: workspace.id,
                action: 'congratulate',
              },
              priority: 'low',
              channels: ['web'],
              isRead: false,
              scheduledFor: null,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              createdAt: new Date(),
              category: 'gamification',
              actionUrl: null,
              actionLabel: null,
              readAt: null,
            });
          }
        }
      }
    }

    return notifications;
  }

  private async generateProjectMilestoneNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { projectId, milestone, progress, workspaceId } = context.data;

    const project = await this.getProject(projectId);
    if (!project) return notifications;

    // Milestone notification for project owner
    notifications.push({
      id: randomUUID(),
      userId: project.ownerId,
      type: 'milestone',
      title: `🚀 Project milestone reached!`,
      message: `"${project.name}" has reached ${milestone}! Your project is ${progress}% complete. Keep pushing forward!`,
      data: {
        projectId,
        milestone,
        progress,
        action: 'view_project',
      },
      priority: 'medium',
      channels: ['web', 'push'],
      isRead: false,
      scheduledFor: null,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      createdAt: new Date(),
      category: 'project',
      actionUrl: null,
      actionLabel: null,
      readAt: null,
    });

    // Notify team members
    if (workspaceId) {
      const members = await this.getWorkspaceMembers(workspaceId);
      for (const member of members) {
        if (member.userId !== project.ownerId) {
          notifications.push({
            id: randomUUID(),
            userId: member.userId,
            type: 'team_progress',
            title: `📈 Team project progress update`,
            message: `Great news! "${project.name}" just hit ${milestone}. The team effort is paying off!`,
            data: {
              projectId,
              milestone,
              progress,
              workspaceId,
              action: 'view_team_project',
            },
            priority: 'low',
            channels: ['web'],
            isRead: false,
            scheduledFor: null,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            createdAt: new Date(),
            category: 'project',
            actionUrl: null,
            actionLabel: null,
            readAt: null,
          });
        }
      }
    }

    return notifications;
  }

  private async generateTeamInsightNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { workspaceId, insightType, insight, targetUsers } = context.data;

    for (const userId of targetUsers) {
      let title = '';
      let message = '';
      let priority: 'low' | 'medium' | 'high' = 'medium';

      switch (insightType) {
        case 'optimization_opportunity':
          title = '⚡ Optimization opportunity detected';
          message = `AI analysis found a way to improve your team's performance: ${insight}`;
          priority = 'medium';
          break;
        case 'collaboration_suggestion':
          title = '🧠 Smart collaboration suggestion';
          message = `Based on your team dynamics: ${insight}`;
          priority = 'low';
          break;
        case 'breakthrough_prediction':
          title = '🔬 Breakthrough opportunity ahead';
          message = `Your team is positioned for a major discovery: ${insight}`;
          priority = 'high';
          break;
        default:
          title = '💡 Team insight';
          message = insight;
      }

      notifications.push({
        id: randomUUID(),
        userId,
        type: 'insight',
        title,
        message,
        data: {
          workspaceId,
          insightType,
          insight,
          action: 'view_insight',
        },
        priority,
        channels: ['web'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        createdAt: new Date(),
        category: 'insight',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });
    }

    return notifications;
  }

  private async generateHardwareNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { backend, availability, targetUsers } = context.data;

    for (const userId of targetUsers) {
      notifications.push({
        id: randomUUID(),
        userId,
        type: 'hardware',
        title: `⚙️ ${backend} is now available!`,
        message: `Perfect timing! The quantum backend you've been waiting for is ready. Submit your jobs now for faster processing.`,
        data: {
          backend,
          availability,
          action: 'submit_job',
        },
        priority: 'medium',
        channels: ['web', 'push'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
        createdAt: new Date(),
        category: 'hardware',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });
    }

    return notifications;
  }

  private async generateMentorshipNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { mentorId, menteeId, type, topic } = context.data;

    if (type === 'request') {
      // Mentor request notification
      notifications.push({
        id: randomUUID(),
        userId: mentorId,
        type: 'mentorship',
        title: `🎓 Mentorship request`,
        message: `A team member needs guidance on ${topic}. Share your expertise and help them grow!`,
        data: {
          menteeId,
          topic,
          action: 'accept_mentorship',
        },
        priority: 'medium',
        channels: ['web', 'email'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
        category: 'mentorship',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });
    } else if (type === 'accepted') {
      // Mentorship accepted notification
      notifications.push({
        id: randomUUID(),
        userId: menteeId,
        type: 'mentorship',
        title: `🤝 Mentorship accepted!`,
        message: `Great news! Your mentor is ready to help you with ${topic}. Start your learning journey!`,
        data: {
          mentorId,
          topic,
          action: 'start_session',
        },
        priority: 'high',
        channels: ['web', 'push'],
        isRead: false,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        createdAt: new Date(),
        category: 'mentorship',
        actionUrl: null,
        actionLabel: null,
        readAt: null,
      });
    }

    return notifications;
  }

  private async generateChallengeNotifications(context: any): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const { challengeId, participantId, updateType } = context.data;

    const challenge = await this.getChallenge(challengeId);
    if (!challenge) return notifications;

    switch (updateType) {
      case 'new_challenge':
        // Notify all eligible users about new challenge
        const eligibleUsers = await this.getEligibleUsersForChallenge(challengeId);
        for (const userId of eligibleUsers) {
          notifications.push({
            id: randomUUID(),
            userId,
            type: 'challenge',
            title: `🎯 New challenge: ${challenge.name}`,
            message: `A perfect challenge for your skill level just launched! Join now and test your quantum skills.`,
            data: {
              challengeId,
              difficulty: challenge.difficulty,
              action: 'join_challenge',
            },
            priority: 'medium',
            channels: ['web'],
            isRead: false,
            scheduledFor: null,
            expiresAt: challenge.endDate,
            createdAt: new Date(),
            category: 'challenge',
            actionUrl: null,
            actionLabel: null,
            readAt: null,
          });
        }
        break;

      case 'progress_milestone':
        notifications.push({
          id: randomUUID(),
          userId: participantId!,
          type: 'challenge',
          title: `🏃 Challenge progress milestone!`,
          message: `You're making excellent progress in "${challenge.name}"! Keep up the momentum!`,
          data: {
            challengeId,
            progress: context.data.progress,
            action: 'view_progress',
          },
          priority: 'low',
          channels: ['web'],
          isRead: false,
          scheduledFor: null,
          expiresAt: challenge.endDate,
          createdAt: new Date(),
          category: 'challenge',
          actionUrl: null,
          actionLabel: null,
          readAt: null,
        });
        break;

      case 'completion':
        notifications.push({
          id: randomUUID(),
          userId: participantId!,
          type: 'challenge',
          title: `🏆 Challenge completed!`,
          message: `Congratulations! You've successfully completed "${challenge.name}". Check your rewards!`,
          data: {
            challengeId,
            score: context.data.score,
            action: 'view_rewards',
          },
          priority: 'high',
          channels: ['web', 'push'],
          isRead: false,
          scheduledFor: null,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          createdAt: new Date(),
          category: 'challenge',
          actionUrl: null,
          actionLabel: null,
          readAt: null,
        });
        break;
    }

    return notifications;
  }

  // Intelligent Batching and Scheduling
  private async processBatchedNotifications(): Promise<void> {
    const now = new Date();

    // Group notifications by user and type for batching
    const batchGroups: Record<string, Notification[]> = {};

    for (const notification of Array.from(this.notifications.values())) {
      if (notification.scheduledFor && notification.scheduledFor <= now && !notification.isRead) {
        const key = `${notification.userId}_${notification.type}`;
        if (!batchGroups[key]) {
          batchGroups[key] = [];
        }
        batchGroups[key].push(notification);
      }
    }

    // Process batched notifications
    for (const [key, notifications] of Object.entries(batchGroups)) {
      if (notifications.length > 1) {
        await this.createBatchedNotification(notifications);
      } else {
        await this.sendSingleNotification(notifications[0]);
      }
    }
  }

  private async createBatchedNotification(notifications: Notification[]): Promise<void> {
    const userId = notifications[0].userId;
    const type = notifications[0].type;

    const batchedNotification: Notification = {
      id: randomUUID(),
      userId,
      type: 'batch',
      title: `📬 ${notifications.length} ${type} updates`,
      message: `You have ${notifications.length} new ${type} notifications. Tap to view all updates.`,
      data: {
        batchedNotifications: notifications.map(n => n.id),
        count: notifications.length,
        action: 'view_batch',
      },
      priority: 'medium',
      channels: ['web', 'push'],
      isRead: false,
      scheduledFor: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      category: 'system',
      actionUrl: null,
      actionLabel: null,
      readAt: null,
    };

    await this.storeAndRouteNotification(batchedNotification);

    // Mark original notifications as batched
    for (const notification of notifications) {
      notification.data = { ...(notification.data as object), batched: true };
    }
  }

  private async sendSingleNotification(notification: Notification): Promise<void> {
    // Send through appropriate channels
    for (const channel of notification.channels) {
      await this.sendThroughChannel(notification, channel);
    }
  }

  private async sendThroughChannel(notification: Notification, channel: string): Promise<void> {
    switch (channel) {
      case 'web':
        // Real-time web notification (handled by frontend)
        break;
      case 'email':
        // Email notification (would integrate with email service)
        console.log(`Email notification sent to ${notification.userId}: ${notification.title}`);
        break;
      case 'push':
        // Push notification (would integrate with push service)
        console.log(`Push notification sent to ${notification.userId}: ${notification.title}`);
        break;
      default:
        console.warn(`Unknown notification channel: ${channel}`);
    }
  }

  // Context-Aware Processing
  private async processContextualNotifications(): Promise<void> {
    // Check for time-sensitive contexts
    await this.checkDeadlineReminders();
    await this.checkCollaborationOpportunities();
    await this.checkPerformanceAnomalies();
  }

  private async checkDeadlineReminders(): Promise<void> {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Check for upcoming challenge deadlines
    const challenges = await this.getActiveChallenges();
    for (const challenge of challenges) {
      if (challenge.endDate <= oneDayFromNow && challenge.endDate > now) {
        await this.generateSmartNotifications({
          eventType: 'deadline_reminder',
          data: { challengeId: challenge.id, timeRemaining: '24 hours' },
          urgency: 'high',
        });
      }
    }
  }

  private async checkCollaborationOpportunities(): Promise<void> {
    // Look for users who might benefit from collaboration
    // This would use AI analysis to identify collaboration patterns
    console.log('Checking for collaboration opportunities...');
  }

  private async checkPerformanceAnomalies(): Promise<void> {
    // Monitor for unusual patterns that might need attention
    console.log('Checking for performance anomalies...');
  }

  // Troubleshooting Assistant
  private async generateTroubleshootingTips(error: string): Promise<string[]> {
    const tips = [];

    if (error.toLowerCase().includes('timeout')) {
      tips.push('Try reducing the number of shots or circuit complexity');
      tips.push('Consider using a different backend with shorter queue times');
      tips.push('Check if the backend is experiencing high traffic');
    } else if (error.toLowerCase().includes('calibration')) {
      tips.push('Wait for the next calibration cycle and retry');
      tips.push('Try a different backend with recent calibration');
      tips.push('Consider using error mitigation techniques');
    } else if (error.toLowerCase().includes('gate')) {
      tips.push('Review your circuit for unsupported gate operations');
      tips.push('Check the backend\'s gate set compatibility');
      tips.push('Try decomposing complex gates into supported primitives');
    } else {
      tips.push('Review the job parameters and circuit design');
      tips.push('Check the documentation for similar issues');
      tips.push('Consider reaching out to the community for help');
    }

    return tips;
  }

  // Notification Management
  private async storeAndRouteNotification(notification: Notification): Promise<void> {
    this.notifications.set(notification.id, notification);

    // Check user preferences and route accordingly
    const preferences = this.getUserNotificationPreferences(notification.userId);

    if (this.shouldSendImmediately(notification, preferences)) {
      await this.sendSingleNotification(notification);
    } else {
      // Schedule for batching
      notification.scheduledFor = this.calculateScheduledTime(notification, preferences);
    }
  }

  private getUserNotificationPreferences(userId: string): NotificationPreferences {
    return this.userPreferences.get(userId) || {
      enabledChannels: ['web', 'email'],
      batchingEnabled: true,
      batchingInterval: 60, // minutes
      quietHours: { start: 22, end: 8 },
      priorityThreshold: 'medium',
    };
  }

  private shouldSendImmediately(notification: Notification, preferences: NotificationPreferences): boolean {
    return notification.priority === 'critical' ||
      notification.priority === 'high' ||
      notification.type === 'achievement' ||
      !preferences.batchingEnabled;
  }

  private calculateScheduledTime(notification: Notification, preferences: NotificationPreferences): Date {
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + preferences.batchingInterval * 60 * 1000);

    // Respect quiet hours
    const hour = scheduledTime.getHours();
    if (hour >= preferences.quietHours.start || hour <= preferences.quietHours.end) {
      scheduledTime.setHours(preferences.quietHours.end + 1, 0, 0, 0);
    }

    return scheduledTime;
  }

  // Public API Methods
  async getNotificationsForUser(userId: string, limit: number = 50): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<void> {
    const current = this.getUserNotificationPreferences(userId);
    this.userPreferences.set(userId, { ...current, ...preferences });
  }

  // Helper methods (these would integrate with actual storage)
  private async getWorkspaceMembers(workspaceId: string): Promise<Array<{ userId: string }>> {
    // Placeholder - would fetch from actual storage
    return [{ userId: 'user1' }, { userId: 'user2' }];
  }

  private async getAchievement(achievementId: string): Promise<any> {
    // Placeholder - would fetch from gamification service
    return { name: 'Test Achievement', description: 'Test', points: 100, rarity: 'common' };
  }

  private async getUserWorkspaces(userId: string): Promise<Array<{ id: string }>> {
    // Placeholder - would fetch from actual storage
    return [{ id: 'workspace1' }];
  }

  private async getProject(projectId: string): Promise<any> {
    // Placeholder - would fetch from actual storage
    return { name: 'Test Project', ownerId: 'user1' };
  }

  private async getChallenge(challengeId: string): Promise<any> {
    // Placeholder - would fetch from gamification service
    return { name: 'Test Challenge', difficulty: 'intermediate', endDate: new Date() };
  }

  private async getEligibleUsersForChallenge(challengeId: string): Promise<string[]> {
    // Placeholder - would determine eligibility based on user profiles
    return ['user1', 'user2', 'user3'];
  }

  private async getActiveChallenges(): Promise<Array<{ id: string; endDate: Date }>> {
    // Placeholder - would fetch from gamification service
    return [];
  }
}

interface NotificationPreferences {
  enabledChannels: string[];
  batchingEnabled: boolean;
  batchingInterval: number; // minutes
  quietHours: { start: number; end: number }; // 24-hour format
  priorityThreshold: 'low' | 'medium' | 'high';
}

export const smartNotificationService = new SmartNotificationService();
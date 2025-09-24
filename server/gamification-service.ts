import type { 
  Achievement, InsertAchievement, UserAchievement, InsertUserAchievement,
  Challenge, InsertChallenge, ChallengeParticipant, InsertChallengeParticipant,
  UserProfile, Project, Job, Workspace, CollaborationMetric
} from '@shared/schema';
import { randomUUID } from 'crypto';
import { aiCollaborationService } from './ai-collaboration-service';

export class GamificationService {
  private achievements: Map<string, Achievement> = new Map();
  private userAchievements: Map<string, UserAchievement> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private challengeParticipants: Map<string, ChallengeParticipant> = new Map();

  constructor() {
    this.initializeAchievements();
    this.initializeChallenges();
  }

  private initializeAchievements() {
    const achievements: Achievement[] = [
      // Collaboration Achievements
      {
        id: 'first_collaboration',
        name: 'First Steps Together',
        description: 'Join your first collaborative workspace',
        icon: '🤝',
        category: 'collaboration',
        points: 50,
        rarity: 'common',
        requirements: { action: 'join_workspace', count: 1 },
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Successfully collaborate on 5 projects',
        icon: '👥',
        category: 'collaboration',
        points: 200,
        rarity: 'uncommon',
        requirements: { action: 'complete_collaborative_project', count: 5 },
      },
      {
        id: 'mentor_master',
        name: 'Mentor Master',
        description: 'Help 10 team members solve quantum problems',
        icon: '🎓',
        category: 'mentoring',
        points: 500,
        rarity: 'rare',
        requirements: { action: 'mentor_help', count: 10 },
      },
      {
        id: 'quantum_einstein',
        name: 'Quantum Einstein',
        description: 'Lead a breakthrough discovery in quantum computing',
        icon: '🧠',
        category: 'innovation',
        points: 1000,
        rarity: 'legendary',
        requirements: { action: 'breakthrough_discovery', count: 1 },
      },

      // Optimization Achievements
      {
        id: 'optimizer',
        name: 'Circuit Optimizer',
        description: 'Optimize quantum circuits to reduce depth by 50%',
        icon: '⚡',
        category: 'optimization',
        points: 150,
        rarity: 'uncommon',
        requirements: { action: 'optimize_circuit', improvement: 50 },
      },
      {
        id: 'efficiency_expert',
        name: 'Efficiency Expert',
        description: 'Improve team productivity by 30% through optimizations',
        icon: '🚀',
        category: 'optimization',
        points: 300,
        rarity: 'rare',
        requirements: { action: 'productivity_improvement', percentage: 30 },
      },

      // Innovation Achievements
      {
        id: 'algorithm_creator',
        name: 'Algorithm Creator',
        description: 'Develop a novel quantum algorithm',
        icon: '🔬',
        category: 'innovation',
        points: 750,
        rarity: 'epic',
        requirements: { action: 'create_algorithm', verified: true },
      },
      {
        id: 'paper_publisher',
        name: 'Research Pioneer',
        description: 'Publish a research paper with your team',
        icon: '📄',
        category: 'innovation',
        points: 600,
        rarity: 'epic',
        requirements: { action: 'publish_paper', status: 'accepted' },
      },

      // Learning Achievements
      {
        id: 'quick_learner',
        name: 'Quick Learner',
        description: 'Complete 3 challenges in one week',
        icon: '🏃',
        category: 'collaboration',
        points: 100,
        rarity: 'common',
        requirements: { action: 'complete_challenges', count: 3, timeframe: '1_week' },
      },
      {
        id: 'knowledge_sharer',
        name: 'Knowledge Sharer',
        description: 'Write 5 helpful knowledge base articles',
        icon: '📚',
        category: 'collaboration',
        points: 250,
        rarity: 'uncommon',
        requirements: { action: 'write_articles', count: 5, min_likes: 10 },
      },
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  private initializeChallenges() {
    const challenges: Challenge[] = [
      // Team Challenges
      {
        id: 'quantum_hackathon_2025',
        name: 'Quantum Hackathon 2025',
        description: 'Build innovative quantum applications in teams of 3-5 people',
        type: 'team',
        category: 'collaboration',
        difficulty: 'intermediate',
        requirements: {
          team_size: [3, 5],
          duration: '48_hours',
          skills: ['Qiskit', 'Python', 'Quantum Algorithms'],
        },
        rewards: {
          points: [1000, 750, 500], // 1st, 2nd, 3rd place
          achievements: ['hackathon_winner', 'team_collaborator'],
          prizes: ['Quantum Computing Certification', 'Conference Tickets'],
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        status: 'active',
        maxParticipants: 50,
        currentParticipants: 0,
      },

      // Individual Challenges
      {
        id: 'vqe_mastery',
        name: 'VQE Mastery Challenge',
        description: 'Implement and optimize a Variational Quantum Eigensolver',
        type: 'individual',
        category: 'algorithm',
        difficulty: 'advanced',
        requirements: {
          tasks: [
            'Implement VQE algorithm',
            'Optimize for hydrogen molecule',
            'Achieve 99% accuracy',
            'Document methodology',
          ],
          time_limit: '2_weeks',
        },
        rewards: {
          points: 500,
          achievements: ['vqe_expert'],
          badges: ['Algorithm Specialist'],
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        maxParticipants: 100,
        currentParticipants: 23,
      },

      // Global Challenges
      {
        id: 'quantum_optimization_global',
        name: 'Global Quantum Optimization Challenge',
        description: 'Collaborate worldwide to solve complex optimization problems',
        type: 'global',
        category: 'optimization',
        difficulty: 'expert',
        requirements: {
          global_collaboration: true,
          min_countries: 5,
          problem_types: ['TSP', 'Portfolio Optimization', 'Logistics'],
        },
        rewards: {
          points: 2000,
          achievements: ['global_collaborator', 'optimization_master'],
          recognition: 'Featured on Quantum Research Portal',
        },
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
        maxParticipants: 1000,
        currentParticipants: 156,
      },
    ];

    challenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  // Achievement System
  async checkAndAwardAchievements(userId: string, action: string, context: any): Promise<UserAchievement[]> {
    const awarded: UserAchievement[] = [];
    const userAchievements = this.getUserAchievements(userId);
    const earnedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId));

    for (const achievement of this.achievements.values()) {
      if (earnedAchievementIds.has(achievement.id)) {
        continue; // Already earned
      }

      if (await this.meetsRequirements(userId, achievement, action, context)) {
        const userAchievement = await this.awardAchievement(userId, achievement.id, context);
        awarded.push(userAchievement);
      }
    }

    return awarded;
  }

  private async meetsRequirements(
    userId: string,
    achievement: Achievement,
    action: string,
    context: any
  ): Promise<boolean> {
    const requirements = achievement.requirements as any;

    // Check if action matches
    if (requirements.action && requirements.action !== action) {
      return false;
    }

    // Check count requirements
    if (requirements.count) {
      const userCount = await this.getUserActionCount(userId, action);
      if (userCount < requirements.count) {
        return false;
      }
    }

    // Check percentage/improvement requirements
    if (requirements.improvement && context.improvement < requirements.improvement) {
      return false;
    }

    if (requirements.percentage && context.percentage < requirements.percentage) {
      return false;
    }

    // Check timeframe requirements
    if (requirements.timeframe) {
      const timeframeStart = this.getTimeframeStart(requirements.timeframe);
      const recentActions = await this.getUserActionsInTimeframe(userId, action, timeframeStart);
      if (recentActions < requirements.count) {
        return false;
      }
    }

    // Check verification requirements
    if (requirements.verified && !context.verified) {
      return false;
    }

    return true;
  }

  private async awardAchievement(userId: string, achievementId: string, context: any): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: randomUUID(),
      userId,
      achievementId,
      unlockedAt: new Date(),
      data: context,
    };

    this.userAchievements.set(userAchievement.id, userAchievement);

    // Award points to user
    const achievement = this.achievements.get(achievementId);
    if (achievement) {
      await this.addPointsToUser(userId, achievement.points);
    }

    return userAchievement;
  }

  // Challenge System
  async joinChallenge(userId: string, challengeId: string, workspaceId?: string): Promise<ChallengeParticipant> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    if (challenge.currentParticipants >= challenge.maxParticipants) {
      throw new Error('Challenge is full');
    }

    const participant: ChallengeParticipant = {
      id: randomUUID(),
      challengeId,
      userId,
      workspaceId: workspaceId || null,
      progress: 0,
      score: 0,
      status: 'in_progress',
      joinedAt: new Date(),
      completedAt: null,
      data: {},
    };

    this.challengeParticipants.set(participant.id, participant);
    challenge.currentParticipants++;

    return participant;
  }

  async updateChallengeProgress(
    participantId: string,
    progress: number,
    score?: number,
    data?: any
  ): Promise<ChallengeParticipant> {
    const participant = this.challengeParticipants.get(participantId);
    if (!participant) {
      throw new Error('Participant not found');
    }

    participant.progress = Math.min(100, Math.max(0, progress));
    if (score !== undefined) {
      participant.score = score;
    }
    if (data) {
      participant.data = { ...participant.data, ...data };
    }

    if (participant.progress >= 100 && participant.status === 'in_progress') {
      participant.status = 'completed';
      participant.completedAt = new Date();

      // Award challenge completion achievements
      await this.checkAndAwardAchievements(participant.userId!, 'complete_challenge', {
        challengeId: participant.challengeId,
        score: participant.score,
        duration: participant.completedAt.getTime() - participant.joinedAt.getTime(),
      });
    }

    return participant;
  }

  // Smart Challenge Recommendations
  async generateChallengeRecommendations(user: UserProfile): Promise<Array<{
    challenge: Challenge;
    reason: string;
    confidence: number;
    estimatedDifficulty: 'perfect' | 'challenging' | 'stretch';
  }>> {
    const recommendations = [];
    const userLevel = user.level || 1;
    const userSkills = user.skills || [];
    const userExperience = user.experience || 'beginner';

    for (const challenge of this.challenges.values()) {
      if (challenge.status !== 'active') continue;

      let confidence = 50;
      let reason = '';
      let estimatedDifficulty: 'perfect' | 'challenging' | 'stretch' = 'perfect';

      // Analyze skill match
      const challengeSkills = (challenge.requirements as any).skills || [];
      const skillMatch = challengeSkills.filter((skill: string) => 
        userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
      ).length;

      if (skillMatch > 0) {
        confidence += skillMatch * 15;
        reason += `Matches ${skillMatch} of your skills. `;
      }

      // Analyze difficulty vs experience
      const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
      const experienceMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
      
      const challengeDifficulty = difficultyMap[challenge.difficulty as keyof typeof difficultyMap] || 2;
      const userExperienceLevel = experienceMap[userExperience as keyof typeof experienceMap] || 1;

      if (challengeDifficulty === userExperienceLevel) {
        confidence += 20;
        reason += 'Perfect difficulty match. ';
        estimatedDifficulty = 'perfect';
      } else if (challengeDifficulty === userExperienceLevel + 1) {
        confidence += 10;
        reason += 'Good challenge level. ';
        estimatedDifficulty = 'challenging';
      } else if (challengeDifficulty === userExperienceLevel + 2) {
        confidence -= 10;
        reason += 'Ambitious stretch goal. ';
        estimatedDifficulty = 'stretch';
      } else if (challengeDifficulty < userExperienceLevel) {
        confidence -= 15;
        reason += 'May be too easy. ';
      }

      // Consider challenge type preference
      if (challenge.type === 'team' && userLevel > 5) {
        confidence += 10;
        reason += 'Great for collaboration. ';
      }

      // Only recommend if confidence is reasonable
      if (confidence >= 40) {
        recommendations.push({
          challenge,
          reason: reason.trim(),
          confidence,
          estimatedDifficulty,
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  // Dynamic Team Formation for Challenges
  async suggestTeamFormation(challengeId: string, availableUsers: UserProfile[]): Promise<Array<{
    team: UserProfile[];
    synergy: number;
    strengths: string[];
    recommendations: string[];
  }>> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge || challenge.type !== 'team') {
      return [];
    }

    const requirements = challenge.requirements as any;
    const teamSize = requirements.team_size || [3, 5];
    const requiredSkills = requirements.skills || [];

    const teamSuggestions = [];

    // Generate multiple team combinations
    for (let size = teamSize[0]; size <= teamSize[1]; size++) {
      const combinations = this.generateTeamCombinations(availableUsers, size);
      
      for (const team of combinations.slice(0, 10)) { // Limit to prevent performance issues
        const analysis = this.analyzeTeamSynergy(team, requiredSkills);
        
        if (analysis.synergy >= 60) { // Only suggest teams with good synergy
          teamSuggestions.push(analysis);
        }
      }
    }

    return teamSuggestions
      .sort((a, b) => b.synergy - a.synergy)
      .slice(0, 5);
  }

  private generateTeamCombinations(users: UserProfile[], size: number): UserProfile[][] {
    if (size === 1) return users.map(user => [user]);
    if (size > users.length) return [];

    const combinations: UserProfile[][] = [];
    
    for (let i = 0; i < users.length - size + 1; i++) {
      const remaining = users.slice(i + 1);
      const smallerCombinations = this.generateTeamCombinations(remaining, size - 1);
      
      for (const combination of smallerCombinations) {
        combinations.push([users[i], ...combination]);
      }
    }

    return combinations;
  }

  private analyzeTeamSynergy(team: UserProfile[], requiredSkills: string[]): {
    team: UserProfile[];
    synergy: number;
    strengths: string[];
    recommendations: string[];
  } {
    let synergy = 50; // Base synergy
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // Analyze skill coverage
    const teamSkills = team.flatMap(member => member.skills || []);
    const uniqueSkills = [...new Set(teamSkills)];
    const skillCoverage = requiredSkills.filter(skill => 
      teamSkills.some(teamSkill => teamSkill.toLowerCase().includes(skill.toLowerCase()))
    );

    synergy += (skillCoverage.length / requiredSkills.length) * 30;
    if (skillCoverage.length === requiredSkills.length) {
      strengths.push('Complete skill coverage');
    }

    // Analyze experience diversity
    const experienceLevels = team.map(member => member.experience || 'beginner');
    const uniqueExperience = [...new Set(experienceLevels)];
    if (uniqueExperience.length > 1) {
      synergy += 15;
      strengths.push('Diverse experience levels');
    }

    // Check for mentorship opportunities
    const hasExpert = experienceLevels.includes('expert') || experienceLevels.includes('advanced');
    const hasNovice = experienceLevels.includes('beginner') || experienceLevels.includes('intermediate');
    if (hasExpert && hasNovice) {
      synergy += 10;
      strengths.push('Mentorship opportunities');
    }

    // Analyze collaboration history (simplified)
    const totalPoints = team.reduce((sum, member) => sum + (member.totalPoints || 0), 0);
    const avgPoints = totalPoints / team.length;
    if (avgPoints > 1000) {
      synergy += 10;
      strengths.push('Experienced collaborators');
    }

    // Generate recommendations
    const missingSkills = requiredSkills.filter(skill => 
      !teamSkills.some(teamSkill => teamSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    
    if (missingSkills.length > 0) {
      recommendations.push(`Consider adding expertise in: ${missingSkills.join(', ')}`);
    }

    if (team.length < 4) {
      recommendations.push('Consider adding one more member for better workload distribution');
    }

    return {
      team,
      synergy: Math.min(100, synergy),
      strengths,
      recommendations,
    };
  }

  // Progress Tracking and Analytics
  async getUserProgressAnalytics(userId: string): Promise<{
    level: number;
    totalPoints: number;
    achievements: { total: number; byCategory: Record<string, number> };
    challenges: { completed: number; inProgress: number; avgScore: number };
    recentActivity: Array<{ type: string; description: string; points: number; date: Date }>;
    nextMilestones: Array<{ title: string; progress: number; target: number }>;
  }> {
    const userAchievements = this.getUserAchievements(userId);
    const userChallenges = this.getUserChallengeParticipations(userId);

    const achievements = {
      total: userAchievements.length,
      byCategory: this.groupAchievementsByCategory(userAchievements),
    };

    const completedChallenges = userChallenges.filter(p => p.status === 'completed');
    const inProgressChallenges = userChallenges.filter(p => p.status === 'in_progress');
    const avgScore = completedChallenges.length > 0 
      ? completedChallenges.reduce((sum, p) => sum + p.score, 0) / completedChallenges.length 
      : 0;

    const challenges = {
      completed: completedChallenges.length,
      inProgress: inProgressChallenges.length,
      avgScore,
    };

    // Calculate level and points (simplified calculation)
    const totalPoints = userAchievements.reduce((sum, ua) => {
      const achievement = this.achievements.get(ua.achievementId);
      return sum + (achievement?.points || 0);
    }, 0);

    const level = Math.floor(totalPoints / 1000) + 1;

    return {
      level,
      totalPoints,
      achievements,
      challenges,
      recentActivity: [], // Would be populated from actual activity log
      nextMilestones: this.calculateNextMilestones(totalPoints, userAchievements),
    };
  }

  // Helper methods
  private getUserAchievements(userId: string): UserAchievement[] {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  private getUserChallengeParticipations(userId: string): ChallengeParticipant[] {
    return Array.from(this.challengeParticipants.values())
      .filter(cp => cp.userId === userId);
  }

  private groupAchievementsByCategory(userAchievements: UserAchievement[]): Record<string, number> {
    const categories: Record<string, number> = {};
    
    userAchievements.forEach(ua => {
      const achievement = this.achievements.get(ua.achievementId);
      if (achievement) {
        categories[achievement.category] = (categories[achievement.category] || 0) + 1;
      }
    });

    return categories;
  }

  private calculateNextMilestones(currentPoints: number, userAchievements: UserAchievement[]): Array<{ title: string; progress: number; target: number }> {
    const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));
    const availableAchievements = Array.from(this.achievements.values())
      .filter(a => !earnedIds.has(a.id))
      .sort((a, b) => a.points - b.points)
      .slice(0, 3);

    return availableAchievements.map(achievement => ({
      title: achievement.name,
      progress: 0, // Would calculate based on actual progress
      target: achievement.points,
    }));
  }

  private async getUserActionCount(userId: string, action: string): Promise<number> {
    // This would query actual user activity data
    // For now, return a placeholder
    return 0;
  }

  private async getUserActionsInTimeframe(userId: string, action: string, since: Date): Promise<number> {
    // This would query actual user activity data within timeframe
    return 0;
  }

  private getTimeframeStart(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case '1_week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1_month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  private async addPointsToUser(userId: string, points: number): Promise<void> {
    // This would update the user's total points in the database
    // For now, this is a placeholder
  }

  // Public API
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  getActiveChallenges(): Challenge[] {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.status === 'active');
  }

  getChallengeLeaderboard(challengeId: string): ChallengeParticipant[] {
    return Array.from(this.challengeParticipants.values())
      .filter(participant => participant.challengeId === challengeId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
}

export const gamificationService = new GamificationService();
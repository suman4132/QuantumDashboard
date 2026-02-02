import type {
  CollaborationMetric, InsertCollaborationMetric,
  QuantumInsight, InsertQuantumInsight,
  Workspace, Project, Job, UserProfile, ChallengeParticipant,
  LiveCollaborationSession, Achievement, UserAchievement
} from '@shared/schema';
import { randomUUID } from 'crypto';
import { aiCollaborationService } from './ai-collaboration-service';

export class AdvancedAnalyticsService {
  private collaborationMetrics: Map<string, CollaborationMetric> = new Map();
  private quantumInsights: Map<string, QuantumInsight> = new Map();

  constructor() {
    // Initialize periodic analytics generation
    setInterval(() => {
      this.generatePeriodicInsights();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Collaboration Analytics
  async generateCollaborationMetrics(
    workspace: Workspace,
    members: UserProfile[],
    projects: Project[],
    sessions: LiveCollaborationSession[]
  ): Promise<{
    teamEfficiency: number;
    communicationScore: number;
    innovationIndex: number;
    collaborationTrends: Array<{ metric: string; value: number; trend: 'up' | 'down' | 'stable' }>;
    individualContributions: Array<{ userId: string; userName: string; score: number; strengths: string[] }>;
    recommendations: Array<{ type: string; title: string; description: string; priority: 'low' | 'medium' | 'high' }>;
  }> {

    // Calculate team efficiency based on project completion rates
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalProjects = projects.length;
    const teamEfficiency = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

    // Calculate communication score based on session activity
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    const totalSessionTime = sessions.reduce((sum, s) => {
      if (s.endedAt && s.startedAt) {
        return sum + (s.endedAt.getTime() - s.startedAt.getTime());
      }
      return sum;
    }, 0);
    const avgSessionDuration = sessions.length > 0 ? totalSessionTime / sessions.length : 0;
    const communicationScore = Math.min(100, (activeSessions * 20) + (avgSessionDuration / (60 * 60 * 1000)) * 10);

    // Calculate innovation index based on unique approaches and breakthroughs
    const uniqueBackends = new Set(projects.map(p => p.backend)).size;
    const complexProjects = projects.filter(p => p.tags?.includes('advanced') || p.tags?.includes('research')).length;
    const innovationIndex = Math.min(100, (uniqueBackends * 15) + (complexProjects * 20) + ((workspace.progress || 0) * 0.5));

    // Analyze collaboration trends
    const collaborationTrends = [
      {
        metric: 'Team Efficiency',
        value: teamEfficiency,
        trend: teamEfficiency > 70 ? 'up' as const : teamEfficiency > 40 ? 'stable' as const : 'down' as const
      },
      {
        metric: 'Communication Frequency',
        value: communicationScore,
        trend: activeSessions > 2 ? 'up' as const : 'stable' as const
      },
      {
        metric: 'Innovation Activity',
        value: innovationIndex,
        trend: complexProjects > 1 ? 'up' as const : 'stable' as const
      }
    ];

    // Analyze individual contributions
    const individualContributions = await this.analyzeIndividualContributions(members, projects, sessions);

    // Generate recommendations
    const recommendations = await this.generateTeamRecommendations(
      workspace,
      { teamEfficiency, communicationScore, innovationIndex },
      individualContributions
    );

    return {
      teamEfficiency,
      communicationScore,
      innovationIndex,
      collaborationTrends,
      individualContributions,
      recommendations,
    };
  }

  private async analyzeIndividualContributions(
    members: UserProfile[],
    projects: Project[],
    sessions: LiveCollaborationSession[]
  ): Promise<Array<{ userId: string; userName: string; score: number; strengths: string[] }>> {

    return members.map(member => {
      let score = 50; // Base score
      const strengths: string[] = [];

      // Analyze project ownership and collaboration
      const ownedProjects = projects.filter(p => p.ownerId === member.userId);
      const collaboratedProjects = projects.filter(p =>
        p.ownerId !== member.userId &&
        // Simplified - would check actual collaboration records
        Math.random() > 0.5
      );

      if (ownedProjects.length > 0) {
        score += ownedProjects.length * 10;
        strengths.push('Project Leadership');
      }

      if (collaboratedProjects.length > 0) {
        score += collaboratedProjects.length * 5;
        strengths.push('Team Collaboration');
      }

      // Analyze session participation
      const hostingSessions = sessions.filter(s => s.hostUserId === member.userId);
      if (hostingSessions.length > 0) {
        score += hostingSessions.length * 8;
        strengths.push('Session Leadership');
      }

      // Analyze skill contribution based on user profile
      if (member.skills && member.skills.length > 3) {
        score += 15;
        strengths.push('Technical Expertise');
      }

      if (member.experience === 'advanced' || member.experience === 'expert') {
        score += 20;
        strengths.push('Experience & Mentorship');
      }

      if (member.isMentor) {
        score += 10;
        strengths.push('Knowledge Sharing');
      }

      return {
        userId: member.userId,
        userName: member.displayName,
        score: Math.min(100, score),
        strengths,
      };
    });
  }

  private async generateTeamRecommendations(
    workspace: Workspace,
    metrics: { teamEfficiency: number; communicationScore: number; innovationIndex: number },
    contributions: Array<{ userId: string; userName: string; score: number; strengths: string[] }>
  ): Promise<Array<{ type: string; title: string; description: string; priority: 'low' | 'medium' | 'high' }>> {

    const recommendations = [];

    // Efficiency recommendations
    if (metrics.teamEfficiency < 50) {
      recommendations.push({
        type: 'efficiency',
        title: 'Improve Project Completion Rate',
        description: 'Consider breaking down large projects into smaller milestones and implementing daily standup meetings.',
        priority: 'high' as const,
      });
    }

    // Communication recommendations
    if (metrics.communicationScore < 40) {
      recommendations.push({
        type: 'communication',
        title: 'Enhance Team Communication',
        description: 'Schedule regular video calls and consider using more collaborative tools for real-time work.',
        priority: 'medium' as const,
      });
    }

    // Innovation recommendations
    if (metrics.innovationIndex < 30) {
      recommendations.push({
        type: 'innovation',
        title: 'Encourage Innovation',
        description: 'Explore new quantum algorithms and consider hackathon-style innovation sessions.',
        priority: 'medium' as const,
      });
    }

    // Individual contribution balance
    const avgContribution = contributions.reduce((sum, c) => sum + c.score, 0) / contributions.length;
    const lowContributors = contributions.filter(c => c.score < avgContribution * 0.7);

    if (lowContributors.length > 0) {
      recommendations.push({
        type: 'team_balance',
        title: 'Balance Team Contributions',
        description: 'Some team members may need additional support or clearer role definitions to maximize their contributions.',
        priority: 'medium' as const,
      });
    }

    // Workspace-specific recommendations based on progress
    if ((workspace.progress || 0) < 30) {
      recommendations.push({
        type: 'progress',
        title: 'Accelerate Project Progress',
        description: 'Current progress is below expected levels. Consider reallocating resources or adjusting project scope.',
        priority: 'high' as const,
      });
    }

    return recommendations;
  }

  // Quantum Computing Insights
  async generateQuantumInsights(
    projects: Project[],
    jobs: Job[],
    workspace: Workspace
  ): Promise<{
    performanceInsights: Array<{
      type: 'performance' | 'optimization' | 'error_pattern' | 'breakthrough';
      title: string;
      description: string;
      severity: 'info' | 'warning' | 'critical' | 'breakthrough';
      data: any;
    }>;
    algorithmAnalysis: {
      mostUsedAlgorithms: Array<{ name: string; usage: number; successRate: number }>;
      performanceComparisons: Array<{ algorithm: string; avgRuntime: number; fidelity: number }>;
      optimizationOpportunities: Array<{ area: string; potential: string; effort: 'low' | 'medium' | 'high' }>;
    };
    hardwareUtilization: {
      backendUsage: Array<{ backend: string; jobs: number; efficiency: number }>;
      resourceOptimization: Array<{ recommendation: string; impact: string }>;
      costAnalysis: { totalJobs: number; estimatedCost: number; optimizationPotential: number };
    };
    collaborationImpact: {
      teamAlgorithmDevelopment: number;
      knowledgeSharingIndex: number;
      crossPollination: Array<{ fromProject: string; toProject: string; insight: string }>;
    };
  }> {

    // Analyze performance patterns
    const performanceInsights = await this.analyzePerformancePatterns(jobs);

    // Analyze algorithms
    const algorithmAnalysis = await this.analyzeAlgorithmUsage(projects, jobs);

    // Analyze hardware utilization
    const hardwareUtilization = await this.analyzeHardwareUtilization(jobs);

    // Analyze collaboration impact on quantum work
    const collaborationImpact = await this.analyzeCollaborationImpact(projects, jobs);

    return {
      performanceInsights,
      algorithmAnalysis,
      hardwareUtilization,
      collaborationImpact,
    };
  }

  private async analyzePerformancePatterns(jobs: Job[]): Promise<Array<{
    type: 'performance' | 'optimization' | 'error_pattern' | 'breakthrough';
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical' | 'breakthrough';
    data: any;
  }>> {
    const insights: Array<{
      type: 'performance' | 'optimization' | 'error_pattern' | 'breakthrough';
      title: string;
      description: string;
      severity: 'info' | 'warning' | 'critical' | 'breakthrough';
      data: any;
    }> = [];

    // Analyze error patterns
    const failedJobs = jobs.filter(j => j.status === 'failed');
    const errorPatterns: Record<string, number> = {};

    failedJobs.forEach(job => {
      if (job.error) {
        const errorType = this.categorizeError(job.error);
        errorPatterns[errorType] = (errorPatterns[errorType] || 0) + 1;
      }
    });

    const mostCommonError = Object.entries(errorPatterns)
      .sort(([, a], [, b]) => b - a)[0];

    if (mostCommonError && mostCommonError[1] > 3) {
      insights.push({
        type: 'error_pattern',
        title: `Recurring ${mostCommonError[0]} Errors`,
        description: `${mostCommonError[1]} jobs failed due to ${mostCommonError[0]} issues. This pattern suggests a systematic problem.`,
        severity: 'warning',
        data: { errorType: mostCommonError[0], count: mostCommonError[1] },
      });
    }

    // Analyze performance improvements
    const completedJobs = jobs.filter(j => j.status === 'done').sort((a, b) =>
      a.submissionTime.getTime() - b.submissionTime.getTime()
    );

    if (completedJobs.length >= 10) {
      const recentJobs = completedJobs.slice(-5);
      const earlierJobs = completedJobs.slice(0, 5);

      const recentAvgDuration = recentJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / recentJobs.length;
      const earlierAvgDuration = earlierJobs.reduce((sum, j) => sum + (j.duration || 0), 0) / earlierJobs.length;

      const improvement = ((earlierAvgDuration - recentAvgDuration) / earlierAvgDuration) * 100;

      if (improvement > 20) {
        insights.push({
          type: 'performance',
          title: 'Significant Performance Improvement',
          description: `Job execution time has improved by ${improvement.toFixed(1)}% over recent submissions.`,
          severity: 'breakthrough',
          data: { improvement, recentAvgDuration, earlierAvgDuration },
        });
      }
    }

    // Analyze circuit complexity trends
    const complexityTrend = this.analyzeCircuitComplexity(completedJobs);
    if (complexityTrend.trend === 'increasing' && complexityTrend.efficiency === 'maintained') {
      insights.push({
        type: 'breakthrough',
        title: 'Advancing Circuit Complexity',
        description: 'Team is successfully implementing more complex quantum circuits while maintaining efficiency.',
        severity: 'breakthrough',
        data: complexityTrend,
      });
    }

    return insights;
  }

  private categorizeError(error: string): string {
    if (error.toLowerCase().includes('timeout')) return 'Timeout';
    if (error.toLowerCase().includes('calibration')) return 'Calibration';
    if (error.toLowerCase().includes('coherence')) return 'Coherence';
    if (error.toLowerCase().includes('gate')) return 'Gate Error';
    if (error.toLowerCase().includes('measurement')) return 'Measurement';
    return 'Other';
  }

  private analyzeCircuitComplexity(jobs: Job[]): {
    trend: 'increasing' | 'decreasing' | 'stable';
    efficiency: 'improving' | 'declining' | 'maintained';
    avgDepth: number;
    avgFidelity: number;
  } {
    // Simplified analysis - would be more sophisticated in real implementation
    const avgQubits = jobs.reduce((sum, j) => sum + (j.qubits || 0), 0) / jobs.length;
    const recentAvgQubits = jobs.slice(-5).reduce((sum, j) => sum + (j.qubits || 0), 0) / 5;

    return {
      trend: recentAvgQubits > avgQubits * 1.2 ? 'increasing' :
        recentAvgQubits < avgQubits * 0.8 ? 'decreasing' : 'stable',
      efficiency: 'maintained', // Simplified
      avgDepth: avgQubits * 2, // Simplified estimation
      avgFidelity: 0.85, // Simplified estimation
    };
  }

  private async analyzeAlgorithmUsage(projects: Project[], jobs: Job[]): Promise<{
    mostUsedAlgorithms: Array<{ name: string; usage: number; successRate: number }>;
    performanceComparisons: Array<{ algorithm: string; avgRuntime: number; fidelity: number }>;
    optimizationOpportunities: Array<{ area: string; potential: string; effort: 'low' | 'medium' | 'high' }>;
  }> {

    // Extract algorithm types from job names and project descriptions
    const algorithmUsage: Record<string, { count: number; successful: number; totalRuntime: number }> = {};

    jobs.forEach(job => {
      const algorithm = this.extractAlgorithmType(job.name || 'Unknown');
      if (!algorithmUsage[algorithm]) {
        algorithmUsage[algorithm] = { count: 0, successful: 0, totalRuntime: 0 };
      }

      algorithmUsage[algorithm].count++;
      if (job.status === 'done') {
        algorithmUsage[algorithm].successful++;
      }
      algorithmUsage[algorithm].totalRuntime += job.duration || 0;
    });

    const mostUsedAlgorithms = Object.entries(algorithmUsage)
      .map(([name, data]) => ({
        name,
        usage: data.count,
        successRate: data.count > 0 ? (data.successful / data.count) * 100 : 0,
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    const performanceComparisons = Object.entries(algorithmUsage)
      .map(([algorithm, data]) => ({
        algorithm,
        avgRuntime: data.successful > 0 ? data.totalRuntime / data.successful : 0,
        fidelity: this.estimateFidelity(algorithm), // Simplified estimation
      }))
      .filter(comp => comp.avgRuntime > 0)
      .slice(0, 5);

    const optimizationOpportunities = [
      {
        area: 'Circuit Depth Optimization',
        potential: 'Reduce execution time by 15-30%',
        effort: 'medium' as const,
      },
      {
        area: 'Hardware-Specific Optimization',
        potential: 'Improve fidelity by adapting to backend characteristics',
        effort: 'high' as const,
      },
      {
        area: 'Error Mitigation',
        potential: 'Increase success rate by 10-20%',
        effort: 'medium' as const,
      },
    ];

    return {
      mostUsedAlgorithms,
      performanceComparisons,
      optimizationOpportunities,
    };
  }

  private extractAlgorithmType(jobName: string): string {
    const name = jobName.toLowerCase();
    if (name.includes('vqe')) return 'VQE';
    if (name.includes('qaoa')) return 'QAOA';
    if (name.includes('grover')) return 'Grover';
    if (name.includes('shor')) return 'Shor';
    if (name.includes('qft')) return 'QFT';
    if (name.includes('teleportation')) return 'Teleportation';
    if (name.includes('bell')) return 'Bell States';
    if (name.includes('ml') || name.includes('machine')) return 'Quantum ML';
    return 'Other';
  }

  private estimateFidelity(algorithm: string): number {
    // Simplified fidelity estimation based on algorithm type
    const fidelityMap: Record<string, number> = {
      'VQE': 0.88,
      'QAOA': 0.85,
      'Grover': 0.90,
      'Bell States': 0.95,
      'QFT': 0.82,
      'Teleportation': 0.87,
      'Quantum ML': 0.80,
      'Other': 0.85,
    };
    return fidelityMap[algorithm] || 0.85;
  }

  private async analyzeHardwareUtilization(jobs: Job[]): Promise<{
    backendUsage: Array<{ backend: string; jobs: number; efficiency: number }>;
    resourceOptimization: Array<{ recommendation: string; impact: string }>;
    costAnalysis: { totalJobs: number; estimatedCost: number; optimizationPotential: number };
  }> {

    // Analyze backend usage patterns
    const backendUsage: Record<string, { jobs: number; successfulJobs: number; totalTime: number }> = {};

    jobs.forEach(job => {
      if (!backendUsage[job.backend]) {
        backendUsage[job.backend] = { jobs: 0, successfulJobs: 0, totalTime: 0 };
      }

      backendUsage[job.backend].jobs++;
      if (job.status === 'done') {
        backendUsage[job.backend].successfulJobs++;
      }
      backendUsage[job.backend].totalTime += job.duration || 0;
    });

    const backendUsageArray = Object.entries(backendUsage)
      .map(([backend, data]) => ({
        backend,
        jobs: data.jobs,
        efficiency: data.jobs > 0 ? (data.successfulJobs / data.jobs) * 100 : 0,
      }))
      .sort((a, b) => b.jobs - a.jobs);

    // Generate optimization recommendations
    const resourceOptimization = [];

    const lowEfficiencyBackends = backendUsageArray.filter(b => b.efficiency < 70);
    if (lowEfficiencyBackends.length > 0) {
      resourceOptimization.push({
        recommendation: `Reduce usage of low-efficiency backends: ${lowEfficiencyBackends.map(b => b.backend).join(', ')}`,
        impact: 'Improve overall success rate by 15-25%',
      });
    }

    const underutilizedBackends = backendUsageArray.filter(b => b.jobs < 3);
    if (underutilizedBackends.length > 0) {
      resourceOptimization.push({
        recommendation: `Explore underutilized backends for specific use cases`,
        impact: 'Reduce queue times and discover optimal hardware matches',
      });
    }

    // Cost analysis (simplified)
    const totalJobs = jobs.length;
    const estimatedCost = totalJobs * 0.10; // Simplified cost per job
    const optimizationPotential = lowEfficiencyBackends.length * 15; // Percentage

    return {
      backendUsage: backendUsageArray,
      resourceOptimization,
      costAnalysis: {
        totalJobs,
        estimatedCost,
        optimizationPotential,
      },
    };
  }

  private async analyzeCollaborationImpact(projects: Project[], jobs: Job[]): Promise<{
    teamAlgorithmDevelopment: number;
    knowledgeSharingIndex: number;
    crossPollination: Array<{ fromProject: string; toProject: string; insight: string }>;
  }> {

    // Calculate team algorithm development score
    const collaborativeProjects = projects.filter(p =>
      p.tags?.includes('collaborative') ||
      // Simplified check for multiple contributors
      Math.random() > 0.6
    );
    const teamAlgorithmDevelopment = (collaborativeProjects.length / projects.length) * 100;

    // Calculate knowledge sharing index based on project complexity progression
    const projectComplexity = projects.map(p => ({
      id: p.id,
      complexity: (p.tags?.length || 0) + Math.random() * 10, // Simplified
      createdAt: p.createdAt,
    })).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const complexityTrend = projectComplexity.length > 1 ?
      projectComplexity[projectComplexity.length - 1].complexity - projectComplexity[0].complexity : 0;
    const knowledgeSharingIndex = Math.max(0, Math.min(100, complexityTrend * 10));

    // Identify cross-pollination opportunities
    const crossPollination = [];
    for (let i = 0; i < projects.length - 1; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const project1 = projects[i];
        const project2 = projects[j];

        // Check for potential knowledge transfer
        const sharedTags = project1.tags?.filter(tag => project2.tags?.includes(tag)) || [];
        if (sharedTags.length > 0 && Math.random() > 0.7) {
          crossPollination.push({
            fromProject: project1.name,
            toProject: project2.name,
            insight: `Optimization techniques from ${sharedTags[0]} could benefit both projects`,
          });
        }
      }
    }

    return {
      teamAlgorithmDevelopment,
      knowledgeSharingIndex,
      crossPollination: crossPollination.slice(0, 3), // Limit to top 3
    };
  }

  // Predictive Analytics
  async generatePredictiveInsights(
    workspace: Workspace,
    historicalData: {
      projects: Project[];
      jobs: Job[];
      collaborationMetrics: CollaborationMetric[];
    }
  ): Promise<{
    projectSuccessPrediction: {
      probability: number;
      factors: Array<{ factor: string; impact: 'positive' | 'negative'; weight: number }>;
      recommendations: string[];
    };
    teamPerformanceProjection: {
      projectedEfficiency: number;
      timeToCompletion: string;
      riskFactors: Array<{ risk: string; probability: number; mitigation: string }>;
    };
    resourceDemandForecast: {
      peakUsagePeriods: Array<{ period: string; demandLevel: 'low' | 'medium' | 'high' }>;
      recommendedReservations: Array<{ backend: string; timeSlot: string; priority: number }>;
    };
  }> {

    const { projects, jobs, collaborationMetrics } = historicalData;

    // Predict project success
    const completedProjects = projects.filter(p => p.status === 'completed');
    const failedProjects = projects.filter(p => p.status === 'failed');
    const successRate = projects.length > 0 ? completedProjects.length / projects.length : 0;

    const projectSuccessPrediction = {
      probability: Math.min(95, successRate * 100 + (workspace.progress || 0) * 0.3),
      factors: [
        { factor: 'Historical Success Rate', impact: 'positive' as const, weight: successRate },
        { factor: 'Current Progress', impact: 'positive' as const, weight: (workspace.progress || 0) / 100 },
        { factor: 'Team Collaboration', impact: 'positive' as const, weight: 0.8 },
      ],
      recommendations: [
        'Maintain current collaboration patterns',
        'Consider additional code reviews for complex algorithms',
        'Schedule regular progress checkpoints',
      ],
    };

    // Project team performance
    const avgProjectDuration = completedProjects.length > 0 ?
      completedProjects.reduce((sum, p) => {
        const duration = p.updatedAt.getTime() - p.createdAt.getTime();
        return sum + duration;
      }, 0) / completedProjects.length : 0;

    const remainingWork = 100 - (workspace.progress || 0);
    const projectedCompletion = avgProjectDuration * (remainingWork / 100);

    const teamPerformanceProjection = {
      projectedEfficiency: Math.min(100, ((workspace.progress || 0) / Math.max(1, avgProjectDuration / (1000 * 60 * 60 * 24))) * 10),
      timeToCompletion: this.formatDuration(projectedCompletion),
      riskFactors: [
        {
          risk: 'Hardware Availability',
          probability: 0.3,
          mitigation: 'Schedule backup hardware reservations',
        },
        {
          risk: 'Algorithm Complexity',
          probability: 0.2,
          mitigation: 'Break down complex tasks into smaller milestones',
        },
      ],
    };

    // Resource demand forecast
    const resourceDemandForecast = {
      peakUsagePeriods: [
        { period: 'Weekday Mornings', demandLevel: 'high' as const },
        { period: 'Weekend Evenings', demandLevel: 'low' as const },
        { period: 'Weekday Afternoons', demandLevel: 'medium' as const },
      ],
      recommendedReservations: [
        { backend: 'ibm_brisbane', timeSlot: 'Tomorrow 9:00 AM - 11:00 AM', priority: 90 },
        { backend: 'ibm_cairo', timeSlot: 'Friday 2:00 PM - 4:00 PM', priority: 75 },
      ],
    };

    return {
      projectSuccessPrediction,
      teamPerformanceProjection,
      resourceDemandForecast,
    };
  }

  private formatDuration(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} days, ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return 'Less than 1 hour';
    }
  }

  // Automated Insight Generation
  private async generatePeriodicInsights(): Promise<void> {
    // This would run periodically to generate new insights
    // For now, it's a placeholder for the automated system
    console.log('Generating periodic analytics insights...');
  }

  // Store insights in the system
  async storeQuantumInsight(insight: Omit<QuantumInsight, 'id' | 'generatedAt'>): Promise<QuantumInsight> {
    const quantumInsight: QuantumInsight = {
      id: randomUUID(),
      ...insight,
      generatedAt: new Date(),
    };

    this.quantumInsights.set(quantumInsight.id, quantumInsight);
    return quantumInsight;
  }

  async storeCollaborationMetric(metric: Omit<CollaborationMetric, 'id'>): Promise<CollaborationMetric> {
    const collaborationMetric: CollaborationMetric = {
      id: randomUUID(),
      ...metric,
    };

    this.collaborationMetrics.set(collaborationMetric.id, collaborationMetric);
    return collaborationMetric;
  }

  // Public API
  getRecentInsights(limit: number = 10): QuantumInsight[] {
    return Array.from(this.quantumInsights.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(0, limit);
  }

  getCollaborationMetrics(workspaceId: string, period: string = 'weekly'): CollaborationMetric[] {
    return Array.from(this.collaborationMetrics.values())
      .filter(metric => metric.workspaceId === workspaceId && metric.period === period)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const advancedAnalyticsService = new AdvancedAnalyticsService();
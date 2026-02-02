import OpenAI from 'openai';
import type {
  Workspace, Project, WorkspaceMember, ProjectCollaborator, Job, Backend,
  AiRecommendation, InsertAiRecommendation, UserProfile, Challenge,
  Experiment, CollaborationMetric, QuantumInsight
} from '@shared/schema';
import { openaiService } from './openai-service';

export class AICollaborationService {
  private client: OpenAI | undefined;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      // Validate API key format (should start with 'sk-')
      if (!apiKey.startsWith('sk-')) {
        console.warn('⚠️  OpenAI API key format appears invalid (should start with "sk-")');
        console.warn('⚠️  AI collaboration features will be disabled');
        this.isConfigured = false;
        return;
      }

      try {
        this.client = new OpenAI({
          apiKey,
          timeout: 30000, // 30 second timeout
        });
        this.isConfigured = true;
        console.log('✅ AI collaboration service configured');
      } catch (error: any) {
        console.error('❌ Failed to initialize AI collaboration client:', error.message);
        this.isConfigured = false;
      }
    } else {
      console.log('⚠️  OpenAI API key not found - AI collaboration features will be disabled');
      this.isConfigured = false;
    }
  }

  // AI-Powered Team Matching and Recommendations
  async generateTeamMatchingRecommendations(
    user: UserProfile,
    workspaces: Workspace[],
    allUsers: UserProfile[]
  ): Promise<Partial<AiRecommendation>[]> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackTeamRecommendations(user, workspaces);
    }

    try {
      const prompt = `As an AI collaboration expert, analyze this user profile and recommend optimal team matches and collaborations:

User Profile:
- Name: ${user.displayName}
- Skills: ${user.skills?.join(', ') || 'No skills listed'}
- Interests: ${user.interests?.join(', ') || 'No interests listed'}
- Experience: ${user.experience}
- Current Points: ${user.totalPoints}
- Level: ${user.level}
- Bio: ${user.bio || 'No bio'}

Available Workspaces:
${workspaces.map(w => `- ${w.name}: ${w.description} (Status: ${w.status})`).join('\n')}

Available Users for Collaboration:
${allUsers.slice(0, 20).map(u => `- ${u.displayName}: Skills: ${u.skills?.join(', ') || 'None'}, Experience: ${u.experience}`).join('\n')}

Generate 5 intelligent recommendations for:
1. Best workspace matches based on skills/interests
2. Ideal collaborators for quantum projects
3. Mentorship opportunities (as mentor or mentee)
4. Skill development suggestions
5. Team formation for challenging projects

Return as a JSON object with a "recommendations" array containing items with this format:
{
  "recommendations": [{
    "type": "team_match|project_suggestion|mentorship|skill_development",
    "title": "Brief recommendation title",
    "description": "Detailed explanation with reasoning",
    "confidence": 85,
    "data": {"workspaceId": "optional", "userIds": ["optional"], "skills": ["optional"]}
  }]
}`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          const recommendations = parsed.recommendations || (Array.isArray(parsed) ? parsed : []);
          return recommendations.map((rec: any) => ({
            userId: user.userId,
            type: rec.type,
            title: rec.title,
            description: rec.description,
            confidence: rec.confidence,
            data: rec.data,
            status: 'pending',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI team matching response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI team matching error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackTeamRecommendations(user, workspaces);
  }

  // Smart Project Suggestions
  async generateProjectSuggestions(
    workspace: Workspace,
    members: WorkspaceMember[],
    recentJobs: Job[],
    availableBackends: Backend[]
  ): Promise<Partial<AiRecommendation>[]> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackProjectSuggestions();
    }

    try {
      const prompt = `As a quantum computing research expert, analyze this workspace and suggest innovative project ideas:

Workspace: ${workspace.name}
Description: ${workspace.description}
Progress: ${workspace.progress}%
Status: ${workspace.status}

Team Members: ${members.length} total
Member Roles: ${members.map(m => `${m.userName} (${m.role})`).join(', ')}

Recent Jobs Analysis:
${recentJobs.slice(0, 10).map(j => `- ${j.name}: ${j.backend}, ${j.qubits} qubits, Status: ${j.status}`).join('\n')}

Available Quantum Backends:
${availableBackends.map(b => `- ${b.name}: ${b.qubits} qubits, Status: ${b.status}, Queue: ${b.queueLength}`).join('\n')}

Generate 4 innovative project suggestions that:
1. Build on current progress and team expertise
2. Utilize available quantum hardware effectively
3. Advance quantum computing research
4. Create learning opportunities for team members

Return as a JSON object with a "suggestions" array containing items with this format:
{
  "suggestions": [{
    "type": "project_suggestion",
    "title": "Project name",
    "description": "Detailed project description, objectives, and expected outcomes",
    "confidence": 90,
    "data": {
      "difficulty": "beginner|intermediate|advanced",
      "estimatedDuration": "weeks",
      "requiredSkills": ["skill1", "skill2"],
      "recommendedBackend": "backend_name",
      "expectedOutcomes": ["outcome1", "outcome2"]
    }
  }]
}`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          const suggestions = parsed.suggestions || (Array.isArray(parsed) ? parsed : []);
          return suggestions.map((sug: any) => ({
            workspaceId: workspace.id,
            type: sug.type,
            title: sug.title,
            description: sug.description,
            confidence: sug.confidence,
            data: sug.data,
            status: 'pending',
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI suggestions response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI project suggestions error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackProjectSuggestions();
  }

  // Intelligent Resource Allocation
  async generateResourceOptimizations(
    workspaces: Workspace[],
    jobs: Job[],
    backends: Backend[]
  ): Promise<Partial<AiRecommendation>[]> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackResourceOptimizations();
    }

    try {
      const prompt = `As a quantum resource optimization expert, analyze current usage patterns and recommend improvements:

Active Workspaces:
${workspaces.filter(w => w.status === 'active').map(w => `- ${w.name}: ${w.progress}% complete`).join('\n')}

Recent Job Patterns:
${jobs.slice(0, 20).map(j => `- ${j.backend}: ${j.qubits}q, ${j.shots} shots, ${j.status}, ${j.duration || 0}s`).join('\n')}

Backend Status:
${backends.map(b => `- ${b.name}: ${b.qubits}q, ${b.queueLength} queued, ${b.averageWaitTime}s avg wait, ${b.uptime} uptime`).join('\n')}

Analyze patterns and generate 3 optimization recommendations for:
1. Hardware utilization efficiency
2. Cost reduction strategies  
3. Performance improvements

Return as a JSON object with an "optimizations" array containing items with this format:
{
  "optimizations": [{
    "type": "resource_optimization",
    "title": "Optimization recommendation",
    "description": "Detailed explanation and implementation steps",
    "confidence": 85,
    "data": {
      "category": "cost|performance|efficiency",
      "expectedSavings": "percentage or time",
      "affectedWorkspaces": ["workspace_id"],
      "implementation": "step by step guide"
    }
  }]
}`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          const parsed = JSON.parse(content);
          const optimizations = parsed.optimizations || (Array.isArray(parsed) ? parsed : []);
          return optimizations.map((opt: any) => ({
            type: opt.type,
            title: opt.title,
            description: opt.description,
            confidence: opt.confidence,
            data: opt.data,
            status: 'pending',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          }));
        } catch (parseError) {
          console.warn('Failed to parse AI optimization response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI resource optimization error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackResourceOptimizations();
  }

  // Advanced Code Review and Optimization
  async generateQuantumCodeReview(
    code: string,
    context: {
      projectName: string;
      backend: string;
      qubits: number;
      collaborators: string[];
    }
  ): Promise<{
    overallScore: number;
    suggestions: Array<{
      type: 'optimization' | 'error' | 'best_practice' | 'collaboration';
      severity: 'info' | 'warning' | 'critical';
      line?: number;
      title: string;
      description: string;
      suggestion: string;
    }>;
    collaborationInsights: Array<{
      aspect: string;
      insight: string;
      recommendation: string;
    }>;
  }> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackCodeReview();
    }

    try {
      const prompt = `As a senior quantum computing code reviewer with collaboration expertise, analyze this quantum code:

Project: ${context.projectName}
Target Backend: ${context.backend}
Qubits: ${context.qubits}
Collaborators: ${context.collaborators.join(', ')}

Code:
\`\`\`
${code}
\`\`\`

Provide comprehensive analysis including:
1. Overall code quality score (0-100)
2. Specific improvement suggestions
3. Collaboration insights for team development

Return as JSON with format:
{
  "overallScore": 85,
  "suggestions": [
    {
      "type": "optimization|error|best_practice|collaboration",
      "severity": "info|warning|critical",
      "line": 10,
      "title": "Brief issue title",
      "description": "What the issue is",
      "suggestion": "How to fix or improve it"
    }
  ],
  "collaborationInsights": [
    {
      "aspect": "Code Style|Documentation|Complexity",
      "insight": "What this reveals about team collaboration",
      "recommendation": "How to improve team collaboration"
    }
  ]
}`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI code review response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI code review error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackCodeReview();
  }

  // Experiment Design Assistant
  async generateExperimentDesign(
    hypothesis: string,
    workspace: Workspace,
    availableResources: {
      backends: Backend[];
      teamSkills: string[];
      timeframe: string;
    }
  ): Promise<{
    methodology: string;
    experimentPlan: Array<{
      phase: string;
      duration: string;
      tasks: string[];
      resources: string[];
    }>;
    expectedOutcomes: string[];
    riskAssessment: Array<{
      risk: string;
      probability: 'low' | 'medium' | 'high';
      mitigation: string;
    }>;
    collaborationStrategy: {
      roleAssignments: Array<{ role: string; skills: string[]; responsibilities: string[] }>;
      communicationPlan: string;
      milestones: Array<{ milestone: string; timeline: string; deliverables: string[] }>;
    };
  }> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackExperimentDesign();
    }

    try {
      const prompt = `As a quantum research methodology expert, design a comprehensive experiment:

Hypothesis: ${hypothesis}

Workspace Context:
- Name: ${workspace.name}
- Description: ${workspace.description}
- Current Progress: ${workspace.progress}%

Available Resources:
- Backends: ${availableResources.backends.map(b => `${b.name} (${b.qubits}q)`).join(', ')}
- Team Skills: ${availableResources.teamSkills.join(', ')}
- Timeframe: ${availableResources.timeframe}

Design a complete experiment including methodology, collaboration strategy, and risk management.

Return as JSON with the specified format.`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI experiment design response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI experiment design error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackExperimentDesign();
  }

  // Dynamic Learning Path Generation
  async generateLearningPath(
    user: UserProfile,
    targetSkills: string[],
    availableChallenges: Challenge[],
    completedAchievements: string[]
  ): Promise<{
    path: Array<{
      step: number;
      title: string;
      description: string;
      type: 'challenge' | 'project' | 'collaboration' | 'mentorship';
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      estimatedTime: string;
      prerequisites: string[];
      resources: string[];
    }>;
    estimatedDuration: string;
    skillProgression: Array<{
      skill: string;
      currentLevel: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
      targetLevel: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
      milestones: string[];
    }>;
  }> {
    if (!this.isConfigured || !this.client) {
      return this.getFallbackLearningPath(targetSkills);
    }

    try {
      const prompt = `As a quantum education expert, create a personalized learning path:

User Profile:
- Current Skills: ${user.skills?.join(', ') || 'None'}
- Experience Level: ${user.experience}
- Completed Achievements: ${completedAchievements.length} total

Target Skills: ${targetSkills.join(', ')}

Available Challenges:
${availableChallenges.map(c => `- ${c.name}: ${c.difficulty} (${c.category})`).join('\n')}

Create a structured learning path that progressively builds skills through practical challenges and collaborative projects.

Return as JSON with the specified format.`;

      const response = await this.client!.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse AI learning path response, using fallback');
        }
      }
    } catch (error: any) {
      console.error('AI learning path error:', error);
      if (error?.status === 401) {
        console.error('❌ OpenAI API key is invalid or expired');
      } else if (error?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.message) {
        console.error('Error details:', error.message);
      }
    }

    return this.getFallbackLearningPath(targetSkills);
  }

  // Fallback methods for when AI is not available
  private getFallbackTeamRecommendations(user: UserProfile, workspaces: Workspace[]): Partial<AiRecommendation>[] {
    return [
      {
        userId: user.userId,
        workspaceId: workspaces[0]?.id || null,
        type: 'team_match',
        title: 'Join Active Quantum ML Research',
        description: 'Based on your profile, you would be a great fit for collaborative quantum machine learning projects.',
        confidence: 80,
        data: { workspaceId: workspaces[0]?.id },
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: user.userId,
        workspaceId: null,
        type: 'skill_development',
        title: 'Enhance Quantum Algorithm Design',
        description: 'Focus on QAOA and VQE implementations to strengthen your quantum optimization skills.',
        confidence: 75,
        data: { skills: ['QAOA', 'VQE', 'Quantum Optimization'] },
        status: 'pending',
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private getFallbackProjectSuggestions(): Partial<AiRecommendation>[] {
    return [
      {
        userId: 'system',
        workspaceId: null,
        type: 'project_suggestion',
        title: 'Hybrid VQE-QAOA Implementation',
        description: 'Combine Variational Quantum Eigensolver with Quantum Approximate Optimization Algorithm for enhanced performance on optimization problems.',
        confidence: 85,
        data: {
          difficulty: 'intermediate',
          estimatedDuration: '6-8 weeks',
          requiredSkills: ['VQE', 'QAOA', 'Python', 'Qiskit'],
          recommendedBackend: 'ibm_brisbane',
          expectedOutcomes: ['Performance comparison study', 'Algorithm optimization', 'Research publication']
        },
        status: 'pending',
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private getFallbackResourceOptimizations(): Partial<AiRecommendation>[] {
    return [
      {
        userId: 'system',
        workspaceId: null,
        type: 'resource_optimization',
        title: 'Optimize Hardware Scheduling',
        description: 'Implement intelligent job scheduling to reduce average wait times by 30% and improve resource utilization.',
        confidence: 80,
        data: {
          category: 'efficiency',
          expectedSavings: '30% time reduction',
          implementation: 'Prioritize shorter jobs during peak hours, batch similar experiments'
        },
        status: 'pending',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  private getFallbackCodeReview() {
    return {
      overallScore: 75,
      suggestions: [
        {
          type: 'optimization' as const,
          severity: 'warning' as const,
          title: 'Circuit Depth Optimization',
          description: 'Circuit depth could be reduced for better fidelity on NISQ devices',
          suggestion: 'Consider using native gate decomposition and circuit optimization techniques'
        },
        {
          type: 'collaboration' as const,
          severity: 'info' as const,
          title: 'Add Documentation',
          description: 'Code would benefit from more detailed comments for team collaboration',
          suggestion: 'Add docstrings explaining quantum algorithm parameters and expected outcomes'
        }
      ],
      collaborationInsights: [
        {
          aspect: 'Code Style',
          insight: 'Code follows good practices but could use more team-oriented documentation',
          recommendation: 'Establish team coding standards and documentation guidelines'
        }
      ]
    };
  }

  private getFallbackExperimentDesign() {
    return {
      methodology: 'Standard quantum algorithm benchmarking with statistical analysis',
      experimentPlan: [
        {
          phase: 'Preparation',
          duration: '1 week',
          tasks: ['Setup environment', 'Prepare test cases', 'Define metrics'],
          resources: ['Development environment', 'Test data', 'Documentation']
        },
        {
          phase: 'Execution',
          duration: '2 weeks',
          tasks: ['Run experiments', 'Collect data', 'Monitor progress'],
          resources: ['Quantum hardware', 'Data storage', 'Monitoring tools']
        }
      ],
      expectedOutcomes: ['Performance metrics', 'Comparative analysis', 'Optimization insights'],
      riskAssessment: [
        {
          risk: 'Hardware availability',
          probability: 'medium' as const,
          mitigation: 'Schedule backup time slots and alternative backends'
        }
      ],
      collaborationStrategy: {
        roleAssignments: [
          {
            role: 'Lead Researcher',
            skills: ['Quantum Algorithms', 'Data Analysis'],
            responsibilities: ['Experiment design', 'Results analysis', 'Team coordination']
          }
        ],
        communicationPlan: 'Daily standup meetings and weekly progress reviews',
        milestones: [
          {
            milestone: 'Setup Complete',
            timeline: '1 week',
            deliverables: ['Environment ready', 'Test cases defined']
          }
        ]
      }
    };
  }

  private getFallbackLearningPath(targetSkills: string[]) {
    return {
      path: [
        {
          step: 1,
          title: 'Quantum Fundamentals',
          description: 'Master basic quantum mechanics and quantum computing principles',
          type: 'challenge' as const,
          difficulty: 'beginner' as const,
          estimatedTime: '2 weeks',
          prerequisites: [],
          resources: ['Quantum Computing Textbook', 'Online Tutorials', 'Practice Problems']
        },
        {
          step: 2,
          title: 'First Quantum Algorithm',
          description: 'Implement and understand your first quantum algorithm',
          type: 'project' as const,
          difficulty: 'intermediate' as const,
          estimatedTime: '1 week',
          prerequisites: ['Quantum Fundamentals'],
          resources: ['Qiskit Documentation', 'Code Examples', 'Mentor Support']
        }
      ],
      estimatedDuration: '3-4 weeks',
      skillProgression: targetSkills.map(skill => ({
        skill,
        currentLevel: 'novice' as const,
        targetLevel: 'intermediate' as const,
        milestones: [`Basic ${skill} understanding`, `${skill} implementation`, `${skill} optimization`]
      }))
    };
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const aiCollaborationService = new AICollaborationService();
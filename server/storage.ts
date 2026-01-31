import { 
  type Job, type InsertJob, type Session, type InsertSession, type Backend, type InsertBackend, 
  type Workspace, type InsertWorkspace, type WorkspaceMember, type InsertWorkspaceMember,
  type Project, type InsertProject, type ProjectCollaborator, type InsertProjectCollaborator,
  JobStatus, SessionStatus, BackendStatus, WorkspaceStatus, ProjectStatus
} from "@shared/schema";
import { randomUUID } from "crypto";
import { ibmQuantumService } from "./ibm-quantum";
import { 
  mockUsers, mockPricingPlans, mockContentSections, mockNews, 
  mockLeaderboard, mockAuditLogs, mockAnalytics, mockUserStats 
} from "./mock-data";

export interface IStorage {
  // Jobs
  getJobs(limit?: number, offset?: number): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJobStatus(id: string, status: JobStatus, error?: string): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  searchJobs(query: string): Promise<Job[]>;
  getJobsByStatus(status: JobStatus): Promise<Job[]>;
  getJobsByBackend(backend: string): Promise<Job[]>;

  // Sessions
  getSessions(): Promise<Session[]>;
  getSessionById(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;

  // Backends
  getBackends(): Promise<Backend[]>;
  getBackendById(id: string): Promise<Backend | undefined>;
  createBackend(backend: InsertBackend): Promise<Backend>;
  updateBackend(id: string, updates: Partial<Backend>): Promise<Backend | undefined>;

  // Analytics
  getJobStats(): Promise<{
    totalJobs: number;
    runningJobs: number;
    queuedJobs: number;
    completedJobs: number;
    failedJobs: number;
    successRate: number;
  }>;

  // Workspaces
  getWorkspaces(): Promise<Workspace[]>;
  getWorkspaceById(id: string): Promise<Workspace | undefined>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;
  searchWorkspaces(query: string): Promise<Workspace[]>;

  // Workspace Members
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
  addWorkspaceMember(member: InsertWorkspaceMember): Promise<WorkspaceMember>;
  updateWorkspaceMember(id: string, updates: Partial<WorkspaceMember>): Promise<WorkspaceMember | undefined>;
  removeWorkspaceMember(id: string): Promise<boolean>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getProjectsByWorkspace(workspaceId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  searchProjects(query: string): Promise<Project[]>;

  // Project Collaborators
  getProjectCollaborators(projectId: string): Promise<ProjectCollaborator[]>;
  addProjectCollaborator(collaborator: InsertProjectCollaborator): Promise<ProjectCollaborator>;
  updateProjectCollaborator(id: string, updates: Partial<ProjectCollaborator>): Promise<ProjectCollaborator | undefined>;
  removeProjectCollaborator(id: string): Promise<boolean>;

  // Admin Dashboard - Pricing Plans
  getPricingPlans(): Promise<any[]>;
  getPricingPlanById(id: string): Promise<any | undefined>;
  createPricingPlan(plan: any): Promise<any>;
  updatePricingPlan(id: string, updates: any): Promise<any | undefined>;
  deletePricingPlan(id: string): Promise<boolean>;
  publishPricingPlan(id: string): Promise<any | undefined>;
  getPricingPlanVersions(planId: string): Promise<any[]>;

  // Admin Dashboard - Content Management
  getContentSections(): Promise<any[]>;
  getContentSectionById(id: string): Promise<any | undefined>;
  createContentSection(section: any): Promise<any>;
  updateContentSection(id: string, updates: any): Promise<any | undefined>;
  deleteContentSection(id: string): Promise<boolean>;
  publishContentSection(id: string): Promise<any | undefined>;
  getContentVersions(sectionId: string): Promise<any[]>;

  // Admin Dashboard - News Management
  getAdminNews(): Promise<any[]>;
  getAdminNewsById(id: string): Promise<any | undefined>;
  createAdminNews(news: any): Promise<any>;
  updateAdminNews(id: string, updates: any): Promise<any | undefined>;
  deleteAdminNews(id: string): Promise<boolean>;
  publishAdminNews(id: string): Promise<any | undefined>;

  // Admin Dashboard - User Management
  getUsers(filters?: any): Promise<any[]>;
  getUserById(id: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  updateUser(id: string, updates: any): Promise<any | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getUserStats(): Promise<any>;

  // Admin Dashboard - Game Scores
  getGameScores(userId?: string): Promise<any[]>;
  getLeaderboard(gameType?: string, limit?: number): Promise<any[]>;

  // Admin Dashboard - Audit Logs
  getAuditLogs(filters?: any): Promise<any[]>;
  createAuditLog(log: any): Promise<any>;

  // Admin Dashboard - Analytics
  getAnalyticsSummary(): Promise<any>;

  // Admin Dashboard - Settings
  getSettings(): Promise<any>;
  updateSettings(updates: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private jobs: Map<string, Job>;
  private sessions: Map<string, Session>;
  private backends: Map<string, Backend>;
  private workspaces: Map<string, Workspace>;
  private workspaceMembers: Map<string, WorkspaceMember>;
  private projects: Map<string, Project>;
  private projectCollaborators: Map<string, ProjectCollaborator>;
  private simulationInterval: NodeJS.Timeout | null = null;
  private lastIBMSync = 0;
  private readonly IBM_SYNC_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.jobs = new Map();
    this.sessions = new Map();
    this.backends = new Map();
    this.workspaces = new Map();
    this.workspaceMembers = new Map();
    this.projects = new Map();
    this.projectCollaborators = new Map();
    this.initializeData();
    this.initializeSampleJobs();

    // Start simulation timer for demo data
    setInterval(() => {
      this.simulateJobStatusChanges();
    }, 5000);

    // Sync with IBM Quantum every 30 seconds if configured
    if (ibmQuantumService.isConfigured()) {
      setInterval(() => {
        this.syncWithIBMQuantum();
      }, this.IBM_SYNC_INTERVAL);
    }
  }

  private async syncWithIBMQuantum() {
    try {
      const now = Date.now();
      if (now - this.lastIBMSync < this.IBM_SYNC_INTERVAL) {
        return;
      }

      console.log('Syncing with IBM Quantum...');

      // Fetch real jobs from IBM Quantum
      const ibmJobs = await ibmQuantumService.getJobs(50);

      // Convert IBM jobs to our format
      for (const ibmJob of ibmJobs) {
        const job: Job = {
          id: `ibm_${ibmJob.id}`,
          name: ibmJob.name || 'IBM Quantum Job',
          backend: ibmJob.backend,
          status: this.mapIBMStatus(ibmJob.status),
          queuePosition: ibmJob.status === 'queued' ? Math.floor(Math.random() * 10) + 1 : null,
          submissionTime: new Date(ibmJob.created),
          startTime: ibmJob.status === 'running' || ibmJob.status === 'completed' ?
                    new Date(ibmJob.created) : null,
          endTime: ibmJob.status === 'completed' || ibmJob.status === 'failed' ?
                  new Date(ibmJob.updated || ibmJob.created) : null,
          duration: ibmJob.runtime || null,
          qubits: ibmJob.qubits || 5,
          shots: ibmJob.shots || 1024,
          program: `// IBM Quantum Job\n${ibmJob.program || 'quantum_circuit'}`,
          results: ibmJob.results || null,
          error: ibmJob.error || null,
          tags: ['ibm', 'real'],
          sessionId: 'ibm_session_1',
        };

        this.jobs.set(job.id, job);
      }

      // Fetch real backends from IBM Quantum
      const ibmBackends = await ibmQuantumService.getBackends();

      for (const ibmBackend of ibmBackends) {
        const backend: Backend = {
          id: `ibm_${ibmBackend.name}`,
          name: ibmBackend.name,
          status: ibmBackend.status === 'online' ? 'available' :
                 ibmBackend.status === 'maintenance' ? 'maintenance' : 'busy',
          qubits: ibmBackend.num_qubits,
          queueLength: ibmBackend.pending_jobs,
          averageWaitTime: ibmBackend.pending_jobs * 45, // Estimate
          uptime: ibmBackend.status === 'online' ? '99.5%' : '0%',
          lastUpdate: new Date(),
        };

        this.backends.set(backend.id, backend);
      }

      this.lastIBMSync = now;
      console.log(`Synced ${ibmJobs.length} jobs and ${ibmBackends.length} backends from IBM Quantum`);

    } catch (error) {
      console.error('Failed to sync with IBM Quantum:', error);
    }
  }

  private mapIBMStatus(ibmStatus: string): JobStatus {
    switch (ibmStatus) {
      case 'queued': return 'queued';
      case 'running': return 'running';
      case 'completed': return 'done';
      case 'failed': return 'failed';
      case 'cancelled': return 'cancelled';
      default: return 'queued';
    }
  }

  private startJobSimulation() {
    // Simulate job status changes every 15-30 seconds
    this.simulationInterval = setInterval(() => {
      this.simulateJobStatusChanges();
    }, 20000 + Math.random() * 10000);
  }

  private initializeData() {
    // Initialize with some backends
    const backendData: InsertBackend[] = [
      {
        name: "ibm_cairo",
        status: "available",
        qubits: 127,
        queueLength: 2,
        averageWaitTime: 45,
        uptime: "99.8%",
      },
      {
        name: "ibm_osaka",
        status: "busy",
        qubits: 127,
        queueLength: 12,
        averageWaitTime: 320,
        uptime: "99.2%",
      },
      {
        name: "ibm_kyoto",
        status: "available",
        qubits: 127,
        queueLength: 1,
        averageWaitTime: 25,
        uptime: "98.9%",
      },
      {
        name: "ibm_brisbane",
        status: "available",
        qubits: 127,
        queueLength: 0,
        averageWaitTime: 15,
        uptime: "99.5%",
      },
      {
        name: "ibm_sherbrooke",
        status: "busy",
        qubits: 133,
        queueLength: 6,
        averageWaitTime: 180,
        uptime: "99.1%",
      },
      {
        name: "ibm_nazca",
        status: "maintenance",
        qubits: 127,
        queueLength: 0,
        averageWaitTime: 0,
        uptime: "0%",
      },
    ];

    backendData.forEach(backend => {
      const id = backend.name;
      this.backends.set(id, {
        id,
        name: backend.name,
        status: backend.status,
        qubits: backend.qubits,
        queueLength: backend.queueLength ?? 0,
        averageWaitTime: backend.averageWaitTime ?? 0,
        uptime: backend.uptime ?? "0%",
        lastUpdate: new Date(),
      });
    });

    // Initialize with some sessions
    const sessionData: InsertSession[] = [
      {
        name: "Quantum Machine Learning Research",
        status: "active",
      },
      {
        name: "Optimization Algorithms",
        status: "active",
      },
      {
        name: "Error Correction Testing",
        status: "active",
      },
      {
        name: "QAOA Implementation",
        status: "inactive",
      },
    ];

    sessionData.forEach((session, index) => {
      const id = `session_${index + 1}`;
      this.sessions.set(id, {
        ...session,
        id,
        createdAt: new Date(Date.now() - (index + 1) * 3600000),
        lastActivity: new Date(Date.now() - (index + 1) * 600000),
        jobCount: Math.floor(Math.random() * 12) + 3,
      });
    });

    // Initialize with realistic sample jobs
    this.initializeSampleJobs();
  }

  private initializeSampleJobs() {
    const backends = ["ibm_cairo", "ibm_osaka", "ibm_kyoto", "ibm_brisbane", "ibm_sherbrooke"];
    const statuses: JobStatus[] = ["done", "running", "queued", "failed", "cancelled"];
    const jobNames = [
      "VQE Optimization",
      "QAOA Circuit Test",
      "Quantum ML Training",
      "Error Mitigation Study",
      "Bell State Preparation",
      "Quantum Fourier Transform",
      "Grover's Algorithm",
      "Quantum Teleportation",
      "Shor's Algorithm Demo",
      "Random Circuit Sampling",
      "Quantum Supremacy Test",
      "Variational Classifier",
      "Quantum Chemistry Sim",
      "Error Correction Test",
      "NISQ Algorithm Eval"
    ];

    // Create 45 realistic sample jobs with various timestamps
    for (let i = 0; i < 45; i++) {
      const backend = backends[Math.floor(Math.random() * backends.length)];
      const name = jobNames[Math.floor(Math.random() * jobNames.length)];

      // Distribute jobs across different time periods for trends
      const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
      const submissionTime = new Date(Date.now() - hoursAgo * 3600000);

      let status: JobStatus;
      let startTime: Date | null = null;
      let endTime: Date | null = null;
      let duration: number | null = null;
      let queuePosition: number | null = null;
      let error: string | null = null;

      // Determine status based on age (newer jobs more likely to be running/queued)
      if (hoursAgo < 2) {
        // Recent jobs: running or queued
        status = Math.random() < 0.6 ? "running" : "queued";
      } else if (hoursAgo < 12) {
        // Recent jobs: mostly done, some running
        const rand = Math.random();
        if (rand < 0.7) status = "done";
        else if (rand < 0.85) status = "running";
        else if (rand < 0.95) status = "failed";
        else status = "cancelled";
      } else {
        // Older jobs: mostly completed
        const rand = Math.random();
        if (rand < 0.8) status = "done";
        else if (rand < 0.9) status = "failed";
        else status = "cancelled";
      }

      // Set timing based on status
      if (status === "queued") {
        queuePosition = Math.floor(Math.random() * 15) + 1;
      } else if (status === "running") {
        startTime = new Date(submissionTime.getTime() + Math.random() * 3600000);
      } else if (status === "done" || status === "failed") {
        startTime = new Date(submissionTime.getTime() + Math.random() * 1800000);
        endTime = new Date(startTime.getTime() + Math.random() * 1800000 + 30000);
        duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      }

      if (status === "failed") {
        error = "Quantum circuit execution timeout";
      }

      const job: Job = {
        id: `job_${(Date.now() + i).toString(36)}`,
        name,
        backend,
        status,
        queuePosition,
        submissionTime,
        startTime,
        endTime,
        duration,
        qubits: Math.floor(Math.random() * 100) + 5,
        shots: Math.pow(2, Math.floor(Math.random() * 10) + 10), // 1024 to 1M shots
        program: `// ${name}\nqc = QuantumCircuit(${Math.floor(Math.random() * 20) + 2})\n// Implementation details...`,
        results: status === "done" ? { counts: { "00": 512, "11": 512 } } : null,
        error,
        tags: Math.random() < 0.7 ? [
          ["research", "optimization", "ml", "demo"][Math.floor(Math.random() * 4)]
        ] : null,
        sessionId: `session_${Math.floor(Math.random() * 3) + 1}`,
      };

      this.jobs.set(job.id, job);
    }
  }

  private simulateJobStatusChanges() {
    const queuedJobs = Array.from(this.jobs.values()).filter(job => job.status === "queued");
    const runningJobs = Array.from(this.jobs.values()).filter(job => job.status === "running");

    // Move some queued jobs to running (simulate job starts)
    if (queuedJobs.length > 0 && Math.random() < 0.4) {
      const job = queuedJobs[Math.floor(Math.random() * queuedJobs.length)];
      job.status = "running";
      job.startTime = new Date();
      job.queuePosition = null;
      this.jobs.set(job.id, job);
    }

    // Complete some running jobs (simulate job completion)
    if (runningJobs.length > 0 && Math.random() < 0.3) {
      const job = runningJobs[Math.floor(Math.random() * runningJobs.length)];
      job.endTime = new Date();
      if (job.startTime) {
        job.duration = Math.floor((job.endTime.getTime() - new Date(job.startTime).getTime()) / 1000);
      }
      // 85% success rate
      job.status = Math.random() < 0.85 ? "done" : "failed";
      if (job.status === "failed") {
        job.error = "Quantum circuit execution error";
      } else {
        job.results = { counts: { "00": 512, "01": 256, "10": 128, "11": 128 } };
      }
      this.jobs.set(job.id, job);
    }

    // Occasionally add new jobs to keep things interesting
    if (Math.random() < 0.2) {
      this.addRandomJob();
    }

    // Update backend queue lengths based on current queued jobs
    this.updateBackendQueues();
  }

  private addRandomJob() {
    const backends = ["ibm_cairo", "ibm_osaka", "ibm_kyoto", "ibm_brisbane", "ibm_sherbrooke"];
    const jobNames = [
      "Real-time VQE Run",
      "Live QAOA Test",
      "Dynamic ML Training",
      "Fresh Error Study",
      "New Bell State Prep",
      "Live Circuit Test",
      "Runtime Algorithm",
      "Active Quantum Task"
    ];

    const backend = backends[Math.floor(Math.random() * backends.length)];
    const name = jobNames[Math.floor(Math.random() * jobNames.length)];

    const job: Job = {
      id: `job_${Date.now().toString(36)}`,
      name,
      backend,
      status: "queued",
      queuePosition: Array.from(this.jobs.values()).filter(j => j.backend === backend && j.status === "queued").length + 1,
      submissionTime: new Date(),
      startTime: null,
      endTime: null,
      duration: null,
      qubits: Math.floor(Math.random() * 50) + 10,
      shots: Math.pow(2, Math.floor(Math.random() * 6) + 10),
      program: `// ${name}\nqc = QuantumCircuit(${Math.floor(Math.random() * 10) + 2})\n// Live execution...`,
      results: null,
      error: null,
      tags: [["live", "real-time", "active"][Math.floor(Math.random() * 3)]],
      sessionId: `session_${Math.floor(Math.random() * 3) + 1}`,
    };

    this.jobs.set(job.id, job);
  }

  private updateBackendQueues() {
    this.backends.forEach(backend => {
      const queuedJobs = Array.from(this.jobs.values()).filter(job =>
        job.backend === backend.name && job.status === "queued"
      );
      backend.queueLength = queuedJobs.length;
      backend.lastUpdate = new Date();
      this.backends.set(backend.id, backend);
    });
  }

  async getJobs(limit = 100, offset = 0): Promise<Job[]> {
    const allJobs = Array.from(this.jobs.values())
      .sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
    return allJobs.slice(offset, offset + limit);
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = `job_${randomUUID().slice(0, 8)}`;
    const job: Job = {
      id,
      name: insertJob.name ?? null,
      backend: insertJob.backend,
      status: insertJob.status,
      queuePosition: insertJob.status === 'queued' ? await this.getNextQueuePosition(insertJob.backend) : null,
      submissionTime: new Date(),
      startTime: null,
      endTime: null,
      duration: null,
      qubits: insertJob.qubits,
      shots: insertJob.shots,
      program: insertJob.program,
      results: null,
      error: null,
      tags: insertJob.tags ?? null,
      sessionId: insertJob.sessionId ?? null,
    };

    this.jobs.set(id, job);
    return job;
  }

  private async getNextQueuePosition(backend: string): Promise<number> {
    const queuedJobs = Array.from(this.jobs.values())
      .filter(job => job.backend === backend && job.status === 'queued');
    return queuedJobs.length + 1;
  }

  async updateJobStatus(id: string, status: JobStatus, error?: string): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const now = new Date();
    const updatedJob: Job = {
      ...job,
      status,
      error: error || null,
    };

    if (status === 'running' && job.status === 'queued') {
      updatedJob.startTime = now;
      updatedJob.queuePosition = null;
    } else if ((status === 'done' || status === 'failed') && job.status === 'running') {
      updatedJob.endTime = now;
      if (job.startTime) {
        updatedJob.duration = Math.floor((now.getTime() - new Date(job.startTime).getTime()) / 1000);
      }
    }

    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async searchJobs(query: string): Promise<Job[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.jobs.values()).filter(job =>
      job.id.toLowerCase().includes(searchTerm) ||
      job.backend.toLowerCase().includes(searchTerm) ||
      job.status.toLowerCase().includes(searchTerm) ||
      job.name?.toLowerCase().includes(searchTerm) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getJobsByStatus(status: JobStatus): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  async getJobsByBackend(backend: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.backend === backend);
  }

  async getSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = `session_${randomUUID().slice(0, 8)}`;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      lastActivity: new Date(),
      jobCount: 0,
    };

    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async getBackends(): Promise<Backend[]> {
    return Array.from(this.backends.values());
  }

  async getBackendById(id: string): Promise<Backend | undefined> {
    return this.backends.get(id);
  }

  async createBackend(insertBackend: InsertBackend): Promise<Backend> {
    const id = insertBackend.name;
    const backend: Backend = {
      id,
      name: insertBackend.name,
      status: insertBackend.status,
      qubits: insertBackend.qubits,
      queueLength: insertBackend.queueLength ?? 0,
      averageWaitTime: insertBackend.averageWaitTime ?? 0,
      uptime: insertBackend.uptime ?? "0%",
      lastUpdate: new Date(),
    };

    this.backends.set(id, backend);
    return backend;
  }

  async updateBackend(id: string, updates: Partial<Backend>): Promise<Backend | undefined> {
    const backend = this.backends.get(id);
    if (!backend) return undefined;

    const updatedBackend = { ...backend, ...updates, lastUpdate: new Date() };
    this.backends.set(id, updatedBackend);
    return updatedBackend;
  }

  async getJobStats(): Promise<{
    totalJobs: number;
    runningJobs: number;
    queuedJobs: number;
    completedJobs: number;
    failedJobs: number;
    successRate: number;
  }> {
    const allJobs = Array.from(this.jobs.values());
    const totalJobs = allJobs.length;
    const runningJobs = allJobs.filter(job => job.status === 'running').length;
    const queuedJobs = allJobs.filter(job => job.status === 'queued').length;
    const completedJobs = allJobs.filter(job => job.status === 'done').length;
    const failedJobs = allJobs.filter(job => job.status === 'failed').length;
    const successRate = (completedJobs + failedJobs) > 0 ? (completedJobs / (completedJobs + failedJobs)) * 100 : 0;

    return {
      totalJobs,
      runningJobs,
      queuedJobs,
      completedJobs,
      failedJobs,
      successRate: Math.round(successRate * 10) / 10,
    };
  }

  // Workspace methods
  async getWorkspaces(): Promise<Workspace[]> {
    return Array.from(this.workspaces.values())
      .sort((a, b) => new Date(b.lastActivity || 0).getTime() - new Date(a.lastActivity || 0).getTime());
  }

  async getWorkspaceById(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async createWorkspace(insertWorkspace: InsertWorkspace): Promise<Workspace> {
    const id = `ws_${randomUUID().slice(0, 8)}`;
    const workspace: Workspace = {
      id,
      name: insertWorkspace.name,
      description: insertWorkspace.description || null,
      status: insertWorkspace.status,
      privacy: insertWorkspace.privacy,
      ownerId: insertWorkspace.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActivity: new Date(),
      progress: insertWorkspace.progress || 0,
      settings: insertWorkspace.settings || null,
    };

    this.workspaces.set(id, workspace);
    return workspace;
  }

  async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<Workspace | undefined> {
    const workspace = this.workspaces.get(id);
    if (!workspace) return undefined;

    const updatedWorkspace = { 
      ...workspace, 
      ...updates, 
      updatedAt: new Date(),
      lastActivity: new Date()
    };
    this.workspaces.set(id, updatedWorkspace);
    return updatedWorkspace;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    // Also delete related members and projects
    const members = Array.from(this.workspaceMembers.values()).filter(m => m.workspaceId === id);
    const projects = Array.from(this.projects.values()).filter(p => p.workspaceId === id);
    
    members.forEach(member => this.workspaceMembers.delete(member.id));
    
    for (const project of projects) {
      // Delete project collaborators
      const collaborators = Array.from(this.projectCollaborators.values()).filter(c => c.projectId === project.id);
      collaborators.forEach(collaborator => this.projectCollaborators.delete(collaborator.id));
      this.projects.delete(project.id);
    }

    return this.workspaces.delete(id);
  }

  async searchWorkspaces(query: string): Promise<Workspace[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.workspaces.values()).filter(workspace =>
      workspace.name.toLowerCase().includes(searchTerm) ||
      workspace.description?.toLowerCase().includes(searchTerm) ||
      workspace.status.toLowerCase().includes(searchTerm)
    );
  }

  // Workspace Member methods
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    return Array.from(this.workspaceMembers.values())
      .filter(member => member.workspaceId === workspaceId)
      .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());
  }

  async addWorkspaceMember(insertMember: InsertWorkspaceMember): Promise<WorkspaceMember> {
    const id = `wm_${randomUUID().slice(0, 8)}`;
    const member: WorkspaceMember = {
      id,
      workspaceId: insertMember.workspaceId,
      userId: insertMember.userId,
      userName: insertMember.userName,
      userEmail: insertMember.userEmail || null,
      role: insertMember.role,
      joinedAt: new Date(),
      permissions: insertMember.permissions || null,
    };

    this.workspaceMembers.set(id, member);
    return member;
  }

  async updateWorkspaceMember(id: string, updates: Partial<WorkspaceMember>): Promise<WorkspaceMember | undefined> {
    const member = this.workspaceMembers.get(id);
    if (!member) return undefined;

    const updatedMember = { ...member, ...updates };
    this.workspaceMembers.set(id, updatedMember);
    return updatedMember;
  }

  async removeWorkspaceMember(id: string): Promise<boolean> {
    return this.workspaceMembers.delete(id);
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByWorkspace(workspaceId: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = `proj_${randomUUID().slice(0, 8)}`;
    const project: Project = {
      id,
      name: insertProject.name,
      description: insertProject.description || null,
      workspaceId: insertProject.workspaceId,
      ownerId: insertProject.ownerId,
      status: insertProject.status,
      backend: insertProject.backend || null,
      circuitCode: insertProject.circuitCode || null,
      configuration: insertProject.configuration || null,
      results: insertProject.results || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModified: new Date(),
      runtime: insertProject.runtime || null,
      isPublic: insertProject.isPublic || false,
      tags: insertProject.tags || null,
    };

    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { 
      ...project, 
      ...updates, 
      updatedAt: new Date(),
      lastModified: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    // Delete related collaborators
    const collaborators = Array.from(this.projectCollaborators.values()).filter(c => c.projectId === id);
    collaborators.forEach(collaborator => this.projectCollaborators.delete(collaborator.id));
    
    return this.projects.delete(id);
  }

  async searchProjects(query: string): Promise<Project[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.projects.values()).filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description?.toLowerCase().includes(searchTerm) ||
      project.status.toLowerCase().includes(searchTerm) ||
      project.backend?.toLowerCase().includes(searchTerm) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Project Collaborator methods
  async getProjectCollaborators(projectId: string): Promise<ProjectCollaborator[]> {
    return Array.from(this.projectCollaborators.values())
      .filter(collaborator => collaborator.projectId === projectId)
      .sort((a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
  }

  async addProjectCollaborator(insertCollaborator: InsertProjectCollaborator): Promise<ProjectCollaborator> {
    const id = `pc_${randomUUID().slice(0, 8)}`;
    const collaborator: ProjectCollaborator = {
      id,
      projectId: insertCollaborator.projectId,
      userId: insertCollaborator.userId,
      userName: insertCollaborator.userName,
      role: insertCollaborator.role,
      addedAt: new Date(),
      permissions: insertCollaborator.permissions || null,
    };

    this.projectCollaborators.set(id, collaborator);
    return collaborator;
  }

  async updateProjectCollaborator(id: string, updates: Partial<ProjectCollaborator>): Promise<ProjectCollaborator | undefined> {
    const collaborator = this.projectCollaborators.get(id);
    if (!collaborator) return undefined;

    const updatedCollaborator = { ...collaborator, ...updates };
    this.projectCollaborators.set(id, updatedCollaborator);
    return updatedCollaborator;
  }

  async removeProjectCollaborator(id: string): Promise<boolean> {
    return this.projectCollaborators.delete(id);
  }

  // Admin Dashboard - Pricing Plans
  async getPricingPlans(): Promise<any[]> {
    return mockPricingPlans;
  }
  
  async getPricingPlanById(id: string): Promise<any | undefined> {
    return mockPricingPlans.find(p => p.id === id);
  }
  
  async createPricingPlan(plan: any): Promise<any> {
    return plan;
  }
  
  async updatePricingPlan(id: string, updates: any): Promise<any | undefined> {
    const plan = mockPricingPlans.find(p => p.id === id);
    return plan ? { ...plan, ...updates } : undefined;
  }
  
  async deletePricingPlan(id: string): Promise<boolean> {
    return mockPricingPlans.some(p => p.id === id);
  }
  
  async publishPricingPlan(id: string): Promise<any | undefined> {
    const plan = mockPricingPlans.find(p => p.id === id);
    return plan ? { ...plan, status: 'published' } : undefined;
  }
  
  async getPricingPlanVersions(planId: string): Promise<any[]> {
    return [];
  }

  // Admin Dashboard - Content Management
  async getContentSections(): Promise<any[]> {
    return mockContentSections;
  }
  
  async getContentSectionById(id: string): Promise<any | undefined> {
    return mockContentSections.find(s => s.id === id);
  }
  
  async createContentSection(section: any): Promise<any> {
    return section;
  }
  
  async updateContentSection(id: string, updates: any): Promise<any | undefined> {
    const section = mockContentSections.find(s => s.id === id);
    return section ? { ...section, ...updates } : undefined;
  }
  
  async deleteContentSection(id: string): Promise<boolean> {
    return mockContentSections.some(s => s.id === id);
  }
  
  async publishContentSection(id: string): Promise<any | undefined> {
    const section = mockContentSections.find(s => s.id === id);
    return section ? { ...section, status: 'published' } : undefined;
  }
  
  async getContentVersions(sectionId: string): Promise<any[]> {
    return [];
  }

  // Admin Dashboard - News Management
  async getAdminNews(): Promise<any[]> {
    return mockNews;
  }
  
  async getAdminNewsById(id: string): Promise<any | undefined> {
    return mockNews.find(n => n.id === id);
  }
  
  async createAdminNews(news: any): Promise<any> {
    return news;
  }
  
  async updateAdminNews(id: string, updates: any): Promise<any | undefined> {
    const news = mockNews.find(n => n.id === id);
    return news ? { ...news, ...updates } : undefined;
  }
  
  async deleteAdminNews(id: string): Promise<boolean> {
    return mockNews.some(n => n.id === id);
  }
  
  async publishAdminNews(id: string): Promise<any | undefined> {
    const news = mockNews.find(n => n.id === id);
    return news ? { ...news, status: 'published' } : undefined;
  }

  // Admin Dashboard - User Management
  async getUsers(filters?: any): Promise<any[]> {
    return mockUsers;
  }
  
  async getUserById(id: string): Promise<any | undefined> {
    return mockUsers.find(u => u.id === id);
  }
  
  async createUser(user: any): Promise<any> {
    return user;
  }
  
  async updateUser(id: string, updates: any): Promise<any | undefined> {
    const user = mockUsers.find(u => u.id === id);
    return user ? { ...user, ...updates } : undefined;
  }
  
  async deleteUser(id: string): Promise<boolean> {
    return mockUsers.some(u => u.id === id);
  }
  
  async getUserStats(): Promise<any> {
    return mockUserStats;
  }

  // Admin Dashboard - Game Scores
  async getGameScores(userId?: string): Promise<any[]> {
    if (userId) {
      return mockLeaderboard.filter(s => s.userId === userId);
    }
    return mockLeaderboard;
  }
  
  async getLeaderboard(gameType?: string, limit: number = 10): Promise<any[]> {
    if (gameType) {
      return mockLeaderboard.filter(s => s.gameType === gameType).slice(0, limit);
    }
    return mockLeaderboard.slice(0, limit);
  }

  // Admin Dashboard - Audit Logs
  async getAuditLogs(filters?: any): Promise<any[]> {
    return mockAuditLogs;
  }
  
  async createAuditLog(log: any): Promise<any> {
    return log;
  }

  // Admin Dashboard - Analytics
  async getAnalyticsSummary(): Promise<any> {
    return mockAnalytics;
  }

  // Admin Dashboard - Settings
  async getSettings(): Promise<any> {
    return {
      platform: {
        siteName: "QuantumCloud",
        tagline: "Cloud Quantum Computing Platform",
        maintenanceMode: false,
        allowRegistrations: true
      },
      quantumBackend: {
        ibmApiToken: process.env.IBM_QUANTUM_API_TOKEN || "",
        defaultBackend: "ibm_simulator",
        enableSimulator: true,
        maxConcurrentJobs: 10
      },
      jobLimits: {
        freeMonthlyJobs: 5,
        proMonthlyJobs: 100,
        enterpriseMonthlyJobs: 1000,
        freeMaxQubits: 5,
        proMaxQubits: 15,
        enterpriseMaxQubits: 30
      },
      learning: {
        enableQuantumQuest: true,
        enableQuizzes: true,
        enableLeaderboards: true,
        enableTutorials: true,
        enableAchievements: true,
        pointsPerChallenge: 100
      },
      security: {
        require2FA: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordMinLength: 8
      }
    };
  }
  
  async updateSettings(updates: any): Promise<any> {
    const currentSettings = await this.getSettings();
    const { section, data } = updates;
    
    if (section && data) {
      return {
        ...currentSettings,
        [section]: {
          ...currentSettings[section],
          ...data
        }
      };
    }
    
    return { ...currentSettings, ...updates };
  }
}

export const storage = new MemStorage();
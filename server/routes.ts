import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertJobSchema, insertSessionSchema, insertWorkspaceSchema, 
  insertWorkspaceMemberSchema, insertProjectSchema, insertProjectCollaboratorSchema,
  JobStatus, WorkspaceStatus, ProjectStatus 
} from "@shared/schema";
import { z } from "zod";
import { ibmQuantumService } from "./ibm-quantum";
import { openaiService } from "./openai-service";
import { connectMongoDB } from "./db/mongodb";
import { User } from "./models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateToken, authenticateToken, type AuthRequest } from "./middleware/auth";

// Enhanced quantum simulation for educational purposes
function generateQuantumResults(jobData: any) {
  const { levelId, circuitCode, backend } = jobData;
  
  // Simulate different quantum states based on circuit type
  if (circuitCode.includes('Bell') || (circuitCode.includes('h(0)') && circuitCode.includes('cx(0'))) {
    // Bell state: should show |00⟩ and |11⟩ with roughly equal probability
    return {
      counts: {
        '00': Math.floor(Math.random() * 100 + 450), // ~45-55% of shots
        '11': Math.floor(Math.random() * 100 + 450), // ~45-55% of shots
        '01': Math.floor(Math.random() * 20 + 10),   // ~1-3% noise
        '10': Math.floor(Math.random() * 20 + 10)    // ~1-3% noise
      },
      success_probability: 0.95,
      educational_note: "Perfect Bell state shows entanglement between qubits!"
    };
  } else if (circuitCode.includes('h(')) {
    // Superposition state: should show equal distribution
    return {
      counts: {
        '0': Math.floor(Math.random() * 100 + 450),
        '1': Math.floor(Math.random() * 100 + 450)
      },
      success_probability: 0.92,
      educational_note: "Hadamard gate creates perfect superposition!"
    };
  } else if (circuitCode.includes('x(')) {
    // X gate: should flip the state
    return {
      counts: {
        '1': Math.floor(Math.random() * 50 + 950), // ~95-100% in |1⟩
        '0': Math.floor(Math.random() * 50 + 0)    // ~0-5% in |0⟩
      },
      success_probability: 0.98,
      educational_note: "X gate successfully flipped the qubit state!"
    };
  }
  
  // Default: computational basis state
  return {
    counts: {
      '00': Math.floor(Math.random() * 50 + 950),
      '01': Math.floor(Math.random() * 25 + 10),
      '10': Math.floor(Math.random() * 25 + 10),
      '11': Math.floor(Math.random() * 25 + 5)
    },
    success_probability: 0.88,
    educational_note: "Great job! Your quantum circuit executed successfully."
  };
}

// Generate default counts for demo purposes
function generateDefaultCounts(jobId: string) {
  // Seed random with jobId for consistency
  const seed = jobId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  
  if (seed % 3 === 0) {
    return { '00': 487, '11': 501, '01': 18, '10': 18 }; // Bell state
  } else if (seed % 3 === 1) {
    return { '0': 512, '1': 512 }; // Perfect superposition
  } else {
    return { '1': 967, '0': 57 }; // X gate result
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB (non-blocking)
  connectMongoDB().catch(() => {
    // Error already logged in connectMongoDB
  });

  // ==================== AUTHENTICATION ROUTES ====================
  
  // User Signup
  app.post("/api/auth/signup", async (req, res) => {
    // Check if MongoDB is connected
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "Database not available. Please check MongoDB connection.",
        details: "MongoDB is required for user authentication. Please ensure MongoDB is running and MONGODB_URI is set correctly."
      });
    }
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        plan: "standard",
        status: "active",
      });

      await user.save();

      // Generate JWT token
      const token = generateToken(user._id.toString());

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          plan: user.plan,
        },
        token,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to create user account" });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    // Check if MongoDB is connected
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "Database not available. Please check MongoDB connection.",
        details: "MongoDB is required for user authentication. Please ensure MongoDB is running and MONGODB_URI is set correctly."
      });
    }
    
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Find user by email (include password for comparison)
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if account is active
      if (user.status !== "active") {
        return res.status(403).json({ error: "Account is not active. Please contact support." });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id.toString());

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          plan: user.plan,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // Get Current User (Protected Route)
  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    // Check if MongoDB is connected
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "Database not available. Please check MongoDB connection.",
        details: "MongoDB is required for user authentication. Please ensure MongoDB is running and MONGODB_URI is set correctly."
      });
    }
    
    try {
      const user = await User.findById(req.user!.id).select("-password");
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          plan: user.plan,
          status: user.status,
          signupDate: user.signupDate,
          lastLogin: user.lastLogin,
          jobsSubmitted: user.jobsSubmitted,
        },
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // Jobs endpoints
  app.get("/api/jobs", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const allJobs = await storage.getJobs();
      const totalJobs = allJobs.length;
      const paginatedJobs = allJobs.slice(offset, offset + limit);

      res.json({
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
          limit
        }
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const jobs = await storage.searchJobs(query);
      res.json(jobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/jobs/status/:status", async (req, res) => {
    try {
      const status = req.params.status as JobStatus;
      const jobs = await storage.getJobsByStatus(status);
      res.json(jobs);
    } catch (error) {
      console.error(`Error fetching jobs by status ${status}:`, error);
      res.status(500).json({ error: "Failed to fetch jobs by status" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error(`Error fetching job with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.patch("/api/jobs/:id/status", async (req, res) => {
    try {
      const { status, error } = req.body;
      const job = await storage.updateJobStatus(req.params.id, status, error);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error(`Error updating status for job ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update job status" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const success = await storage.deleteJob(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting job ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // Sessions endpoints
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Backends endpoints
  app.get("/api/backends", async (req, res) => {
    try {
      const backends = await storage.getBackends();
      res.json(backends);
    } catch (error) {
      console.error("Error fetching backends:", error);
      res.status(500).json({ error: "Failed to fetch backends" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const stats = await storage.getJobStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching job stats:", error);
      res.status(500).json({ error: "Failed to fetch job stats" });
    }
  });

  app.get("/api/analytics/trends", async (req, res) => {
    try {
      // Simple trend data generation
      const jobs = await storage.getJobs();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const trends = last7Days.map(date => {
        const dayJobs = jobs.filter(job =>
          job.submissionTime.toISOString().split('T')[0] === date
        );
        return {
          date,
          count: dayJobs.length,
          label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
        };
      });

      res.json(trends);
    } catch (error) {
      console.error("Error fetching trends:", error);
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // IBM Quantum Sync Status
  app.get("/api/sync/ibm/status", async (req, res) => {
    try {
      res.json({
        configured: ibmQuantumService.isConfigured(),
        status: ibmQuantumService.getApiStatus(),
        lastSync: new Date().toISOString(),
        endpoints: {
          runtime: "https://runtime.quantum-computing.ibm.com",
          auth: "https://auth.quantum-computing.ibm.com/api"
        }
      });
    } catch (error) {
      console.error("Error checking IBM Quantum status:", error);
      res.status(500).json({ error: "Failed to check IBM Quantum status" });
    }
  });

  // Sync with IBM Quantum
  app.post('/api/sync/ibm', async (req, res) => {
    try {
      if (!ibmQuantumService.isConfigured()) {
        console.log('IBM Quantum API not configured, using simulated data');
        return res.json({ 
          message: 'Using simulated data for demonstration',
          configured: false
        });
      }

      // This would trigger a manual sync in a real implementation
      console.log('Manual IBM Quantum sync requested');
      res.json({ 
        message: 'Sync initiated successfully',
        configured: true
      });
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({ error: 'Failed to sync with IBM Quantum' });
    }
  });


  // Real-time IBM Quantum data
  app.get("/api/ibm-quantum/live", async (req, res) => {
    try {
      if (!ibmQuantumService.isConfigured()) {
        return res.status(400).json({ 
          error: "IBM Quantum API not configured",
          details: "Please add IBM_QUANTUM_API_TOKEN to your .env file"
        });
      }

      const [jobs, backends] = await Promise.all([
        ibmQuantumService.getJobs(50),
        ibmQuantumService.getBackends()
      ]);

      res.json({
        timestamp: new Date().toISOString(),
        jobs: jobs.map(job => ({
          id: job.id,
          name: job.name,
          backend: job.backend,
          status: job.status,
          created: job.created,
          qubits: job.qubits,
          shots: job.shots
        })),
        backends: backends.map(backend => ({
          name: backend.name,
          status: backend.status,
          qubits: backend.num_qubits,
          queue: backend.pending_jobs
        })),
        summary: {
          totalJobs: jobs.length,
          runningJobs: jobs.filter(j => j.status === 'running').length,
          queuedJobs: jobs.filter(j => j.status === 'queued').length,
          availableBackends: backends.filter(b => b.status === 'online').length
        }
      });
    } catch (error) {
      console.error("Error fetching live IBM Quantum data:", error);
      res.status(500).json({ 
        error: "Failed to fetch live data from IBM Quantum",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Export endpoints
  app.get("/api/export/csv", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      const csvHeaders = "Job ID,Backend,Status,Submitted,Duration\n";
      const csvData = jobs.map(job =>
        `${job.id},${job.backend},${job.status},${job.submissionTime.toISOString()},${job.duration || 0}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="quantum_jobs.csv"');
      res.send(csvHeaders + csvData);
    } catch (error) {
      console.error("Error exporting jobs to CSV:", error);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  app.get("/api/export/json", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="quantum_jobs.json"');
      res.json(jobs);
    } catch (error) {
      console.error("Error exporting jobs to JSON:", error);
      res.status(500).json({ error: "Failed to export JSON" });
    }
  });

  // ==================== TEAMWORK API ROUTES ====================

  // Workspace endpoints
  app.get("/api/workspaces", async (req, res) => {
    try {
      const workspaces = await storage.getWorkspaces();
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.get("/api/workspaces/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const workspaces = await storage.searchWorkspaces(query);
      res.json(workspaces);
    } catch (error) {
      console.error("Error searching workspaces:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/workspaces/:id", async (req, res) => {
    try {
      const workspace = await storage.getWorkspaceById(req.params.id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      console.error(`Error fetching workspace with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch workspace" });
    }
  });

  app.post("/api/workspaces", async (req, res) => {
    try {
      const workspaceData = insertWorkspaceSchema.parse(req.body);
      const workspace = await storage.createWorkspace(workspaceData);
      res.status(201).json(workspace);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating workspace:", error);
      res.status(500).json({ error: "Failed to create workspace" });
    }
  });

  app.patch("/api/workspaces/:id", async (req, res) => {
    try {
      const workspace = await storage.updateWorkspace(req.params.id, req.body);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      console.error(`Error updating workspace ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update workspace" });
    }
  });

  app.delete("/api/workspaces/:id", async (req, res) => {
    try {
      const success = await storage.deleteWorkspace(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting workspace ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete workspace" });
    }
  });

  // Workspace Member endpoints
  app.get("/api/workspaces/:workspaceId/members", async (req, res) => {
    try {
      const members = await storage.getWorkspaceMembers(req.params.workspaceId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      res.status(500).json({ error: "Failed to fetch workspace members" });
    }
  });

  app.post("/api/workspaces/:workspaceId/members", async (req, res) => {
    try {
      const memberData = insertWorkspaceMemberSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId
      });
      const member = await storage.addWorkspaceMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding workspace member:", error);
      res.status(500).json({ error: "Failed to add workspace member" });
    }
  });

  app.patch("/api/workspace-members/:id", async (req, res) => {
    try {
      const member = await storage.updateWorkspaceMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error(`Error updating workspace member ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update workspace member" });
    }
  });

  app.delete("/api/workspace-members/:id", async (req, res) => {
    try {
      const success = await storage.removeWorkspaceMember(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error removing workspace member ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to remove workspace member" });
    }
  });

  // Project endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const projects = await storage.searchProjects(query);
      res.json(projects);
    } catch (error) {
      console.error("Error searching projects:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/workspaces/:workspaceId/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByWorkspace(req.params.workspaceId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching workspace projects:", error);
      res.status(500).json({ error: "Failed to fetch workspace projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error(`Error fetching project with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error(`Error updating project ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting project ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Project Collaborator endpoints
  app.get("/api/projects/:projectId/collaborators", async (req, res) => {
    try {
      const collaborators = await storage.getProjectCollaborators(req.params.projectId);
      res.json(collaborators);
    } catch (error) {
      console.error("Error fetching project collaborators:", error);
      res.status(500).json({ error: "Failed to fetch project collaborators" });
    }
  });

  app.post("/api/projects/:projectId/collaborators", async (req, res) => {
    try {
      const collaboratorData = insertProjectCollaboratorSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const collaborator = await storage.addProjectCollaborator(collaboratorData);
      res.status(201).json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding project collaborator:", error);
      res.status(500).json({ error: "Failed to add project collaborator" });
    }
  });

  app.patch("/api/project-collaborators/:id", async (req, res) => {
    try {
      const collaborator = await storage.updateProjectCollaborator(req.params.id, req.body);
      if (!collaborator) {
        return res.status(404).json({ error: "Project collaborator not found" });
      }
      res.json(collaborator);
    } catch (error) {
      console.error(`Error updating project collaborator ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update project collaborator" });
    }
  });

  app.delete("/api/project-collaborators/:id", async (req, res) => {
    try {
      const success = await storage.removeProjectCollaborator(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project collaborator not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error removing project collaborator ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to remove project collaborator" });
    }
  });

  // Quantum Quest job submission schema
  const quantumJobSubmissionSchema = z.object({
    levelId: z.string().min(1, "Level ID is required"),
    circuitCode: z.string().min(1, "Circuit code is required"),
    backend: z.string().default("ibm_qasm_simulator"),
    shots: z.number().int().min(1).max(100000).default(1024),
    metadata: z.object({
      challengeType: z.string(),
      expectedResult: z.string(),
      learningObjective: z.string()
    }).optional()
  });

  // Quantum Quest job submission endpoint
  app.post("/api/quantum/submit-job", async (req, res) => {
    try {
      const validatedData = quantumJobSubmissionSchema.parse(req.body);
      
      // Create a quantum job entry
      const quantumJob = {
        id: `quest_${validatedData.levelId}_${Date.now()}`,
        name: `Quantum Quest: ${validatedData.levelId}`,
        status: "queued" as const,
        backend: validatedData.backend,
        qubits: 2,
        shots: validatedData.shots,
        program: validatedData.circuitCode,
        tags: ["quantum-quest", validatedData.levelId],
        results: {
          metadata: {
            ...validatedData.metadata,
            source: "quantum-quest",
            circuitCode: validatedData.circuitCode
          }
        }
      };

      // Add to job storage
      const job = await storage.createJob(quantumJob);

      
      // Simulate realistic quantum job execution
      setTimeout(async () => {
        try {
          const executionResults = generateQuantumResults(validatedData);
          // Update job with results by updating the whole job record
          const updatedJob = await storage.getJobById(job.id);
          if (updatedJob) {
            updatedJob.results = executionResults;
            updatedJob.status = "done";
            updatedJob.endTime = new Date();
            updatedJob.duration = Math.floor(Math.random() * 3 + 2); // 2-5 seconds
          }
          await storage.updateJobStatus(job.id, "done");
        } catch (error) {
          await storage.updateJobStatus(job.id, "failed", "Quantum execution simulation failed");
        }
      }, Math.random() * 3000 + 2000); // 2-5 seconds realistic timing

      res.json({ success: true, jobId: job.id, id: job.id, status: job.status });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Failed to submit quantum quest job:", error);
      res.status(500).json({ error: "Failed to submit quantum job" });
    }
  });

  // Enhanced quantum quest job status with realistic simulation
  app.get("/api/quantum/jobs/:jobId", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      // Add quantum-specific fields for better educational experience
      const jobResults = job.results as any || {};
      const quantumJob = {
        ...job,
        jobId: job.id,
        results: job.results ? jobResults : {
          counts: generateDefaultCounts(req.params.jobId),
          metadata: jobResults.metadata || {}
        },
        duration: job.duration || Math.random() * 2 + 0.5,
        qubits: job.qubits || 2,
        shots: job.shots || 1024
      };
      
      res.json(quantumJob);
    } catch (error) {
      console.error(`Error fetching quantum job ${req.params.jobId}:`, error);
      res.status(500).json({ error: "Failed to fetch job status" });
    }
  });

  // ==================== AI ASSISTANT API ROUTES ====================
  
  // Generate job suggestions
  app.post("/api/ai/job-suggestions", async (req, res) => {
    try {
      const { qubits, shots, backend, program } = req.body;
      const suggestions = await openaiService.generateJobSuggestions({
        qubits: parseInt(qubits),
        shots: parseInt(shots),
        backend,
        program
      });
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating job suggestions:", error);
      res.status(500).json({ error: "Failed to generate AI suggestions" });
    }
  });

  // Analyze failed job
  app.post("/api/ai/analyze-failure/:jobId", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      
      if (job.status !== 'failed') {
        return res.status(400).json({ error: "Job has not failed" });
      }

      const analysis = await openaiService.analyzeFailedJob(job);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing failed job:", error);
      res.status(500).json({ error: "Failed to analyze failed job" });
    }
  });

  // Get circuit improvement instructions
  app.post("/api/ai/circuit-instructions/:jobId", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const instructions = await openaiService.getCircuitInstructions(job);
      res.json({ instructions });
    } catch (error) {
      console.error("Error getting circuit instructions:", error);
      res.status(500).json({ error: "Failed to get circuit instructions" });
    }
  });

  // Get guided improvements
  app.post("/api/ai/guided-improvements/:jobId", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const improvements = await openaiService.getGuidedImprovements(job);
      res.json(improvements);
    } catch (error) {
      console.error("Error getting guided improvements:", error);
      res.status(500).json({ error: "Failed to get guided improvements" });
    }
  });

  // Generate circuit code
  app.post("/api/ai/generate-circuit", async (req, res) => {
    try {
      const { description, qubits } = req.body;
      const circuitCode = await openaiService.generateCircuitCode(description, parseInt(qubits));
      res.json({ circuitCode });
    } catch (error) {
      console.error("Error generating circuit code:", error);
      res.status(500).json({ error: "Failed to generate circuit code" });
    }
  });

  // General AI Chat endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      console.log("AI Chat endpoint hit with body:", req.body);
      const { message } = req.body;
      if (!message) {
        console.log("No message provided");
        return res.status(400).json({ error: "Message is required" });
      }
      
      console.log("Calling OpenAI service with message:", message);
      const response = await openaiService.chat(message);
      console.log("OpenAI service responded:", response);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Check AI service status
  app.get("/api/ai/status", async (req, res) => {
    try {
      const isConfigured = openaiService.isServiceConfigured();
      const apiKey = process.env.OPENAI_API_KEY;
      
      let statusMessage = "⚠️  OpenAI API not configured";
      let setupInstructions = [];
      
      if (!apiKey) {
        statusMessage = "⚠️  OPENAI_API_KEY not found in environment variables";
        setupInstructions = [
          "1. Get API key from https://platform.openai.com/api-keys",
          "2. Add OPENAI_API_KEY=your_key_here to .env file",
          "3. Restart the server"
        ];
      } else if (!apiKey.startsWith('sk-')) {
        statusMessage = "⚠️  OpenAI API key format is invalid (should start with 'sk-')";
        setupInstructions = [
          "1. Check your API key format",
          "2. Get a new key from https://platform.openai.com/api-keys",
          "3. Update OPENAI_API_KEY in .env file"
        ];
      } else if (isConfigured) {
        statusMessage = "✅ AI Assistant Ready";
      } else {
        statusMessage = "⚠️  OpenAI service failed to initialize";
        setupInstructions = [
          "1. Check server logs for detailed error",
          "2. Verify API key is valid",
          "3. Check network connectivity"
        ];
      }
      
      res.json({
        configured: isConfigured,
        status: statusMessage,
        hasApiKey: !!apiKey,
        apiKeyFormatValid: apiKey ? apiKey.startsWith('sk-') : false,
        setupInstructions,
        features: [
          "Job creation suggestions",
          "Failure analysis",
          "Circuit code generation",
          "Optimization recommendations",
          "AI Assistant Chat",
          "Guided improvements"
        ]
      });
    } catch (error) {
      console.error("Error checking AI status:", error);
      res.status(500).json({ error: "Failed to check AI status" });
    }
  });

  // ================== ADMIN DASHBOARD ROUTES ==================

  // Admin - Pricing Plans
  app.get("/api/admin/pricing-plans", async (_req, res) => {
    try {
      const plans = await storage.getPricingPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      res.status(500).json({ error: "Failed to fetch pricing plans" });
    }
  });

  app.get("/api/admin/pricing-plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPricingPlanById(req.params.id);
      if (!plan) return res.status(404).json({ error: "Pricing plan not found" });
      res.json(plan);
    } catch (error) {
      console.error("Error fetching pricing plan:", error);
      res.status(500).json({ error: "Failed to fetch pricing plan" });
    }
  });

  app.post("/api/admin/pricing-plans", async (req, res) => {
    try {
      const plan = await storage.createPricingPlan(req.body);
      res.json(plan);
    } catch (error) {
      console.error("Error creating pricing plan:", error);
      res.status(500).json({ error: "Failed to create pricing plan" });
    }
  });

  app.patch("/api/admin/pricing-plans/:id", async (req, res) => {
    try {
      const plan = await storage.updatePricingPlan(req.params.id, req.body);
      if (!plan) return res.status(404).json({ error: "Pricing plan not found" });
      res.json(plan);
    } catch (error) {
      console.error("Error updating pricing plan:", error);
      res.status(500).json({ error: "Failed to update pricing plan" });
    }
  });

  app.delete("/api/admin/pricing-plans/:id", async (req, res) => {
    try {
      const success = await storage.deletePricingPlan(req.params.id);
      if (!success) return res.status(404).json({ error: "Pricing plan not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting pricing plan:", error);
      res.status(500).json({ error: "Failed to delete pricing plan" });
    }
  });

  app.post("/api/admin/pricing-plans/:id/publish", async (req, res) => {
    try {
      const plan = await storage.publishPricingPlan(req.params.id);
      if (!plan) return res.status(404).json({ error: "Pricing plan not found" });
      res.json(plan);
    } catch (error) {
      console.error("Error publishing pricing plan:", error);
      res.status(500).json({ error: "Failed to publish pricing plan" });
    }
  });

  app.get("/api/admin/pricing-plans/:id/versions", async (req, res) => {
    try {
      const versions = await storage.getPricingPlanVersions(req.params.id);
      res.json(versions);
    } catch (error) {
      console.error("Error fetching plan versions:", error);
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  });

  // Admin - Content Management
  app.get("/api/admin/content", async (_req, res) => {
    try {
      const sections = await storage.getContentSections();
      res.json(sections);
    } catch (error) {
      console.error("Error fetching content sections:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/admin/content/:id", async (req, res) => {
    try {
      const section = await storage.getContentSectionById(req.params.id);
      if (!section) return res.status(404).json({ error: "Content section not found" });
      res.json(section);
    } catch (error) {
      console.error("Error fetching content section:", error);
      res.status(500).json({ error: "Failed to fetch content section" });
    }
  });

  app.post("/api/admin/content", async (req, res) => {
    try {
      const section = await storage.createContentSection(req.body);
      res.json(section);
    } catch (error) {
      console.error("Error creating content section:", error);
      res.status(500).json({ error: "Failed to create content section" });
    }
  });

  app.patch("/api/admin/content/:id", async (req, res) => {
    try {
      const section = await storage.updateContentSection(req.params.id, req.body);
      if (!section) return res.status(404).json({ error: "Content section not found" });
      res.json(section);
    } catch (error) {
      console.error("Error updating content section:", error);
      res.status(500).json({ error: "Failed to update content section" });
    }
  });

  app.delete("/api/admin/content/:id", async (req, res) => {
    try {
      const success = await storage.deleteContentSection(req.params.id);
      if (!success) return res.status(404).json({ error: "Content section not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting content section:", error);
      res.status(500).json({ error: "Failed to delete content section" });
    }
  });

  app.post("/api/admin/content/:id/publish", async (req, res) => {
    try {
      const section = await storage.publishContentSection(req.params.id);
      if (!section) return res.status(404).json({ error: "Content section not found" });
      res.json(section);
    } catch (error) {
      console.error("Error publishing content section:", error);
      res.status(500).json({ error: "Failed to publish content section" });
    }
  });

  app.get("/api/admin/content/:id/versions", async (req, res) => {
    try {
      const versions = await storage.getContentVersions(req.params.id);
      res.json(versions);
    } catch (error) {
      console.error("Error fetching content versions:", error);
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  });

  // Admin - News Management
  app.get("/api/admin/news", async (_req, res) => {
    try {
      const news = await storage.getAdminNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.get("/api/admin/news/:id", async (req, res) => {
    try {
      const news = await storage.getAdminNewsById(req.params.id);
      if (!news) return res.status(404).json({ error: "News item not found" });
      res.json(news);
    } catch (error) {
      console.error("Error fetching news item:", error);
      res.status(500).json({ error: "Failed to fetch news item" });
    }
  });

  app.post("/api/admin/news", async (req, res) => {
    try {
      const news = await storage.createAdminNews(req.body);
      res.json(news);
    } catch (error) {
      console.error("Error creating news:", error);
      res.status(500).json({ error: "Failed to create news" });
    }
  });

  app.patch("/api/admin/news/:id", async (req, res) => {
    try {
      const news = await storage.updateAdminNews(req.params.id, req.body);
      if (!news) return res.status(404).json({ error: "News item not found" });
      res.json(news);
    } catch (error) {
      console.error("Error updating news:", error);
      res.status(500).json({ error: "Failed to update news" });
    }
  });

  app.delete("/api/admin/news/:id", async (req, res) => {
    try {
      const success = await storage.deleteAdminNews(req.params.id);
      if (!success) return res.status(404).json({ error: "News item not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ error: "Failed to delete news" });
    }
  });

  app.post("/api/admin/news/:id/publish", async (req, res) => {
    try {
      const news = await storage.publishAdminNews(req.params.id);
      if (!news) return res.status(404).json({ error: "News item not found" });
      res.json(news);
    } catch (error) {
      console.error("Error publishing news:", error);
      res.status(500).json({ error: "Failed to publish news" });
    }
  });

  // Admin - User Management
  app.get("/api/admin/users", async (req, res) => {
    try {
      const filters = req.query;
      const users = await storage.getUsers(filters);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/stats", async (_req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user stats" });
    }
  });

  app.get("/api/admin/users/:id", async (req, res) => {
    try {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const success = await storage.deleteUser(req.params.id);
      if (!success) return res.status(404).json({ error: "User not found" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin - Game Scores & Leaderboard
  app.get("/api/admin/game-scores", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const scores = await storage.getGameScores(userId);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching game scores:", error);
      res.status(500).json({ error: "Failed to fetch game scores" });
    }
  });

  app.get("/api/admin/leaderboard", async (req, res) => {
    try {
      const gameType = req.query.gameType as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(gameType, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Admin - Audit Logs
  app.get("/api/admin/audit-logs", async (req, res) => {
    try {
      const filters = req.query;
      const logs = await storage.getAuditLogs(filters);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/admin/audit-logs", async (req, res) => {
    try {
      const log = await storage.createAuditLog(req.body);
      res.json(log);
    } catch (error) {
      console.error("Error creating audit log:", error);
      res.status(500).json({ error: "Failed to create audit log" });
    }
  });

  // Admin - Analytics Summary
  app.get("/api/admin/analytics", async (_req, res) => {
    try {
      const summary = await storage.getAnalyticsSummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin - Settings
  app.get("/api/admin/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", async (req, res) => {
    try {
      const updatedSettings = await storage.updateSettings(req.body);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
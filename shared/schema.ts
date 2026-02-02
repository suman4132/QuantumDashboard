import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey(),
  name: text("name"),
  backend: text("backend").notNull(),
  status: text("status").notNull(), // queued, running, done, failed, cancelled
  queuePosition: integer("queue_position"),
  submissionTime: timestamp("submission_time").notNull().default(sql`now()`),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  qubits: integer("qubits"),
  shots: integer("shots"),
  program: text("program"),
  results: jsonb("results"),
  error: text("error"),
  tags: jsonb("tags").$type<string[]>(),
  sessionId: varchar("session_id"),
  userId: varchar("user_id"),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // active, inactive, expired
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastActivity: timestamp("last_activity").notNull().default(sql`now()`),
  jobCount: integer("job_count").default(0),
});

export const backends = pgTable("backends", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // available, busy, maintenance, offline
  qubits: integer("qubits").notNull(),
  queueLength: integer("queue_length").default(0),
  averageWaitTime: integer("average_wait_time"), // in seconds
  uptime: text("uptime"),
  lastUpdate: timestamp("last_update").default(sql`now()`),
});

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull(), // active, paused, completed, archived
  privacy: text("privacy").notNull(), // public, private
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  lastActivity: timestamp("last_activity").default(sql`now()`),
  progress: integer("progress").default(0), // percentage 0-100
  settings: jsonb("settings"),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  role: text("role").notNull(), // owner, admin, member, viewer
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
  permissions: jsonb("permissions"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  workspaceId: varchar("workspace_id").notNull(),
  ownerId: varchar("owner_id").notNull(),
  status: text("status").notNull(), // draft, running, completed, failed, paused
  backend: text("backend"),
  circuitCode: text("circuit_code"),
  configuration: jsonb("configuration"),
  results: jsonb("results"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  lastModified: timestamp("last_modified").default(sql`now()`),
  runtime: integer("runtime"), // in minutes
  isPublic: boolean("is_public").default(false),
  tags: jsonb("tags").$type<string[]>(),
});

export const projectCollaborators = pgTable("project_collaborators", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  role: text("role").notNull(), // owner, editor, viewer
  addedAt: timestamp("added_at").notNull().default(sql`now()`),
  permissions: jsonb("permissions"),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  submissionTime: true,
  startTime: true,
  endTime: true,
  duration: true,
  results: true,
}).extend({
  name: z.string().optional(),
  qubits: z.number().min(1).max(1000),
  shots: z.number().min(1).max(100000),
  program: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
  jobCount: true,
});

export const insertBackendSchema = createInsertSchema(backends).omit({
  id: true,
  lastUpdate: true,
});

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivity: true,
}).extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  privacy: z.enum(["public", "private"]).default("private"),
  progress: z.number().min(0).max(100).default(0),
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).omit({
  id: true,
  joinedAt: true,
}).extend({
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastModified: true,
}).extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["draft", "running", "completed", "failed", "paused"]).default("draft"),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const insertProjectCollaboratorSchema = createInsertSchema(projectCollaborators).omit({
  id: true,
  addedAt: true,
}).extend({
  role: z.enum(["owner", "editor", "viewer"]).default("editor"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Backend = typeof backends.$inferSelect;
export type InsertBackend = z.infer<typeof insertBackendSchema>;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;
export type InsertProjectCollaborator = z.infer<typeof insertProjectCollaboratorSchema>;

// Advanced Feature Types
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type LiveCollaborationSession = typeof liveCollaborationSessions.$inferSelect;
export type InsertLiveCollaborationSession = z.infer<typeof insertLiveCollaborationSessionSchema>;
export type LiveEdit = typeof liveEdits.$inferSelect;
export type InsertLiveEdit = z.infer<typeof insertLiveEditSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;
export type CollaborationMetric = typeof collaborationMetrics.$inferSelect;
export type InsertCollaborationMetric = z.infer<typeof insertCollaborationMetricSchema>;
export type QuantumInsight = typeof quantumInsights.$inferSelect;
export type InsertQuantumInsight = z.infer<typeof insertQuantumInsightSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type KnowledgeArticle = typeof knowledgeArticles.$inferSelect;
export type InsertKnowledgeArticle = z.infer<typeof insertKnowledgeArticleSchema>;
export type Experiment = typeof experiments.$inferSelect;
export type InsertExperiment = z.infer<typeof insertExperimentSchema>;
export type HardwareReservation = typeof hardwareReservations.$inferSelect;
export type InsertHardwareReservation = z.infer<typeof insertHardwareReservationSchema>;
export type HardwareOptimization = typeof hardwareOptimizations.$inferSelect;
export type InsertHardwareOptimization = z.infer<typeof insertHardwareOptimizationSchema>;
export type CommunityEvent = typeof communityEvents.$inferSelect;
export type InsertCommunityEvent = z.infer<typeof insertCommunityEventSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type ResearchPaper = typeof researchPapers.$inferSelect;
export type InsertResearchPaper = z.infer<typeof insertResearchPaperSchema>;
export type ChatChannel = typeof chatChannels.$inferSelect;
export type InsertChatChannel = z.infer<typeof insertChatChannelSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type MentorshipPair = typeof mentorshipPairs.$inferSelect;
export type InsertMentorshipPair = z.infer<typeof insertMentorshipPairSchema>;


export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";
export type SessionStatus = "active" | "inactive" | "expired";
export type BackendStatus = "available" | "busy" | "maintenance" | "offline";
export type WorkspaceStatus = "active" | "paused" | "completed" | "archived";
export type WorkspacePrivacy = "public" | "private";
export type WorkspaceMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectStatus = "draft" | "running" | "completed" | "failed" | "paused";
export type ProjectCollaboratorRole = "owner" | "editor" | "viewer";

// Advanced Teamwork Features Schema Extensions

// AI Collaboration Intelligence
export const aiRecommendations = pgTable("ai_recommendations", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  workspaceId: varchar("workspace_id"),
  type: text("type").notNull(), // team_match, project_suggestion, optimization, resource_allocation
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  data: jsonb("data"), // recommendation-specific data
  status: text("status").notNull().default("pending"), // pending, applied, dismissed
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at"),
});

// Real-time Collaboration
export const liveCollaborationSessions = pgTable("live_collaboration_sessions", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  type: text("type").notNull(), // circuit_edit, whiteboard, voice_chat, screen_share
  hostUserId: varchar("host_user_id").notNull(),
  participants: jsonb("participants").$type<string[]>(),
  data: jsonb("data"), // session-specific data
  status: text("status").notNull().default("active"), // active, paused, ended
  startedAt: timestamp("started_at").notNull().default(sql`now()`),
  endedAt: timestamp("ended_at"),
});

export const liveEdits = pgTable("live_edits", {
  id: varchar("id").primaryKey(),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").notNull(),
  operation: text("operation").notNull(), // insert, delete, update, move
  position: integer("position"),
  content: text("content"),
  timestamp: timestamp("timestamp").notNull().default(sql`now()`),
});

// Gamification System
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // collaboration, optimization, innovation, mentoring
  points: integer("points").notNull(),
  rarity: text("rarity").notNull(), // common, uncommon, rare, epic, legendary
  requirements: jsonb("requirements"), // achievement requirements
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  achievementId: varchar("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`),
  data: jsonb("data"), // achievement-specific data
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // individual, team, global
  category: text("category").notNull(), // algorithm, optimization, collaboration
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, expert
  requirements: jsonb("requirements"),
  rewards: jsonb("rewards"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull().default("active"), // active, completed, expired
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: varchar("id").primaryKey(),
  challengeId: varchar("challenge_id").notNull(),
  userId: varchar("user_id"),
  workspaceId: varchar("workspace_id"),
  progress: integer("progress").default(0), // 0-100
  score: integer("score").default(0),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, failed
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
  data: jsonb("data"),
});

// Advanced Analytics
export const collaborationMetrics = pgTable("collaboration_metrics", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id"),
  metricType: text("metric_type").notNull(), // communication, productivity, innovation, leadership
  value: integer("value").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly
  date: timestamp("date").notNull(),
  data: jsonb("data"),
});

export const quantumInsights = pgTable("quantum_insights", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  projectId: varchar("project_id"),
  insightType: text("insight_type").notNull(), // performance, optimization, error_pattern, breakthrough
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // info, warning, critical, breakthrough
  actionRequired: boolean("action_required").default(false),
  data: jsonb("data"),
  generatedAt: timestamp("generated_at").notNull().default(sql`now()`),
  acknowledgedBy: jsonb("acknowledged_by").$type<string[]>(),
});

// Smart Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // ai_suggestion, collaboration_invite, achievement, insight, hardware_ready
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  category: text("category").notNull(),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  channels: jsonb("channels").$type<string[]>().notNull().default(['web']),
  scheduledFor: timestamp("scheduled_for"),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  readAt: timestamp("read_at"),
  expiresAt: timestamp("expires_at"),
});

// Knowledge Sharing
export const knowledgeArticles = pgTable("knowledge_articles", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  authorId: varchar("author_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  tags: jsonb("tags").$type<string[]>(),
  category: text("category").notNull(), // tutorial, research, best_practices, troubleshooting
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  status: text("status").notNull().default("draft"), // draft, published, archived
  version: integer("version").default(1),
  collaborators: jsonb("collaborators").$type<string[]>(),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  publishedAt: timestamp("published_at"),
});

export const experiments = pgTable("experiments", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  leaderId: varchar("leader_id").notNull(),
  name: text("name").notNull(),
  hypothesis: text("hypothesis").notNull(),
  methodology: text("methodology"),
  expectedOutcome: text("expected_outcome"),
  actualOutcome: text("actual_outcome"),
  status: text("status").notNull().default("planning"), // planning, active, analyzing, completed, failed
  progress: integer("progress").default(0), // 0-100
  teamMembers: jsonb("team_members").$type<string[]>(),
  data: jsonb("data"), // experiment-specific data
  results: jsonb("results"),
  insights: jsonb("insights"),
  nextSteps: text("next_steps"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

// Advanced Hardware Management
export const hardwareReservations = pgTable("hardware_reservations", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  workspaceId: varchar("workspace_id").notNull(),
  backendId: varchar("backend_id").notNull(),
  purpose: text("purpose").notNull(),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  estimatedDuration: integer("estimated_duration").notNull(), // minutes
  actualDuration: integer("actual_duration"),
  status: text("status").notNull().default("pending"), // pending, confirmed, active, completed, cancelled, failed
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  autoBackup: boolean("auto_backup").default(true),
  backupBackends: jsonb("backup_backends").$type<string[]>(),
  requirements: jsonb("requirements"),
  results: jsonb("results"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const hardwareOptimizations = pgTable("hardware_optimizations", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  backendId: varchar("backend_id").notNull(),
  optimizationType: text("optimization_type").notNull(), // cost, performance, reliability, efficiency
  description: text("description").notNull(),
  parameters: jsonb("parameters"),
  expectedImprovement: integer("expected_improvement"), // percentage
  actualImprovement: integer("actual_improvement"),
  status: text("status").notNull().default("suggested"), // suggested, testing, implemented, rejected
  implementedAt: timestamp("implemented_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Community Features
export const communityEvents = pgTable("community_events", {
  id: varchar("id").primaryKey(),
  organizerId: varchar("organizer_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // workshop, hackathon, conference, meetup, collaboration
  category: text("category").notNull(), // learning, research, networking, competition
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  isPublic: boolean("is_public").default(true),
  skillLevel: text("skill_level").notNull(), // beginner, intermediate, advanced, all
  prerequisites: jsonb("prerequisites"),
  agenda: jsonb("agenda"),
  resources: jsonb("resources"),
  location: text("location"), // virtual, physical address, or hybrid
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationDeadline: timestamp("registration_deadline"),
  status: text("status").notNull().default("upcoming"), // upcoming, active, completed, cancelled
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const eventParticipants = pgTable("event_participants", {
  id: varchar("id").primaryKey(),
  eventId: varchar("event_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull().default("participant"), // participant, speaker, mentor, organizer
  status: text("status").notNull().default("registered"), // registered, attended, no_show, cancelled
  registeredAt: timestamp("registered_at").notNull().default(sql`now()`),
  checkedInAt: timestamp("checked_in_at"),
  feedback: jsonb("feedback"),
});

export const researchPapers = pgTable("research_papers", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  leadAuthorId: varchar("lead_author_id").notNull(),
  title: text("title").notNull(),
  abstract: text("abstract").notNull(),
  content: text("content").notNull(),
  coAuthors: jsonb("co_authors").$type<string[]>(),
  keywords: jsonb("keywords").$type<string[]>(),
  references: jsonb("references"),
  figures: jsonb("figures"),
  status: text("status").notNull().default("draft"), // draft, review, revision, published, rejected
  venue: text("venue"), // conference, journal, preprint
  submissionDate: timestamp("submission_date"),
  reviewStatus: text("review_status"), // pending, in_review, accepted, rejected, revision_requested
  reviewFeedback: jsonb("review_feedback"),
  citations: integer("citations").default(0),
  downloads: integer("downloads").default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  publishedAt: timestamp("published_at"),
});

// Chat and Communication
export const chatChannels = pgTable("chat_channels", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("general"), // general, research, hardware, random, ai_assistant
  isPrivate: boolean("is_private").default(false),
  members: jsonb("members").$type<string[]>(),
  moderators: jsonb("moderators").$type<string[]>(),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  createdBy: varchar("created_by").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey(),
  channelId: varchar("channel_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("text"), // text, code, file, system, ai_response
  replyToId: varchar("reply_to_id"),
  attachments: jsonb("attachments"),
  reactions: jsonb("reactions"),
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  sentAt: timestamp("sent_at").notNull().default(sql`now()`),
  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),
});

// User Profiles and Skills
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  title: text("title"), // Quantum Researcher, PhD Student, etc.
  organization: text("organization"),
  location: text("location"),
  website: text("website"),
  skills: jsonb("skills").$type<string[]>(),
  interests: jsonb("interests").$type<string[]>(),
  experience: text("experience"), // beginner, intermediate, advanced, expert
  isPublic: boolean("is_public").default(true),
  isMentor: boolean("is_mentor").default(false),
  mentorshipAreas: jsonb("mentorship_areas").$type<string[]>(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0), // consecutive days active
  lastActiveAt: timestamp("last_active_at").default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Mentorship System
export const mentorshipPairs = pgTable("mentorship_pairs", {
  id: varchar("id").primaryKey(),
  mentorId: varchar("mentor_id").notNull(),
  menteeId: varchar("mentee_id").notNull(),
  focus: text("focus").notNull(), // quantum_algorithms, hardware, research_methods, etc.
  status: text("status").notNull().default("pending"), // pending, active, completed, cancelled
  duration: integer("duration"), // months
  goals: jsonb("goals"),
  progress: jsonb("progress"),
  feedback: jsonb("feedback"),
  startedAt: timestamp("started_at").default(sql`now()`),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas for advanced teamwork features
export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertLiveCollaborationSessionSchema = createInsertSchema(liveCollaborationSessions).omit({
  id: true,
  startedAt: true,
});

export const insertLiveEditSchema = createInsertSchema(liveEdits).omit({
  id: true,
  timestamp: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
});

export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertCollaborationMetricSchema = createInsertSchema(collaborationMetrics).omit({
  id: true,
});

export const insertQuantumInsightSchema = createInsertSchema(quantumInsights).omit({
  id: true,
  generatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertKnowledgeArticleSchema = createInsertSchema(knowledgeArticles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExperimentSchema = createInsertSchema(experiments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHardwareReservationSchema = createInsertSchema(hardwareReservations).omit({
  id: true,
  createdAt: true,
});

export const insertHardwareOptimizationSchema = createInsertSchema(hardwareOptimizations).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityEventSchema = createInsertSchema(communityEvents).omit({
  id: true,
  createdAt: true,
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  id: true,
  registeredAt: true,
});

export const insertResearchPaperSchema = createInsertSchema(researchPapers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatChannelSchema = createInsertSchema(chatChannels).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  sentAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMentorshipPairSchema = createInsertSchema(mentorshipPairs).omit({
  id: true,
  createdAt: true,
});

// ================== ADMIN DASHBOARD SCHEMA ==================

// Admin Users & Roles
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("content_admin"), // super_admin, content_admin, support
  status: text("status").notNull().default("active"), // active, inactive, suspended
  lastLogin: timestamp("last_login"),
  lastLoginIp: text("last_login_ip"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Pricing Plans Management
export const pricingPlans = pgTable("pricing_plans", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  monthlyPrice: integer("monthly_price").notNull(), // in cents
  yearlyPrice: integer("yearly_price").notNull(), // in cents
  features: jsonb("features").$type<string[]>().notNull(),
  limits: jsonb("limits").notNull(), // { jobs: 100, storage: '10GB', etc }
  trialDays: integer("trial_days").default(0),
  isActive: boolean("is_active").default(true),
  isPopular: boolean("is_popular").default(false),
  status: text("status").notNull().default("draft"), // draft, published, archived
  abTestEnabled: boolean("ab_test_enabled").default(false),
  abTestPercentage: integer("ab_test_percentage"), // 0-100
  abTestStartDate: timestamp("ab_test_start_date"),
  abTestEndDate: timestamp("ab_test_end_date"),
  version: integer("version").default(1),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  createdBy: varchar("created_by").notNull(),
  updatedBy: varchar("updated_by"),
});

// Pricing Plan Version History
export const pricingPlanVersions = pgTable("pricing_plan_versions", {
  id: varchar("id").primaryKey(),
  planId: varchar("plan_id").notNull(),
  versionNumber: integer("version_number").notNull(),
  changes: jsonb("changes").notNull(), // snapshot of full plan data
  changesSummary: text("changes_summary"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Landing Page & Docs Content
export const contentSections = pgTable("content_sections", {
  id: varchar("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(), // hero, features, faq, docs_page, footer
  title: text("title").notNull(),
  content: text("content").notNull(), // HTML/Markdown content
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  status: text("status").notNull().default("draft"), // draft, review, published
  metadata: jsonb("metadata"), // SEO title, meta desc, images, etc
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  publishedAt: timestamp("published_at"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  createdBy: varchar("created_by").notNull(),
  updatedBy: varchar("updated_by"),
});

// Content Version History
export const contentVersions = pgTable("content_versions", {
  id: varchar("id").primaryKey(),
  sectionId: varchar("section_id").notNull(),
  versionNumber: integer("version_number").notNull(),
  changes: jsonb("changes").notNull(),
  changesSummary: text("changes_summary"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Admin News/Announcements
export const adminNews = pgTable("admin_news", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  tags: jsonb("tags").$type<string[]>(),
  visibility: text("visibility").notNull().default("all"), // all, premium, standard
  isPinned: boolean("is_pinned").default(false),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, archived
  expiresAt: timestamp("expires_at"),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  createdBy: varchar("created_by").notNull(),
});

// Enhanced User Management (extends userProfiles)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  plan: text("plan").notNull().default("standard"), // standard, premium, enterprise
  status: text("status").notNull().default("active"), // active, suspended, churned
  paymentStatus: text("payment_status").default("current"), // current, past_due, failed
  renewalDate: timestamp("renewal_date"),
  signupDate: timestamp("signup_date").notNull().default(sql`now()`),
  lastLogin: timestamp("last_login"),
  lastLoginIp: text("last_login_ip"),
  jobsSubmitted: integer("jobs_submitted").default(0),
  internalNotes: text("internal_notes"),
  internalTags: jsonb("internal_tags").$type<string[]>(),
});

// Game Score History (for analytics)
export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  score: integer("score").notNull(),
  level: integer("level").notNull(),
  gameType: text("game_type").notNull(), // quantum_quest, circuit_challenge, etc
  metadata: jsonb("metadata"),
  achievedAt: timestamp("achieved_at").notNull().default(sql`now()`),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey(),
  adminUserId: varchar("admin_user_id").notNull(),
  adminName: text("admin_name").notNull(),
  action: text("action").notNull(), // create, update, delete, publish, etc
  entityType: text("entity_type").notNull(), // pricing_plan, content, user, news
  entityId: varchar("entity_id").notNull(),
  changes: jsonb("changes"), // before/after state
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Media Library
export const mediaAssets = pgTable("media_assets", {
  id: varchar("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  type: text("type").notNull(), // image, icon, video
  size: integer("size"), // in bytes
  usedIn: jsonb("used_in").$type<string[]>(), // array of content section IDs
  uploadedBy: varchar("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().default(sql`now()`),
});

// Admin Insert Schemas
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertPricingPlanSchema = createInsertSchema(pricingPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}).extend({
  name: z.string().min(1).max(100),
  monthlyPrice: z.number().min(0),
  yearlyPrice: z.number().min(0),
  features: z.array(z.string()).min(1),
});

export const insertPricingPlanVersionSchema = createInsertSchema(pricingPlanVersions).omit({
  id: true,
  createdAt: true,
});

export const insertContentSectionSchema = createInsertSchema(contentSections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}).extend({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  type: z.enum(["hero", "features", "faq", "docs_page", "footer"]),
});

export const insertContentVersionSchema = createInsertSchema(contentVersions).omit({
  id: true,
  createdAt: true,
});

export const insertAdminNewsSchema = createInsertSchema(adminNews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
}).extend({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  visibility: z.enum(["all", "premium", "standard"]).default("all"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  signupDate: true,
}).extend({
  email: z.string().email(),
  name: z.string().min(1),
  plan: z.enum(["standard", "premium", "enterprise"]).default("standard"),
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  achievedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssets).omit({
  id: true,
  uploadedAt: true,
});

// Admin Types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type PricingPlan = typeof pricingPlans.$inferSelect;
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type PricingPlanVersion = typeof pricingPlanVersions.$inferSelect;
export type InsertPricingPlanVersion = z.infer<typeof insertPricingPlanVersionSchema>;
export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type ContentVersion = typeof contentVersions.$inferSelect;
export type InsertContentVersion = z.infer<typeof insertContentVersionSchema>;
export type AdminNews = typeof adminNews.$inferSelect;
export type InsertAdminNews = z.infer<typeof insertAdminNewsSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Share2,
  Globe,
  Lock,
  Calendar,
  Clock,
  GitBranch,
  Activity,
  Settings,
  UserPlus,
  MessageSquare,
  FileText,
  Code2,
  Zap,
  BarChart3,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Eye,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Atom,
  BrainCircuit,
  Network,
  Cpu,
  Timer,
  Target,
  Sparkles,
  Layers,
  BookOpen,
  FlaskConical,
  ChevronRight,
  Send,
  Paperclip,
  Video,
  Phone,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Brain,
  Lightbulb,
  Gamepad2,
  Crown,
  Rocket,
  Bell,
  CheckSquare,
  AlertTriangle,
  Mic,
  MicOff,
  ScreenShare,
  Palette,
  Users2,
  Globe2,
  Compass,
  Flame,
  Radar,
  Crosshair,
  Waves,
  Infinity,
  Fingerprint,
  Camera,
  CameraOff,
  Monitor,
  PenTool,
  Eraser,
  Circle,
  Square,
  Type,
  MousePointer,
  Undo,
  Redo,
  Save,
  X,
  Volume2,
  VolumeX,
  Settings2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Hash,
  MapPin,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Map,
  Route,
  Zap as Lightning,
  Hexagon,
  Shield,
  Puzzle,
  StopCircle,
  Heart,
  TestTube,
  Mouse,
  Highlighter,
  Paintbrush,
  ArrowUpRight,
  Minus,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Maximize,
  EyeOff,
  Unlock,
  RefreshCw,
  CircuitBoard,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/dashboard/header";
import { formatDistanceToNow } from "date-fns";

import { useWorkspaces, useCreateWorkspace, useWorkspaceProjects, useBackends, useAddWorkspaceMember } from "@/hooks/use-teamwork";
import { ResearchChat } from "@/components/teamwork/ResearchChat";
import { ActiveChallenges } from "@/components/teamwork/ActiveChallenges";
import { ActiveChallengesModal } from "@/components/teamwork/ActiveChallengesModal";
import { useCollaboration } from "@/hooks/use-collaboration";
const mockQuantumFeaturesDefault = {
    liveCircuits: 0,
    activeCollaborators: 0,
    quantumJobs: 0,
    hardwareReserved: null,
    nextReservation: null,
    experimentsSaved: 0,
    hypothesesTesting: 0,
};
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    return privacy === "private" ? (
      <Lock className="h-3 w-3 text-gray-500" />
    ) : (
      <Globe className="h-3 w-3 text-gray-500" />
    );
  };
export default function Teamwork() {
  // Data Fetching Hooks
  const { data: rawWorkspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { mutateAsync: createWorkspaceAsync } = useCreateWorkspace();
  const { mutateAsync: addMemberAsync } = useAddWorkspaceMember();
  const { data: backends } = useBackends();

  // Mock current user for collaboration
  const [currentUser] = useState({
    id: "user_" + Math.random().toString(36).substr(2, 9),
    name: "Current User", // In real app, get from auth context
  });

  const { isConnected, participants, chatMessages: liveChatMessages, sendChatMessage } = useCollaboration({
    userId: currentUser.id,
    userName: currentUser.name,
    sessionId: "demo-session-1", // In real app, this comes from selected workspace/project
    projectId: "demo-project-1",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("workspaces");
  const [showQuantumChat, setShowQuantumChat] = useState(false);
  const [showHardwareScheduler, setShowHardwareScheduler] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentAchievements, setCurrentAchievements] = useState(3);
  const [challengesInProgress, setChallengesInProgress] = useState(2);
  const [aiRecommendations, setAiRecommendations] = useState(5);
  const [liveCollaborators, setLiveCollaborators] = useState(7);

  // New modal states for comprehensive features
  const [showResearchChat, setShowResearchChat] = useState(false);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showScreenShare, setShowScreenShare] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const [showTeamAnalytics, setShowTeamAnalytics] = useState(false);
  const [showAICodeReview, setShowAICodeReview] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showActiveChallenges, setShowActiveChallenges] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLearningPath, setShowLearningPath] = useState(false);

  // Quantum Hardware & Resources modal states
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [showResourceOptimizer, setShowResourceOptimizer] = useState(false);
  const [showLiveCircuitEditor, setShowLiveCircuitEditor] = useState(false);
  const [showExperimentTracker, setShowExperimentTracker] = useState(false);

  // Feature states
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [whiteboardTool, setWhiteboardTool] = useState("pen");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentChatMessage, setCurrentChatMessage] = useState("");

  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [newWorkspacePrivate, setNewWorkspacePrivate] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteMemberEmail, setInviteMemberEmail] = useState("");
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [selectedWorkspaceForInvite, setSelectedWorkspaceForInvite] = useState<string | null>(null);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName) return;
    
    try {
        const newWorkspace = await createWorkspaceAsync({
            name: newWorkspaceName,
            description: newWorkspaceDesc,
            privacy: newWorkspacePrivate ? "private" : "public",
            status: "active",
            progress: 0,
            ownerId: "user_1" // Mock current user
        });

        // Process Invitations
        if (inviteEmails) {
            const emails = inviteEmails.split(',').map(e => e.trim()).filter(e => e);
            for (const email of emails) {
                 // In production, we would lookup real users via API.
                 // Here we simulate finding/creating a user for the invite.
                 await addMemberAsync({
                     workspaceId: newWorkspace.id,
                     data: {
                         userId: `user_${Math.random().toString(36).substr(2, 6)}`,
                         userName: email.split('@')[0], 
                         userEmail: email,
                         role: "member"
                     }
                 });
            }
        }

        setIsCreateWorkspaceOpen(false);
        setNewWorkspaceName("");
        setNewWorkspaceDesc("");
        setInviteEmails("");
    } catch (error) {
        console.error("Failed to create workspace:", error);
    }
  };

  const handleInviteMember = async () => {
    if (!selectedWorkspaceForInvite || !inviteMemberEmail) return;
    
    try {
        await addMemberAsync({
            workspaceId: selectedWorkspaceForInvite,
            data: {
                userId: `user_${Math.random().toString(36).substr(2, 6)}`,
                userName: inviteMemberEmail.split('@')[0], 
                userEmail: inviteMemberEmail,
                role: "member"
            }
        });
        
        setIsInviteMemberOpen(false);
        setInviteMemberEmail("");
        setSelectedWorkspaceForInvite(null);
    } catch (error) {
        console.error("Failed to invite member:", error);
    }
  };

  
  // Data Adapters (Facade for UI compatibility)
  const workspaces = rawWorkspaces?.map(ws => ({
      ...ws,
      members: (ws as any).members && (ws as any).members.length > 0 ? (ws as any).members : [], 
      circuits: 12,
      jobs: 45,
      quantumFeatures: (ws.settings as any)?.quantumFeatures || mockQuantumFeaturesDefault,
      recentActivity: [
        {
            user: "Alice Chen",
            action: "edited Variational Circuit #4",
            time: "2 min ago",
            type: "circuit",
        },
        {
            user: "Bob Wilson",
            action: "shared VQE experiment results",
            time: "15 min ago",
            type: "results",
        }
      ]
  })) || [];

  const { data: rawProjects } = useWorkspaceProjects(selectedWorkspace);
  
  const workspaceProjects = rawProjects?.map(p => ({
      ...p,
      workspace: workspaces.find(w => w.id === p.workspaceId)?.name || 'Unknown',
      collaborators: 3,
      quantumDetails: {
          circuitDepth: 8,
          qubits: 6,
          gates: 89,
          fidelity: 0.87,
          shots: 4096,
          liveEditors: [],
          comments: 12,
          versions: 8,
          experiments: 5,
          sharedResults: 5,
      }
  })) || [];

  const mockBackends = backends || [];

  // Filter workspaces based on search and filters
  const filteredWorkspaces = workspaces.filter((workspace) => {
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workspace.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || workspace.status === statusFilter;
    const matchesPrivacy =
      privacyFilter === "all" || workspace.privacy === privacyFilter;

    return matchesSearch && matchesStatus && matchesPrivacy;
  });

  const mockHardwareSchedule = [
    {
        id: "hw-1",
        backend: "ibm_cairo",
        user: "Alice Chen",
        workspace: "Quantum ML Research",
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 120, // minutes
        purpose: "VQE Parameter Optimization",
        status: "confirmed",
    },
    {
        id: "hw-2",
        backend: "ibm_brisbane",
        user: "John Doe",
        workspace: "Optimization Algorithms",
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
        duration: 90,
        purpose: "QAOA Circuit Testing",
        status: "pending",
    },
  ];

  const mockQuantumChat = [
    {
        id: "msg-1",
        user: "Alice Chen",
        message:
        "Just optimized the VQE circuit depth to 12 layers. The new ansatz shows 8% improvement in convergence!",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        type: "algorithm",
        attachments: [{ type: "circuit", name: "optimized_vqe_v2.qasm" }],
    },
    {
        id: "msg-2",
        user: "Bob Wilson",
        message:
        "Great work! I'm seeing similar improvements in my simulation. Should we test this on real hardware?",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
        type: "discussion",
        replyTo: "msg-1",
    },
  ];

  const mockExperiments = [
    {
        id: "exp-1",
        title: "VQE Ground State Convergence Analysis",
        description: "Testing convergence rates with different ansatz depths",
        owner: "Alice Chen",
        workspace: "Quantum ML Research",
        status: "running",
        progress: 75,
        jobsCompleted: 45,
        totalJobs: 60,
        currentBackend: "ibm_cairo",
        tags: ["VQE", "optimization", "ground-state"],
    },
    {
        id: "exp-2", 
        title: "QAOA Performance Comparison",
        description: "Comparing performance across different quantum backends",
        owner: "John Doe",
        workspace: "Optimization Algorithms", 
        status: "paused",
        progress: 40,
        jobsCompleted: 24,
        totalJobs: 60,
        currentBackend: null,
        tags: ["QAOA", "benchmarking", "hardware"],
    }
  ];

  const mockLiveCircuits = [
  {
    id: "circuit-1",
    name: "Variational Quantum Eigensolver",
    owner: "Alice Chen",
    collaborators: [
      { name: "Bob Wilson", status: "editing" },
      { name: "Dr. Sarah Kim", status: "viewing" },
    ],
    qubits: 8,
    gates: 156,
    depth: 12,
    status: "editing",
    backend: "ibm_cairo",
  },
];


  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    // Handle refresh interval
  };

  const handleManualRefresh = () => {
    // Handle manual refresh
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    return privacy === "private" ? (
      <Lock className="h-3 w-3" />
    ) : (
      <Globe className="h-3 w-3" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        onManualRefresh={handleManualRefresh}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                Team Collaboration
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Work together on quantum computing projects with real-time
                collaboration
              </p>
            </div>
            <Dialog
              open={isCreateWorkspaceOpen}
              onOpenChange={setIsCreateWorkspaceOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  data-testid="button-create-workspace"
                >
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>
                    Set up a collaborative workspace for your quantum computing
                    project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      placeholder="Enter workspace name..."
                      data-testid="input-workspace-name"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-desc">Description</Label>
                    <Textarea
                      id="workspace-desc"
                      placeholder="Describe your project goals and scope..."
                      data-testid="textarea-workspace-description"
                      value={newWorkspaceDesc}
                      onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workspace-private">Private Workspace</Label>
                    <Switch
                      id="workspace-private"
                      data-testid="switch-workspace-private"
                      checked={newWorkspacePrivate}
                      onCheckedChange={setNewWorkspacePrivate}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-invites">Invite Team Members</Label>
                    <Textarea
                      id="workspace-invites"
                      placeholder="Enter email addresses separated by commas (e.g. alice@example.com, bob@example.com)"
                      value={inviteEmails}
                      onChange={(e) => setInviteEmails(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateWorkspaceOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateWorkspace}
                    data-testid="button-create-workspace-confirm"
                  >
                    Create Workspace
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Invite Member Dialog */}
            <Dialog open={isInviteMemberOpen} onOpenChange={setIsInviteMemberOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite to Workspace</DialogTitle>
                  <DialogDescription>
                    Add a new member to this workspace. They will receive an email notification.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="invite-email">Email address</Label>
                    <Input
                      id="invite-email"
                      placeholder="colleague@example.com"
                      value={inviteMemberEmail}
                      onChange={(e) => setInviteMemberEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteMemberOpen(false)}>Cancel</Button>
                  <Button onClick={handleInviteMember}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search workspaces and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-workspaces"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-32"
                  data-testid="select-status-filter"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                <SelectTrigger
                  className="w-32"
                  data-testid="select-privacy-filter"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Privacy</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Advanced AI-Powered Collaboration Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Real-Time Collaboration Tools */}
            <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-2 w-full">
                <Users2 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Live Collaboration
                </span>
                <Badge variant="secondary" className="ml-auto">
                  {participants.length} active
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResearchChat(true)}
                className="flex items-center gap-2"
                data-testid="button-research-chat"
              >
                <MessageSquare className="h-4 w-4" />
                Research Chat
                {showQuantumChat && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
              <Button
                variant={isVoiceChatActive ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVoiceChat(true)}
                className="flex items-center gap-2"
                data-testid="button-voice-chat"
              >
                {isVoiceChatActive ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
                Voice Chat
              </Button>
              <Button
                variant={isScreenSharing ? "default" : "outline"}
                size="sm"
                onClick={() => setShowScreenShare(true)}
                className="flex items-center gap-2"
                data-testid="button-screen-share"
              >
                <ScreenShare className="h-4 w-4" />
                Share Screen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWhiteboard(true)}
                className="flex items-center gap-2"
                data-testid="button-whiteboard"
              >
                <Palette className="h-4 w-4" />
                Whiteboard
              </Button>
            </div>

            {/* AI-Powered Features */}
            <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-2 mb-2 w-full">
                <Brain className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  AI Intelligence
                </span>
                <Badge variant="secondary" className="ml-auto">
                  {aiRecommendations} insights
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSmartSuggestions(true)}
                className="flex items-center gap-2"
                data-testid="button-smart-suggestions"
              >
                <Lightbulb className="h-4 w-4" />
                Smart Suggestions
                {aiRecommendations > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-1 px-1 py-0 text-xs"
                  >
                    {aiRecommendations}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTeamAnalytics(true)}
                className="flex items-center gap-2"
                data-testid="button-team-analytics"
              >
                <BarChart3 className="h-4 w-4" />
                Team Analytics
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAICodeReview(true)}
                className="flex items-center gap-2"
                data-testid="button-ai-code-review"
              >
                <Radar className="h-4 w-4" />
                AI Code Review
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Gamification Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-2 mb-2 w-full">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Quantum Achievements & Challenges
              </span>
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">Level 7</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-gray-600">2,450 pts</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-2"
              data-testid="button-achievements"
            >
              <Medal className="h-4 w-4" />
              Achievements
              {currentAchievements > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                  {currentAchievements} new
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActiveChallenges(true)}
              className="flex items-center gap-2"
              data-testid="button-active-challenges"
            >
              <Target className="h-4 w-4" />
              Active Challenges
              <Badge variant="secondary" className="ml-1 px-2 py-1 text-xs">
                {challengesInProgress} in progress
              </Badge>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLeaderboard(true)}
              className="flex items-center gap-2"
              data-testid="button-team-leaderboard"
            >
              <TrendingUp className="h-4 w-4" />
              Team Leaderboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLearningPath(true)}
              className="flex items-center gap-2"
              data-testid="button-learning-path"
            >
              <Compass className="h-4 w-4" />
              Learning Path
            </Button>
          </div>
        </motion.div>

        {/* Hardware & Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-2 mb-2 w-full">
              <Cpu className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Quantum Hardware & Resources
              </span>
              <Badge variant="secondary" className="ml-auto">
                {mockHardwareSchedule.length} reservations
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSmartScheduler(true)}
              className="flex items-center gap-2"
              data-testid="button-hardware-scheduler"
            >
              <Calendar className="h-4 w-4" />
              Smart Scheduler
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResourceOptimizer(true)}
              className="flex items-center gap-2"
              data-testid="button-resource-optimizer"
            >
              <Zap className="h-4 w-4" />
              Resource Optimizer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLiveCircuitEditor(true)}
              className="flex items-center gap-2"
              data-testid="button-live-circuit"
            >
              <BrainCircuit className="h-4 w-4" />
              Live Circuit Editor
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-green-500 rounded-full border border-white" />
                <div className="w-4 h-4 bg-blue-500 rounded-full border border-white" />
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExperimentTracker(true)}
              className="flex items-center gap-2"
              data-testid="button-experiment-tracker"
            >
              <FlaskConical className="h-4 w-4" />
              Experiment Tracker
              <Badge variant="secondary" className="ml-1 px-2 py-1 text-xs">
                5 active
              </Badge>
            </Button>
          </div>
        </motion.div>

        {/* Smart Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex items-center gap-2 w-full p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-700"
              data-testid="button-notifications"
            >
              <Bell className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                Smart Notifications & Context Alerts
              </span>
              <Badge variant="destructive" className="ml-auto">
                3 new
              </Badge>
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        VQE Job Completed Successfully!
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Your optimization found ground state with 92% fidelity
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        AI Collaboration Suggestion
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Team member Alice has similar QAOA work - consider
                        collaborating
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <Trophy className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Achievement Unlocked: Circuit Optimizer!
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        You've optimized 10 quantum circuits - earned 150 points
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="workspaces" data-testid="tab-workspaces">
              Workspaces
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              Live Projects
            </TabsTrigger>
            <TabsTrigger value="ai-insights" data-testid="tab-ai-insights">
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="gamification" data-testid="tab-gamification">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="research" data-testid="tab-research">
              Research Hub
            </TabsTrigger>
          </TabsList>

          {/* Workspaces Tab */}
          <TabsContent value="workspaces" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedWorkspace(workspace.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {workspace.name}
                          </CardTitle>
                          <div className="flex items-center gap-1">
                            {getPrivacyIcon(workspace.privacy)}
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(workspace.status)} text-xs px-2 py-1`}
                            >
                              {workspace.status}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorkspaceForInvite(workspace.id);
                                setIsInviteMemberOpen(true);
                            }}>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {workspace.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium">
                            {workspace.progress}%
                          </span>
                        </div>
                        <Progress value={workspace.progress} className="h-2" />
                      </div>

                      {/* Enhanced Quantum Stats */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-blue-600">
                              {workspace.circuits}
                            </div>
                            <div className="text-xs text-gray-500">
                              Circuits
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-green-600">
                              {workspace.jobs}
                            </div>
                            <div className="text-xs text-gray-500">Jobs</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-purple-600">
                              {workspace.members.length}
                            </div>
                            <div className="text-xs text-gray-500">Members</div>
                          </div>
                        </div>

                        {/* Quantum-specific metrics */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <Atom className="h-3 w-3 text-blue-500" />
                              Live Circuits
                            </span>
                            <span className="font-semibold">
                              {workspace.quantumFeatures.liveCircuits}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-green-500" />
                              Active Now
                            </span>
                            <span className="font-semibold">
                              {workspace.quantumFeatures.activeCollaborators}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <FlaskConical className="h-3 w-3 text-purple-500" />
                              Experiments
                            </span>
                            <span className="font-semibold">
                              {workspace.quantumFeatures.experimentsSaved}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3 text-orange-500" />
                              Hardware
                            </span>
                            <span className="font-semibold text-xs">
                              {workspace.quantumFeatures.hardwareReserved ||
                                "None"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Team Members
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {workspace.members
                              .slice(0, 3)
                              .map((member: string, idx: number) => (
                                <Avatar
                                  key={idx}
                                  className="h-6 w-6 border-2 border-white dark:border-gray-800"
                                >
                                  <AvatarFallback className="text-xs">
                                    {(member || "U")
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            {workspace.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  +{workspace.members.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorkspaceForInvite(workspace.id);
                                setIsInviteMemberOpen(true);
                            }}
                          >
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Recent Quantum Activity */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Recent Activity
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {workspace.recentActivity
                            .slice(0, 3)
                            .map((activity, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-xs"
                              >
                                <div
                                  className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                                    activity.type === "circuit"
                                      ? "bg-blue-500"
                                      : activity.type === "results"
                                        ? "bg-green-500"
                                        : activity.type === "hardware"
                                          ? "bg-orange-500"
                                          : activity.type === "algorithm"
                                            ? "bg-purple-500"
                                            : "bg-gray-500"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-gray-900 dark:text-white truncate">
                                    <span className="font-medium">
                                      {activity.user}
                                    </span>{" "}
                                    {activity.action}
                                  </div>
                                  <div className="text-gray-500">
                                    {activity.time}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredWorkspaces.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No workspaces found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  privacyFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first collaborative workspace to get started"}
                </p>
                {!searchQuery &&
                  statusFilter === "all" &&
                  privacyFilter === "all" && (
                    <Button onClick={() => setIsCreateWorkspaceOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Workspace
                    </Button>
                  )}
              </motion.div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-500" />
                    Shared Quantum Projects
                  </CardTitle>
                  <CardDescription>
                    Real-time collaborative quantum computing projects across
                    all workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr className="text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Workspace
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Runtime
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Backend
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Collaborators
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {workspaceProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {project.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Modified{" "}
                                  {project.lastModified ? formatDistanceToNow(project.lastModified) : 'Unknown'}{" "}
                                  ago
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.workspace}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {project.status === "running" && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                )}
                                {project.status === "completed" && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                                {project.status === "draft" && (
                                  <Edit3 className="h-4 w-4 text-gray-400" />
                                )}
                                <Badge
                                  className={getStatusColor(project.status)}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.runtime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="text-xs">
                                {project.backend}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  {Array.from(
                                    {
                                      length: Math.min(
                                        project.collaborators,
                                        3,
                                      ),
                                    },
                                    (_, i) => (
                                      <Avatar
                                        key={i}
                                        className="h-6 w-6 border-2 border-white dark:border-gray-800"
                                      >
                                        <AvatarFallback className="text-xs">
                                          U{i + 1}
                                        </AvatarFallback>
                                      </Avatar>
                                    ),
                                  )}
                                </div>
                                <span className="text-sm text-gray-500">
                                  +{project.collaborators}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Open in Editor
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Quantum Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Hardware Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-500" />
                    Quantum Hardware Schedule
                  </CardTitle>
                  <CardDescription>
                    Real quantum computer reservations and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockHardwareSchedule.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {reservation.backend}
                          </Badge>
                          <Badge
                            variant={
                              reservation.status === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">
                          {reservation.purpose}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.user} • {reservation.duration}min •{" "}
                          {formatDistanceToNow(reservation.startTime)} from now
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    className="w-full"
                    variant="outline"
                    data-testid="button-reserve-hardware"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Reserve Hardware Time
                  </Button>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Resource Usage Analytics
                  </CardTitle>
                  <CardDescription>
                    Team quantum computing resource consumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Quantum Jobs</span>
                      <span className="text-sm text-gray-500">
                        47 this week
                      </span>
                    </div>
                    <Progress value={78} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Hardware Hours
                      </span>
                      <span className="text-sm text-gray-500">
                        12.5 / 20 hours
                      </span>
                    </div>
                    <Progress value={62} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Circuit Complexity
                      </span>
                      <span className="text-sm text-gray-500">
                        Avg 8.2 qubits
                      </span>
                    </div>
                    <Progress value={41} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        94.2%
                      </div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        2.1s
                      </div>
                      <div className="text-xs text-gray-500">Avg Runtime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quantum Backends Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-500" />
                  Available Quantum Backends
                </CardTitle>
                <CardDescription>
                  Real-time status of quantum computing hardware
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "ibm_cairo",
                      qubits: 27,
                      status: "online",
                      queue: 3,
                      fidelity: 0.95,
                    },
                    {
                      name: "ibm_brisbane",
                      qubits: 127,
                      status: "online",
                      queue: 8,
                      fidelity: 0.92,
                    },
                    {
                      name: "ibm_kyiv",
                      qubits: 127,
                      status: "maintenance",
                      queue: 0,
                      fidelity: 0.93,
                    },
                    {
                      name: "ibm_torino",
                      qubits: 133,
                      status: "online",
                      queue: 12,
                      fidelity: 0.91,
                    },
                    {
                      name: "ionq_harmony",
                      qubits: 56,
                      status: "online",
                      queue: 2,
                      fidelity: 0.97,
                    },
                    {
                      name: "rigetti_aspen",
                      qubits: 80,
                      status: "offline",
                      queue: 0,
                      fidelity: 0.89,
                    },
                  ].map((backend) => (
                    <div
                      key={backend.name}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{backend.name}</div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            backend.status === "online"
                              ? "bg-green-500"
                              : backend.status === "maintenance"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {backend.qubits} qubits • Queue: {backend.queue}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Fidelity: </span>
                        <span className="font-medium">
                          {(backend.fidelity * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* AI Team Matching */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users2 className="h-5 w-5 text-blue-500" />
                    Smart Team Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-powered team matching based on skills and project synergy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      type: "team_match",
                      title: "Perfect Collaboration Match",
                      description:
                        "Dr. Sarah Kim's quantum ML expertise complements your VQE optimization work perfectly",
                      confidence: 95,
                      action: "Invite to collaborate",
                    },
                    {
                      type: "mentorship",
                      title: "Mentorship Opportunity",
                      description:
                        "Bob Wilson could benefit from your QAOA experience - consider offering guidance",
                      confidence: 88,
                      action: "Offer mentorship",
                    },
                    {
                      type: "project_suggestion",
                      title: "Breakthrough Project Idea",
                      description:
                        "Hybrid VQE-QAOA approach could solve optimization problems 30% faster",
                      confidence: 92,
                      action: "Start project",
                    },
                  ].map((insight, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {insight.type === "team_match" && (
                              <Users className="h-4 w-4 text-blue-500" />
                            )}
                            {insight.type === "mentorship" && (
                              <Award className="h-4 w-4 text-purple-500" />
                            )}
                            {insight.type === "project_suggestion" && (
                              <Lightbulb className="h-4 w-4 text-yellow-500" />
                            )}
                            {insight.title}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {insight.description}
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {insight.confidence}% match
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        data-testid={`button-${insight.type}-action`}
                      >
                        {insight.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* AI Code Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-green-500" />
                    Intelligent Code Analysis
                  </CardTitle>
                  <CardDescription>
                    AI-powered quantum circuit optimization and review
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Optimization Found
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Your VQE circuit can be optimized by 23% by reducing gate
                      depth and using hardware-native gates
                    </div>
                    <Button
                      size="sm"
                      className="mt-2"
                      data-testid="button-apply-optimization"
                    >
                      Apply Optimization
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">
                        Collaboration Insight
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Similar algorithm patterns detected in Alice Chen's work -
                      potential for code sharing
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      data-testid="button-compare-code"
                    >
                      Compare & Collaborate
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        Innovation Opportunity
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Novel ansatz structure discovered - potential for research
                      publication
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      data-testid="button-research-path"
                    >
                      Explore Research Path
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Smart Resource Allocation
                  </CardTitle>
                  <CardDescription>
                    AI-optimized hardware scheduling and resource management
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">
                        32%
                      </div>
                      <div className="text-xs text-gray-500">Cost Savings</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">
                        18min
                      </div>
                      <div className="text-xs text-gray-500">
                        Avg Queue Time
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Recommended Schedule:
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      • Run VQE jobs on ibm_cairo between 2-4 PM (lowest queue)
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      • Use ibm_brisbane for QAOA testing (better connectivity)
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      • Batch similar experiments to optimize shot allocation
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    data-testid="button-apply-schedule"
                  >
                    Apply Smart Schedule
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Path Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-indigo-500" />
                    Personalized Learning Path
                  </CardTitle>
                  <CardDescription>
                    AI-curated learning journey based on your progress and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        step: 1,
                        title: "Advanced VQE Techniques",
                        status: "in-progress",
                        progress: 75,
                      },
                      {
                        step: 2,
                        title: "Quantum Error Mitigation",
                        status: "next",
                        progress: 0,
                      },
                      {
                        step: 3,
                        title: "Hybrid Algorithms",
                        status: "upcoming",
                        progress: 0,
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            item.status === "in-progress"
                              ? "bg-blue-100 text-blue-600"
                              : item.status === "next"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {item.title}
                          </div>
                          {item.progress > 0 && (
                            <Progress
                              value={item.progress}
                              className="h-1 mt-1"
                            />
                          )}
                        </div>
                        {item.status === "in-progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            data-testid={`button-continue-step-${item.step}`}
                          >
                            Continue
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Achievements Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Recent Achievements
                    </CardTitle>
                    <CardDescription>
                      Your quantum computing milestones and accomplishments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: "circuit_optimizer",
                        name: "Circuit Optimizer",
                        description:
                          "Optimized 10 quantum circuits for better performance",
                        icon: "⚡",
                        rarity: "rare",
                        points: 150,
                        unlockedAt: "2 hours ago",
                        progress: 100,
                      },
                      {
                        id: "collaboration_master",
                        name: "Collaboration Master",
                        description: "Successfully completed 5 team projects",
                        icon: "🤝",
                        rarity: "uncommon",
                        points: 200,
                        unlockedAt: "1 day ago",
                        progress: 100,
                      },
                      {
                        id: "vqe_expert",
                        name: "VQE Expert",
                        description:
                          "Master VQE algorithm implementation (8/10)",
                        icon: "🔬",
                        rarity: "epic",
                        points: 300,
                        unlockedAt: null,
                        progress: 80,
                      },
                    ].map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 border rounded-lg ${
                          achievement.progress === 100
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700"
                            : "bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {achievement.name}
                                <Badge
                                  variant={
                                    achievement.rarity === "legendary"
                                      ? "default"
                                      : achievement.rarity === "epic"
                                        ? "secondary"
                                        : achievement.rarity === "rare"
                                          ? "outline"
                                          : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-600">
                              +{achievement.points} pts
                            </div>
                            {achievement.unlockedAt && (
                              <div className="text-xs text-gray-500">
                                {achievement.unlockedAt}
                              </div>
                            )}
                          </div>
                        </div>
                        {achievement.progress < 100 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress
                              value={achievement.progress}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Challenges */}
                <ActiveChallenges />
              </div>

              {/* Sidebar - Stats & Leaderboard */}
              <div className="space-y-6">
                {/* Player Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-500" />
                      Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-purple-600">
                        Level 7
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Quantum Collaborator
                      </div>
                      <Progress value={72} className="h-2" />
                      <div className="text-xs text-gray-500">
                        2,450 / 3,000 XP to Level 8
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-lg font-semibold text-blue-600">
                          15
                        </div>
                        <div className="text-xs text-gray-500">
                          Achievements
                        </div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-semibold text-green-600">
                          8
                        </div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="text-lg font-semibold text-purple-600">
                          2
                        </div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-lg font-semibold text-orange-600">
                          92%
                        </div>
                        <div className="text-xs text-gray-500">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Leaderboard */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Team Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        rank: 1,
                        name: "Alice Chen",
                        points: 3250,
                        change: "+125",
                      },
                      {
                        rank: 2,
                        name: "You",
                        points: 2450,
                        change: "+89",
                        highlight: true,
                      },
                      {
                        rank: 3,
                        name: "Dr. Sarah Kim",
                        points: 2380,
                        change: "+67",
                      },
                      {
                        rank: 4,
                        name: "Bob Wilson",
                        points: 2156,
                        change: "+45",
                      },
                      {
                        rank: 5,
                        name: "John Doe",
                        points: 1890,
                        change: "+23",
                      },
                    ].map((player) => (
                      <div
                        key={player.rank}
                        className={`flex items-center gap-3 p-2 rounded ${
                          player.highlight
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.rank === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : player.rank === 2
                                ? "bg-gray-100 text-gray-700"
                                : player.rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-50 text-gray-600"
                          }`}
                        >
                          {player.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {player.points} pts
                          </div>
                        </div>
                        <div className="text-xs text-green-600">
                          {player.change}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="h-5 w-5 text-indigo-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      data-testid="button-daily-challenge"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Daily Challenge
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      data-testid="button-team-formation"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Form Team
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                      data-testid="button-skill-assessment"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      Skill Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {/* Collaboration Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Team Efficiency
                  </CardTitle>
                  <CardDescription>
                    Real-time collaboration performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        87%
                      </div>
                      <div className="text-xs text-gray-500">
                        Team Efficiency
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        94%
                      </div>
                      <div className="text-xs text-gray-500">Communication</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Project Completion</span>
                      <span className="text-sm font-medium">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Code Reviews</span>
                      <span className="text-sm font-medium">15/20</span>
                    </div>
                    <Progress value={75} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Knowledge Sharing</span>
                      <span className="text-sm font-medium">12/15</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Quantum Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-5 w-5 text-purple-500" />
                    Quantum Insights
                  </CardTitle>
                  <CardDescription>
                    Algorithm performance and optimization trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        92%
                      </div>
                      <div className="text-xs text-gray-500">Avg Fidelity</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        15s
                      </div>
                      <div className="text-xs text-gray-500">Avg Runtime</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      Most Used Algorithms:
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: "VQE", usage: 45, success: 94 },
                        { name: "QAOA", usage: 32, success: 87 },
                        { name: "Grover", usage: 15, success: 96 },
                        { name: "Shor", usage: 8, success: 89 },
                      ].map((algo) => (
                        <div
                          key={algo.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span>{algo.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{algo.usage}%</span>
                            <span className="text-green-600">
                              {algo.success}% ✓
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-orange-500" />
                    Hardware Analytics
                  </CardTitle>
                  <CardDescription>
                    Quantum backend usage and optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        67%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        $127
                      </div>
                      <div className="text-xs text-gray-500">Monthly Cost</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Backend Usage:</div>
                    <div className="space-y-1">
                      {[
                        { backend: "ibm_cairo", jobs: 23, efficiency: 89 },
                        { backend: "ibm_brisbane", jobs: 18, efficiency: 76 },
                        { backend: "simulator", jobs: 45, efficiency: 98 },
                      ].map((hw) => (
                        <div
                          key={hw.backend}
                          className="flex items-center justify-between text-xs"
                        >
                          <span>{hw.backend}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">
                              {hw.jobs} jobs
                            </span>
                            <span
                              className={`${hw.efficiency > 85 ? "text-green-600" : "text-orange-600"}`}
                            >
                              {hw.efficiency}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaboration Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Collaboration Trends
                  </CardTitle>
                  <CardDescription>
                    Team interaction and growth patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        metric: "Live Sessions",
                        value: "+23%",
                        trend: "up",
                        description: "vs last week",
                      },
                      {
                        metric: "Code Reviews",
                        value: "+15%",
                        trend: "up",
                        description: "vs last week",
                      },
                      {
                        metric: "Knowledge Sharing",
                        value: "+8%",
                        trend: "up",
                        description: "vs last week",
                      },
                      {
                        metric: "Response Time",
                        value: "-12%",
                        trend: "down",
                        description: "faster responses",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {item.metric}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-bold ${
                            (item.trend === "up" &&
                              !item.metric.includes("Time")) ||
                            (item.trend === "down" &&
                              item.metric.includes("Time"))
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Predictive Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-indigo-500" />
                    Predictive Insights
                  </CardTitle>
                  <CardDescription>
                    AI-powered project and team predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                      <div className="text-sm font-medium text-green-700 dark:text-green-300">
                        Project Success
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        94%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        High probability of completing current VQE project by
                        deadline
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Team Growth
                      </div>
                      <div className="text-2xl font-bold text-blue-600">+2</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Optimal team size increase predicted for next month
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Innovation Score
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        8.7/10
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        High potential for breakthrough discoveries
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-yellow-500" />
                    Action Items
                  </CardTitle>
                  <CardDescription>
                    AI-recommended improvements and optimizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      priority: "high",
                      title: "Schedule Team Sync",
                      description:
                        "Collaboration efficiency can improve with weekly standup",
                      action: "Schedule Meeting",
                    },
                    {
                      priority: "medium",
                      title: "Optimize Hardware Usage",
                      description:
                        "Switch to ibm_cairo for better cost efficiency",
                      action: "Update Schedule",
                    },
                    {
                      priority: "low",
                      title: "Documentation Update",
                      description:
                        "VQE implementation needs better documentation",
                      action: "Add Docs",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                item.priority === "high"
                                  ? "bg-red-500"
                                  : item.priority === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            />
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        data-testid={`button-action-${idx}`}
                      >
                        {item.action}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Research Hub Tab */}
          <TabsContent value="research" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Knowledge Base */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Collaborative Knowledge Base
                    </CardTitle>
                    <CardDescription>
                      Shared quantum research documentation and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "VQE Optimization Strategies",
                        author: "Dr. Sarah Kim",
                        updated: "2 hours ago",
                        tags: ["VQE", "Optimization", "NISQ"],
                        contributors: 3,
                      },
                      {
                        title: "QAOA Parameter Landscape Analysis",
                        author: "John Doe",
                        updated: "1 day ago",
                        tags: ["QAOA", "Parameters", "Analysis"],
                        contributors: 2,
                      },
                      {
                        title: "Quantum Error Mitigation Techniques",
                        author: "Alice Chen",
                        updated: "3 days ago",
                        tags: ["Error Mitigation", "NISQ", "Fidelity"],
                        contributors: 4,
                      },
                    ].map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              By {doc.author} • Updated {doc.updated}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Users className="h-3 w-3" />
                            {doc.contributors}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {doc.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full"
                      variant="outline"
                      data-testid="button-create-research-doc"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Research Document
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Experiments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="h-5 w-5 text-green-500" />
                      Active Quantum Experiments
                    </CardTitle>
                    <CardDescription>
                      Ongoing research experiments and hypothesis testing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Hybrid VQE-QAOA Performance",
                          hypothesis:
                            "Combining VQE and QAOA improves optimization",
                          progress: 75,
                          team: ["Alice Chen", "Bob Wilson"],
                          status: "testing",
                        },
                        {
                          title: "Quantum Advantage in Max-Cut",
                          hypothesis:
                            "Quantum algorithms show advantage for graphs >50 nodes",
                          progress: 40,
                          team: ["John Doe", "Emma Davis"],
                          status: "data-collection",
                        },
                      ].map((exp, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-medium">{exp.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {exp.hypothesis}
                              </div>
                            </div>
                            <Badge
                              variant={
                                exp.status === "testing"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {exp.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{exp.progress}%</span>
                            </div>
                            <Progress value={exp.progress} className="h-2" />
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-1">
                                {exp.team.map((member, midx) => (
                                  <Avatar
                                    key={midx}
                                    className="h-6 w-6 border-2 border-white dark:border-gray-800"
                                  >
                                    <AvatarFallback className="text-xs">
                                      {member
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {exp.team.join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Tools */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Quick Research Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-algorithm-generator"
                    >
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Algorithm Template Generator
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-hypothesis-tracker"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Hypothesis Tracker
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-comparison-tool"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Result Comparison Tool
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      data-testid="button-paper-generator"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Research Paper Generator
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      Research Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-40 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      {mockQuantumChat.slice(0, 3).map((msg) => (
                        <div key={msg.id} className="text-sm">
                          <div className="font-medium text-blue-600">
                            {msg.user}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">
                            {msg.message}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(msg.timestamp)} ago
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about quantum research..."
                        className="flex-1"
                        data-testid="input-research-chat"
                      />
                      <Button size="icon" data-testid="button-send-message">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* ================ COMPREHENSIVE MODAL INTERFACES ================ */}

        {/* 1. Enhanced Research Chat Modal */}
        <Dialog open={showResearchChat} onOpenChange={setShowResearchChat}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Research Chat - Quantum Collaboration Hub
                </div>
                <div className="flex items-center gap-2 mr-8">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    5 active
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid="button-chat-settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Advanced research collaboration with AI-powered insights, file
                sharing, and real-time quantum analysis
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[calc(100vh-200px)] gap-4">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Chat Header with Search */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search chat history, equations, or quantum circuits..."
                        className="pl-10 bg-white dark:bg-gray-900"
                        data-testid="input-search-chat"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-thread-view"
                    >
                      <Hash className="h-4 w-4 mr-1" />
                      Threads
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-bookmark-message"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {mockQuantumChat.map((msg, idx) => (
                    <div key={msg.id} className="group relative">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {msg.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {msg.user}
                            </span>
                            <Badge
                              variant={
                                msg.type === "algorithm"
                                  ? "default"
                                  : msg.type === "hardware"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs px-2 py-0.5"
                            >
                              {msg.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(msg.timestamp)} ago
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-reply-${msg.id}`}
                              >
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-react-${msg.id}`}
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-bookmark-${msg.id}`}
                              >
                                <BookmarkCheck className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {msg.message}
                            </p>
                            {msg.attachments && (
                              <div className="mt-3 space-y-2">
                                {msg.attachments.map((att, attIdx) => (
                                  <div
                                    key={attIdx}
                                    className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
                                  >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">
                                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-blue-900 dark:text-blue-100">
                                        {att.name}
                                      </div>
                                      <div className="text-xs text-blue-600 dark:text-blue-400">
                                        Quantum Circuit • 2.3 KB
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      data-testid={`button-download-${attIdx}`}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Reaction Bar */}
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-lg">👍</span>
                                <span className="text-xs text-gray-500">3</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🧠</span>
                                <span className="text-xs text-gray-500">2</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-lg">⚛️</span>
                                <span className="text-xs text-gray-500">1</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Live Chat Messages */}
                  {liveChatMessages.map((msg, idx) => (
                    <div key={`live-${idx}`} className="group relative">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {msg.userName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {msg.userName}
                            </span>
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              Team
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Just now
                            </span>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Typing Indicator */}
                  <div className="flex gap-4 opacity-70">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-400 text-white text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        John is typing...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Message Input */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Reply to: Alice Chen - "Just optimized the VQE
                        circuit..."
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        data-testid="button-clear-reply"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Share quantum insights, ask questions, or discuss algorithms..."
                          value={currentChatMessage}
                          onChange={(e) =>
                            setCurrentChatMessage(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (currentChatMessage.trim()) {
                                sendChatMessage(currentChatMessage);
                                setCurrentChatMessage("");
                              }
                            }
                          }}
                          className="min-h-[80px] resize-none pr-20"
                          data-testid="textarea-chat-message"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            data-testid="button-emoji"
                          >
                            <span className="text-lg">😊</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            data-testid="button-attach-file"
                          >
                            <Paperclip className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="icon"
                          onClick={() => {
                            if (currentChatMessage.trim()) {
                              sendChatMessage(currentChatMessage);
                              setCurrentChatMessage("");
                            }
                          }}
                          className="h-10 w-10"
                          data-testid="button-send-chat"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          data-testid="button-voice-message"
                        >
                          <Mic className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      <span>•</span>
                      <span>Format with *bold* _italic_ `code`</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-80 space-y-4 hidden xl:block">
                {/* Active Members */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Team Members (5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Alice Chen",
                      "Bob Wilson",
                      "Dr. Sarah Kim",
                      "John Doe",
                      "Emma Davis",
                    ].map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                {user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{user}</div>
                            <div className="text-xs text-gray-500">
                              {idx === 0
                                ? "Working on VQE"
                                : idx === 1
                                  ? "Hardware testing"
                                  : "Available"}
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Direct Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Video className="h-4 w-4 mr-2" />
                                Start Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Screen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Research Assistant */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Research Assistant
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Beta
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-purple-900 dark:text-purple-100">
                            Optimization Suggestion
                          </div>
                          <div className="text-purple-700 dark:text-purple-300 mt-1">
                            Your VQE circuit can achieve 15% better fidelity by
                            adjusting the ansatz depth to 10 layers.
                          </div>
                          <Button
                            size="sm"
                            className="mt-2"
                            data-testid="button-apply-ai-suggestion"
                          >
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Network className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 dark:text-blue-100">
                            Hardware Alert
                          </div>
                          <div className="text-blue-700 dark:text-blue-300 mt-1">
                            IBM Cairo will be available for 2 hours starting at
                            3:00 PM today.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            data-testid="button-reserve-hardware"
                          >
                            Reserve Time
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      data-testid="button-ask-ai"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask AI Assistant
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Files */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Shared Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      {
                        name: "VQE_optimization_v2.qasm",
                        size: "2.3 KB",
                        user: "Alice",
                        time: "2m ago",
                      },
                      {
                        name: "QAOA_results.pdf",
                        size: "1.8 MB",
                        user: "Bob",
                        time: "15m ago",
                      },
                      {
                        name: "quantum_error_analysis.py",
                        size: "5.2 KB",
                        user: "Sarah",
                        time: "1h ago",
                      },
                    ].map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                          <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {file.user} • {file.time}
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2. Enhanced Voice Chat Modal */}
        <Dialog open={showVoiceChat} onOpenChange={setShowVoiceChat}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Phone className="h-6 w-6 text-green-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      Quantum Research Voice Room
                    </div>
                    <div className="text-sm text-gray-500 font-normal">
                      Room ID: QR-2024-789 • 4 participants
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    LIVE • 12:34
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid="button-voice-settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Audio Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Volume2 className="h-4 w-4 mr-2" />
                        Speaker Test
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Record Meeting
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <StopCircle className="h-4 w-4 mr-2" />
                        Leave Meeting
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogTitle>
              <DialogDescription>
                Professional voice collaboration with HD audio, screen sharing,
                and quantum research tools
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[700px] gap-6">
              {/* Main Video/Audio Area */}
              <div className="flex-1 flex flex-col">
                {/* Participants Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {[
                    {
                      name: "Alice Chen (You)",
                      status: "speaking",
                      muted: false,
                      camera: true,
                      role: "Host",
                    },
                    {
                      name: "Bob Wilson",
                      status: "listening",
                      muted: true,
                      camera: false,
                      role: "Researcher",
                    },
                    {
                      name: "Dr. Sarah Kim",
                      status: "speaking",
                      muted: false,
                      camera: true,
                      role: "Mentor",
                    },
                    {
                      name: "John Doe",
                      status: "away",
                      muted: false,
                      camera: false,
                      role: "Student",
                    },
                  ].map((user, idx) => (
                    <div
                      key={idx}
                      className={`relative rounded-xl overflow-hidden ${
                        user.status === "speaking"
                          ? "ring-4 ring-green-400 ring-opacity-60"
                          : user.status === "away"
                            ? "ring-2 ring-yellow-400 ring-opacity-40"
                            : "ring-2 ring-gray-300 ring-opacity-20"
                      }`}
                    >
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center relative">
                        {user.camera ? (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                            <div className="text-center text-white">
                              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                <span className="text-2xl font-bold">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="text-lg font-semibold">
                                {user.name}
                              </div>
                              <div className="text-sm opacity-80">
                                {user.role}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                              <CameraOff className="h-8 w-8" />
                            </div>
                            <div className="text-lg font-semibold">
                              {user.name}
                            </div>
                            <div className="text-sm opacity-80">
                              {user.role}
                            </div>
                          </div>
                        )}

                        {/* Status Indicators */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === "speaking"
                                ? "bg-green-500 text-white"
                                : user.status === "away"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-500 text-white"
                            }`}
                          >
                            {user.status === "speaking"
                              ? "🎤 Speaking"
                              : user.status === "away"
                                ? "⏰ Away"
                                : "👂 Listening"}
                          </div>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute bottom-3 right-3 flex gap-1">
                          <div
                            className={`p-2 rounded-full ${user.muted ? "bg-red-500" : "bg-green-500"}`}
                          >
                            {user.muted ? (
                              <MicOff className="h-3 w-3 text-white" />
                            ) : (
                              <Mic className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div
                            className={`p-2 rounded-full ${user.camera ? "bg-blue-500" : "bg-gray-500"}`}
                          >
                            {user.camera ? (
                              <Camera className="h-3 w-3 text-white" />
                            ) : (
                              <CameraOff className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>

                        {/* Audio Visualization */}
                        {user.status === "speaking" && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-500">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Professional Control Bar */}
                <div className="p-6 bg-white dark:bg-gray-800 border-t">
                  <div className="flex items-center justify-between">
                    {/* Primary Controls */}
                    <div className="flex items-center gap-4">
                      <Button
                        size="lg"
                        variant={isMuted ? "destructive" : "default"}
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-14 w-14 rounded-full"
                        data-testid="button-toggle-mute"
                      >
                        {isMuted ? (
                          <MicOff className="h-6 w-6" />
                        ) : (
                          <Mic className="h-6 w-6" />
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant={isCameraOn ? "default" : "outline"}
                        onClick={() => setIsCameraOn(!isCameraOn)}
                        className="h-14 w-14 rounded-full"
                        data-testid="button-toggle-camera"
                      >
                        {isCameraOn ? (
                          <Camera className="h-6 w-6" />
                        ) : (
                          <CameraOff className="h-6 w-6" />
                        )}
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14 w-14 rounded-full"
                        data-testid="button-screen-share"
                      >
                        <ScreenShare className="h-6 w-6" />
                      </Button>
                    </div>

                    {/* Recording Status */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          Recording
                        </span>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          12:34
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-stop-recording"
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </div>

                    {/* Leave Button */}
                    <Button
                      size="lg"
                      variant="destructive"
                      onClick={() => setShowVoiceChat(false)}
                      className="h-14 px-6"
                      data-testid="button-leave-call"
                    >
                      <StopCircle className="h-5 w-5 mr-2" />
                      Leave
                    </Button>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Speaker
                      </span>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Microphone
                      </span>
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div className="w-2/3 h-full bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-audio-test"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Audio
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-noise-cancellation"
                    >
                      <Waves className="h-4 w-4 mr-2" />
                      Noise Cancellation
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-80 space-y-4">
                {/* Participants List */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Participants (4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        name: "Alice Chen",
                        role: "Host",
                        status: "speaking",
                        muted: false,
                      },
                      {
                        name: "Bob Wilson",
                        role: "Researcher",
                        status: "listening",
                        muted: true,
                      },
                      {
                        name: "Dr. Sarah Kim",
                        role: "Mentor",
                        status: "speaking",
                        muted: false,
                      },
                      {
                        name: "John Doe",
                        role: "Student",
                        status: "away",
                        muted: false,
                      },
                    ].map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${
                                user.status === "speaking"
                                  ? "bg-green-500"
                                  : user.status === "away"
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.role}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {user.muted && (
                            <MicOff className="h-3 w-3 text-red-500" />
                          )}
                          {user.role === "Host" && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Chat */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      Live Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-sm space-y-2 overflow-y-auto">
                      <div className="flex gap-2">
                        <span className="font-medium text-blue-600 text-xs">
                          Bob:
                        </span>
                        <span className="text-xs">
                          Can everyone hear me clearly?
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-green-600 text-xs">
                          Alice:
                        </span>
                        <span className="text-xs">
                          Perfect audio quality! 👍
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-purple-600 text-xs">
                          Sarah:
                        </span>
                        <span className="text-xs">
                          Let's discuss the VQE optimization now
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-1 text-sm"
                        data-testid="input-voice-chat-message"
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        data-testid="button-send-voice-message"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Meeting Tools */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Meeting Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-share-quantum-circuit"
                    >
                      <Atom className="h-4 w-4 mr-2" />
                      Share Quantum Circuit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-collaborative-whiteboard"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Open Whiteboard
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-hardware-scheduler"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Hardware Scheduler
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-meeting-notes"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Meeting Notes
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Assistant */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Meeting Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
                      <div className="font-medium text-purple-900 dark:text-purple-100">
                        Live Transcription
                      </div>
                      <div className="text-purple-700 dark:text-purple-300 mt-1">
                        "The VQE optimization shows promising results with 8
                        qubits..."
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-ai-summary"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Summary
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 3. Enhanced Screen Share Modal */}
        <Dialog open={showScreenShare} onOpenChange={setShowScreenShare}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Monitor className="h-6 w-6 text-purple-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      Professional Screen Share Studio
                    </div>
                    <div className="text-sm text-gray-500 font-normal">
                      Quantum Circuit Collaboration • HD Quality
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="destructive"
                    className="bg-red-50 text-red-700 border-red-200 animate-pulse"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    LIVE • 1080p
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid="button-screen-settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Monitor className="h-4 w-4 mr-2" />
                        Display Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Maximize2 className="h-4 w-4 mr-2" />
                        Full Screen
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Camera className="h-4 w-4 mr-2" />
                        Record Session
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <StopCircle className="h-4 w-4 mr-2" />
                        Stop Sharing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogTitle>
              <DialogDescription>
                High-definition screen sharing with real-time collaboration,
                annotations, and quantum circuit visualization
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[750px] gap-6">
              {/* Main Screen Share Area */}
              <div className="flex-1 flex flex-col">
                {/* Screen Share Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 border border-purple-200 dark:border-purple-800 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-purple-900 dark:text-purple-100">
                        Alice Chen is presenting
                      </div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">
                        Quantum Circuit Editor • Application Window
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-request-control"
                    >
                      <MousePointer className="h-4 w-4 mr-2" />
                      Request Control
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-annotation-mode"
                    >
                      <PenTool className="h-4 w-4 mr-2" />
                      Annotate
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-presentation-mode"
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Full Screen
                    </Button>
                  </div>
                </div>

                {/* Enhanced Shared Screen Content */}
                <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-xl overflow-hidden border-2 border-purple-200 dark:border-purple-800">
                  {/* Screen Content */}
                  <div className="absolute inset-0 p-8">
                    {/* Simulated Quantum Circuit Interface */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-white">
                          <h2 className="text-2xl font-bold">
                            VQE Optimization Circuit
                          </h2>
                          <p className="text-blue-200">
                            8-Qubit Variational Quantum Eigensolver
                          </p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div className="bg-blue-500/20 p-3 rounded-lg text-center">
                            <div className="text-blue-300 font-semibold">
                              Depth
                            </div>
                            <div className="text-white text-xl">12</div>
                          </div>
                          <div className="bg-green-500/20 p-3 rounded-lg text-center">
                            <div className="text-green-300 font-semibold">
                              Gates
                            </div>
                            <div className="text-white text-xl">156</div>
                          </div>
                          <div className="bg-purple-500/20 p-3 rounded-lg text-center">
                            <div className="text-purple-300 font-semibold">
                              Fidelity
                            </div>
                            <div className="text-white text-xl">92.4%</div>
                          </div>
                        </div>
                      </div>

                      {/* Circuit Visualization */}
                      <div className="bg-black/20 rounded-lg p-4 mb-4">
                        <div className="space-y-4">
                          {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="text-blue-300 text-sm w-8">
                                q{i}
                              </div>
                              <div className="flex-1 h-0.5 bg-blue-400/50 relative">
                                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 border-2 border-yellow-400 bg-yellow-400/20 rounded flex items-center justify-center text-xs text-yellow-300 font-bold">
                                  H
                                </div>
                                <div className="absolute left-20 top-1/2 transform -translate-y-1/2 w-6 h-6 border-2 border-green-400 bg-green-400/20 rounded flex items-center justify-center text-xs text-green-300 font-bold">
                                  R
                                </div>
                                <div className="absolute left-32 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Statistics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-500/20 p-3 rounded">
                          <div className="text-blue-300 text-sm">
                            Expected Value
                          </div>
                          <div className="text-white font-bold">-1.236</div>
                        </div>
                        <div className="bg-green-500/20 p-3 rounded">
                          <div className="text-green-300 text-sm">
                            Convergence
                          </div>
                          <div className="text-white font-bold">87.3%</div>
                        </div>
                        <div className="bg-purple-500/20 p-3 rounded">
                          <div className="text-purple-300 text-sm">
                            Iterations
                          </div>
                          <div className="text-white font-bold">156</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Cursors and Annotations */}
                  <div className="absolute top-24 left-40 flex items-center gap-2 pointer-events-none">
                    <div className="relative">
                      <MousePointer className="h-5 w-5 text-red-400 transform rotate-12" />
                      <div className="absolute top-5 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                        Bob Wilson
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-32 right-32 flex items-center gap-2 pointer-events-none">
                    <div className="relative">
                      <MousePointer className="h-5 w-5 text-blue-400 transform -rotate-12" />
                      <div className="absolute top-5 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                        Dr. Sarah Kim
                      </div>
                    </div>
                  </div>

                  {/* Annotation Layer */}
                  <div className="absolute top-48 left-48 pointer-events-none">
                    <div className="bg-yellow-400/80 text-black text-sm px-2 py-1 rounded-lg font-medium">
                      💡 Try increasing this parameter
                    </div>
                  </div>
                </div>

                {/* Enhanced Control Bar */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t mt-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    {/* Annotation Tools */}
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Annotation Tools:
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-pen-annotation"
                      >
                        <PenTool className="h-4 w-4 mr-1" />
                        Draw
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-text-annotation"
                      >
                        <Type className="h-4 w-4 mr-1" />
                        Text
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-arrow-annotation"
                      >
                        <Mouse className="h-4 w-4 mr-1" />
                        Arrow
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-highlight-annotation"
                      >
                        <Highlighter className="h-4 w-4 mr-1" />
                        Highlight
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-clear-annotations"
                      >
                        <Eraser className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>

                    {/* Quality and Recording */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">
                          1080p • 60fps
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-record-screen"
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Record
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-screenshot"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Screenshot
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-80 space-y-4">
                {/* Active Viewers */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      Active Viewers (4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        name: "Bob Wilson",
                        status: "controlling",
                        role: "Researcher",
                      },
                      {
                        name: "Dr. Sarah Kim",
                        status: "annotating",
                        role: "Mentor",
                      },
                      { name: "John Doe", status: "viewing", role: "Student" },
                      {
                        name: "Emma Davis",
                        status: "viewing",
                        role: "Researcher",
                      },
                    ].map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${
                                user.status === "controlling"
                                  ? "bg-red-500"
                                  : user.status === "annotating"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            ></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {user.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {user.status === "controlling" && (
                            <MousePointer className="h-3 w-3 text-red-500" />
                          )}
                          {user.status === "annotating" && (
                            <PenTool className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Comments & Reactions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      Live Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-40 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-3 overflow-y-auto">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          B
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">
                            Bob Wilson • 2m ago
                          </div>
                          <div className="text-sm">
                            Can we adjust the rotation angle on qubit 3? The
                            current value seems suboptimal.
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs">👍 2</span>
                            <span className="text-xs">💡 1</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          S
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">
                            Dr. Sarah Kim • 1m ago
                          </div>
                          <div className="text-sm">
                            Excellent optimization! The convergence rate
                            improved significantly.
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs">🎉 3</span>
                            <span className="text-xs">⚛️ 2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        className="flex-1 text-sm"
                        data-testid="input-screen-comment"
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        data-testid="button-send-screen-comment"
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Quick reactions:
                      </span>
                      <div className="flex gap-1">
                        {["👍", "💡", "⚛️", "🎉", "❓"].map((emoji, idx) => (
                          <Button
                            key={idx}
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-sm"
                            data-testid={`button-reaction-${idx}`}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Screen Share Controls */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Settings className="h-4 w-4 text-orange-500" />
                      Screen Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-switch-window"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Switch Window
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-share-application"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share Application
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-share-desktop"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      Share Desktop
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-pause-sharing"
                    >
                      <PauseCircle className="h-4 w-4 mr-2" />
                      Pause Sharing
                    </Button>
                  </CardContent>
                </Card>

                {/* Session Recording */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Camera className="h-4 w-4 text-red-500" />
                      Session Recording
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-300">
                          Recording Active
                        </span>
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Duration: 15:32
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Size: 45.8 MB
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        data-testid="button-pause-recording"
                      >
                        <PauseCircle className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        data-testid="button-stop-recording"
                      >
                        <StopCircle className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 4. Enhanced Quantum Whiteboard Modal */}
        <Dialog open={showWhiteboard} onOpenChange={setShowWhiteboard}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Palette className="h-6 w-6 text-indigo-500" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      Quantum Collaborative Whiteboard Studio
                    </div>
                    <div className="text-sm text-gray-500 font-normal">
                      Interactive quantum circuit design and brainstorming
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1 animate-pulse"></div>
                    4 active
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        data-testid="button-whiteboard-settings"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Layers className="h-4 w-4 mr-2" />
                        Manage Layers
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export as Image
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Template
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Canvas Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </DialogTitle>
              <DialogDescription>
                Professional-grade collaborative whiteboard with quantum circuit
                templates, real-time sync, and advanced drawing tools
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[750px] gap-6">
              {/* Main Whiteboard Area */}
              <div className="flex-1 flex flex-col">
                {/* Enhanced Tool Bar */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    {/* Drawing Tools */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 border-r pr-3">
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Drawing:
                        </span>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "pen" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("pen")}
                          data-testid="button-pen-tool"
                        >
                          <PenTool className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "brush" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("brush")}
                          data-testid="button-brush-tool"
                        >
                          <Paintbrush className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "eraser" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("eraser")}
                          data-testid="button-eraser-tool"
                        >
                          <Eraser className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 border-r pr-3">
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Shapes:
                        </span>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "circle" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("circle")}
                          data-testid="button-circle-tool"
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "square" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("square")}
                          data-testid="button-square-tool"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "arrow" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("arrow")}
                          data-testid="button-arrow-tool"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "line" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("line")}
                          data-testid="button-line-tool"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Text:
                        </span>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "text" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("text")}
                          data-testid="button-text-tool"
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            whiteboardTool === "sticky" ? "default" : "outline"
                          }
                          onClick={() => setWhiteboardTool("sticky")}
                          data-testid="button-sticky-tool"
                        >
                          <StickyNote className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Action Tools */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-undo"
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-redo"
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-zoom-in"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-zoom-out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        data-testid="button-fit-screen"
                      >
                        <Maximize className="h-4 w-4" />
                      </Button>
                      <Button size="sm" data-testid="button-save-whiteboard">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>

                  {/* Color and Style Controls */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-indigo-800 dark:text-indigo-200">
                          Color:
                        </span>
                        <div className="flex gap-1">
                          {[
                            "#000000",
                            "#FF0000",
                            "#00FF00",
                            "#0000FF",
                            "#FFFF00",
                            "#FF00FF",
                            "#00FFFF",
                          ].map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded border-2 border-white shadow cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              data-testid={`color-${idx}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-indigo-800 dark:text-indigo-200">
                          Stroke:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 4, 8].map((width, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                              data-testid={`stroke-${width}`}
                            >
                              <div
                                className="bg-black dark:bg-white rounded"
                                style={{ width: "80%", height: `${width}px` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300">
                      <span>Grid: ON</span>
                      <span>•</span>
                      <span>Snap: ON</span>
                      <span>•</span>
                      <span>Zoom: 100%</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Whiteboard Canvas */}
                <div className="flex-1 relative bg-gradient-to-br from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl overflow-hidden">
                  {/* Grid Background */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: "20px 20px",
                    }}
                  ></div>

                  {/* Canvas Content */}
                  <div className="absolute inset-0 p-8">
                    {/* Quantum Circuit Example */}
                    <div className="absolute top-12 left-12">
                      <div className="text-indigo-900 dark:text-indigo-100 font-semibold text-lg mb-4">
                        Quantum Bell State Circuit
                      </div>
                      <div className="space-y-6">
                        {/* Qubit 0 */}
                        <div className="flex items-center gap-6">
                          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            0
                          </div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                          <div className="w-12 h-12 border-3 border-yellow-500 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center text-lg font-bold text-yellow-800 dark:text-yellow-200">
                            H
                          </div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                          <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                        </div>

                        {/* Connection Line */}
                        <div className="ml-52 w-0.5 h-6 bg-indigo-400"></div>

                        {/* Qubit 1 */}
                        <div className="flex items-center gap-6">
                          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            1
                          </div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                          <div className="w-12 h-12 bg-transparent"></div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                          <div className="w-12 h-12 border-3 border-green-500 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-green-600 dark:border-green-400 rounded-full bg-white dark:bg-gray-800"></div>
                          </div>
                          <div className="h-0.5 bg-indigo-400 w-24"></div>
                        </div>
                      </div>

                      {/* Formula */}
                      <div className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-indigo-200 dark:border-indigo-700">
                        <div className="text-indigo-900 dark:text-indigo-100 font-mono text-lg">
                          |ψ⟩ = (|00⟩ + |11⟩) / √2
                        </div>
                      </div>
                    </div>

                    {/* Brainstorming Section */}
                    <div className="absolute top-12 right-12">
                      <div className="space-y-4">
                        <div className="bg-yellow-200 dark:bg-yellow-800 p-3 rounded-lg shadow-lg w-48">
                          <div className="font-semibold text-yellow-900 dark:text-yellow-100">
                            Optimization Ideas
                          </div>
                          <div className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                            • Reduce gate depth • Use hardware-native gates •
                            Apply error mitigation
                          </div>
                        </div>
                        <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-lg shadow-lg w-48">
                          <div className="font-semibold text-blue-900 dark:text-blue-100">
                            Next Steps
                          </div>
                          <div className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                            1. Test on simulator 2. Hardware reservation 3.
                            Compare results
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Collaboration Cursors */}
                    <div className="absolute top-80 left-60 pointer-events-none">
                      <div className="relative">
                        <MousePointer className="h-5 w-5 text-red-500 transform rotate-12" />
                        <div className="absolute top-5 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-pulse">
                          Bob Wilson • Drawing
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-96 right-80 pointer-events-none">
                      <div className="relative">
                        <MousePointer className="h-5 w-5 text-green-500 transform -rotate-12" />
                        <div className="absolute top-5 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-pulse">
                          Dr. Sarah Kim • Adding text
                        </div>
                      </div>
                    </div>

                    {/* Drawing in Progress Indicator */}
                    <div className="absolute bottom-8 left-8">
                      <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-lg border border-indigo-200 dark:border-indigo-700 shadow-lg">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Alice Chen is drawing a circuit diagram...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Status Bar */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-indigo-200 dark:border-indigo-700 rounded-lg mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="font-medium">
                          4 collaborators active
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span>Auto-save every 30s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>Last saved: 2 minutes ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        {
                          name: "Alice",
                          color: "from-blue-500 to-indigo-600",
                          active: true,
                        },
                        {
                          name: "Bob",
                          color: "from-red-500 to-pink-600",
                          active: true,
                        },
                        {
                          name: "Sarah",
                          color: "from-green-500 to-emerald-600",
                          active: true,
                        },
                        {
                          name: "John",
                          color: "from-purple-500 to-violet-600",
                          active: false,
                        },
                      ].map((user, idx) => (
                        <div key={idx} className="relative group">
                          <div
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-xs font-bold ${user.active ? "ring-2 ring-white shadow-lg" : "opacity-50"}`}
                          >
                            {user.name[0]}
                          </div>
                          {user.active && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {user.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-80 space-y-4">
                {/* Quantum Templates */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Atom className="h-4 w-4 text-blue-500" />
                      Quantum Circuit Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Bell State", gates: "H, CNOT", qubits: 2 },
                      { name: "GHZ State", gates: "H, CNOT×2", qubits: 3 },
                      {
                        name: "Quantum Fourier",
                        gates: "H, R, SWAP",
                        qubits: 4,
                      },
                      { name: "VQE Ansatz", gates: "RY, RZ, CNOT", qubits: 8 },
                    ].map((template, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {template.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {template.gates} • {template.qubits} qubits
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            data-testid={`template-${idx}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Layer Management */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4 text-green-500" />
                      Layer Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Circuit Diagram", visible: true, locked: false },
                      { name: "Annotations", visible: true, locked: false },
                      { name: "Background", visible: true, locked: true },
                    ].map((layer, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4"
                            data-testid={`layer-visibility-${idx}`}
                          >
                            {layer.visible ? (
                              <Eye className="h-3 w-3" />
                            ) : (
                              <EyeOff className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="text-sm">{layer.name}</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4"
                          data-testid={`layer-lock-${idx}`}
                        >
                          {layer.locked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Unlock className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Live Activity Feed */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      Live Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-32 space-y-2 overflow-y-auto text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          A
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Alice added H gate • 30s ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                          B
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Bob drew connection line • 1m ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                          S
                        </div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Sarah added formula • 2m ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Download className="h-4 w-4 text-purple-500" />
                      Export & Share
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-export-png"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Export as PNG
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-export-svg"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as SVG
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-export-qasm"
                    >
                      <Code2 className="h-4 w-4 mr-2" />
                      Export QASM
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start"
                      data-testid="button-share-link"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 5. Smart Suggestions Modal */}
        <Dialog
          open={showSmartSuggestions}
          onOpenChange={setShowSmartSuggestions}
        >
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Smart Suggestions
              </DialogTitle>
              <DialogDescription>
                Intelligent recommendations to optimize your quantum research
                and collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {/* Team Optimization Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-blue-500" />
                    Team Collaboration Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Schedule team synchronization
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Alice and Bob have overlapping availability for 3 hours
                        today. Consider scheduling a joint research session on
                        VQE optimization.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          data-testid="button-apply-suggestion-1"
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid="button-dismiss-suggestion-1"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Knowledge sharing opportunity
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Dr. Sarah Kim has expertise in quantum error correction
                        that could benefit the current project. Suggest adding
                        her to the research chat.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-invite-expert">
                          Invite Sarah
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid="button-learn-more"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Algorithm Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BrainCircuit className="h-4 w-4 text-purple-500" />
                    Algorithm Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                      !
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Circuit depth reduction available
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your current VQE circuit can be optimized to reduce
                        depth by 23% while maintaining fidelity above 90%. This
                        would improve noise resilience.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-optimize-circuit">
                          Auto-Optimize
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid="button-show-comparison"
                        >
                          Show Comparison
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                      ⚡
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Hardware-optimized parameters
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Based on ibm_cairo's calibration data, adjusting
                        rotation angles by 12° would improve gate fidelity for
                        your specific circuit.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          data-testid="button-apply-calibration"
                        >
                          Apply Parameters
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid="button-schedule-test"
                        >
                          Schedule Test
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="h-4 w-4 text-red-500" />
                    Resource & Hardware Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                      $
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        Cost-efficient hardware scheduling
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Running your experiment at 2 AM UTC (off-peak hours)
                        would reduce costs by 40% and provide better queue
                        priority.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-schedule-optimal">
                          Schedule Optimal Time
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid="button-view-pricing"
                        >
                          View Pricing
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    AI continuously analyzes your workflow for optimization
                    opportunities
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  data-testid="button-configure-ai"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure AI
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 6. Team Analytics Modal */}
        <Dialog open={showTeamAnalytics} onOpenChange={setShowTeamAnalytics}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Team Analytics Dashboard
              </DialogTitle>
              <DialogDescription>
                Comprehensive analytics and insights about your team's quantum
                research collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[700px] overflow-y-auto">
              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">47</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">92%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      156h
                    </div>
                    <div className="text-sm text-gray-600">Total Runtime</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">23</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Team Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Interactive performance charts
                      </p>
                      <p className="text-xs text-gray-500">
                        7-day trending data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Member Contributions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Member Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Alice Chen",
                      "Bob Wilson",
                      "Dr. Sarah Kim",
                      "John Doe",
                      "Emma Davis",
                    ].map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                              {member
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-500">
                              {12 + idx * 5}
                            </div>
                            <div className="text-gray-500">Commits</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-500">
                              {3 + idx * 2}
                            </div>
                            <div className="text-gray-500">Projects</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-500">
                              {85 + idx * 3}%
                            </div>
                            <div className="text-gray-500">Quality</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* 7. AI Code Review Modal */}
        <Dialog open={showAICodeReview} onOpenChange={setShowAICodeReview}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Radar className="h-5 w-5 text-indigo-500" />
                AI Code Review Assistant
              </DialogTitle>
              <DialogDescription>
                Intelligent quantum code analysis and improvement suggestions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {/* Code Review Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      Latest Code Review: VQE_optimization.py
                    </span>
                    <Badge variant="default" className="bg-green-500">
                      Approved
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Code Quality Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Overall Code Quality
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-32" />
                      <span className="text-sm font-semibold text-green-600">
                        87/100
                      </span>
                    </div>
                  </div>

                  {/* Review Items */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-700 dark:text-green-300">
                          Excellent quantum circuit structure
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Your VQE ansatz implementation follows quantum
                          computing best practices with proper gate sequencing
                          and parameterization.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-700 dark:text-yellow-300">
                          Minor optimization opportunity
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Line 45: Consider using hardware-efficient gate
                          decomposition for better NISQ performance.
                        </p>
                        <Button
                          size="sm"
                          className="mt-2"
                          data-testid="button-apply-fix"
                        >
                          Apply Suggested Fix
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300">
                          Performance enhancement suggestion
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Your gradient computation could be 23% faster with
                          parameter-shift rule optimization.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-500">
                        156
                      </div>
                      <div className="text-sm text-gray-600">Lines of Code</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-500">
                        94%
                      </div>
                      <div className="text-sm text-gray-600">Test Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-500">
                        A+
                      </div>
                      <div className="text-sm text-gray-600">
                        Maintainability
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent AI Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      {
                        file: "QAOA_maxcut.py",
                        score: 92,
                        status: "approved",
                        time: "2h ago",
                      },
                      {
                        file: "quantum_teleportation.py",
                        score: 78,
                        status: "needs_review",
                        time: "5h ago",
                      },
                      {
                        file: "error_mitigation.py",
                        score: 95,
                        status: "approved",
                        time: "1d ago",
                      },
                    ].map((review, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <span className="font-mono text-sm">{review.file}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">
                            {review.score}/100
                          </span>
                          <Badge
                            variant={
                              review.status === "approved"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {review.status.replace("_", " ")}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {review.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* 8. Achievements Modal */}
        <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                Quantum Achievements Gallery
              </DialogTitle>
              <DialogDescription>
                Your team's quantum computing milestones and accomplishments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {/* Achievement Categories */}
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="mastery">Mastery</TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "Quantum Pioneer",
                        description:
                          "Successfully executed your first VQE algorithm",
                        icon: Rocket,
                        rarity: "rare",
                        points: 500,
                        unlocked: true,
                        date: "2 days ago",
                      },
                      {
                        name: "Circuit Master",
                        description:
                          "Optimized a quantum circuit to reduce depth by >20%",
                        icon: Lightning,
                        rarity: "epic",
                        points: 1000,
                        unlocked: true,
                        date: "1 week ago",
                      },
                      {
                        name: "Collaboration Expert",
                        description: "Completed 10 successful team projects",
                        icon: Users,
                        rarity: "legendary",
                        points: 2500,
                        unlocked: false,
                        progress: 7,
                      },
                      {
                        name: "Quantum Debugger",
                        description:
                          "Fixed critical errors in quantum algorithms",
                        icon: Shield,
                        rarity: "common",
                        points: 200,
                        unlocked: true,
                        date: "3 days ago",
                      },
                    ].map((achievement, idx) => (
                      <Card
                        key={idx}
                        className={`relative overflow-hidden ${achievement.unlocked ? "" : "opacity-60"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                achievement.rarity === "legendary"
                                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                                  : achievement.rarity === "epic"
                                    ? "bg-gradient-to-br from-purple-400 to-pink-500"
                                    : achievement.rarity === "rare"
                                      ? "bg-gradient-to-br from-blue-400 to-cyan-500"
                                      : "bg-gradient-to-br from-gray-400 to-gray-500"
                              }`}
                            >
                              <achievement.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold flex items-center gap-2">
                                {achievement.name}
                                {achievement.unlocked && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge
                                  variant={
                                    achievement.rarity === "legendary"
                                      ? "default"
                                      : achievement.rarity === "epic"
                                        ? "secondary"
                                        : achievement.rarity === "rare"
                                          ? "outline"
                                          : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {achievement.rarity}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm">
                                  <Flame className="h-3 w-3 text-orange-500" />
                                  <span className="font-semibold">
                                    {achievement.points} pts
                                  </span>
                                </div>
                              </div>
                              {achievement.unlocked && achievement.date && (
                                <div className="text-xs text-gray-500 mt-2">
                                  Unlocked {achievement.date}
                                </div>
                              )}
                              {!achievement.unlocked &&
                                achievement.progress && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Progress</span>
                                      <span>{achievement.progress}/10</span>
                                    </div>
                                    <Progress
                                      value={achievement.progress * 10}
                                      className="h-1"
                                    />
                                  </div>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="collaboration">
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      Team Collaboration Achievements
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Unlock achievements by working together on quantum
                      projects
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="research">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      Research Milestones
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Achievements for scientific contributions and discoveries
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="mastery">
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Quantum Mastery</h3>
                    <p className="text-gray-600 mt-2">
                      Expert-level achievements for quantum computing mastery
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* 9. Active Challenges Modal */}
        {/* 9. Active Challenges Modal */}
        <ActiveChallengesModal open={showActiveChallenges} onOpenChange={setShowActiveChallenges} />

        {/* 10. Team Leaderboard Modal */}
        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Team Leaderboard
              </DialogTitle>
              <DialogDescription>
                Rankings and achievements of your quantum research team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {/* Leaderboard Categories */}
              <Tabs defaultValue="points" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="points">Total Points</TabsTrigger>
                  <TabsTrigger value="contributions">Contributions</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="monthly">This Month</TabsTrigger>
                </TabsList>

                <TabsContent value="points" className="space-y-4">
                  <div className="space-y-3">
                    {[
                      {
                        name: "Dr. Sarah Kim",
                        points: 8750,
                        level: 12,
                        streak: 28,
                        rank: 1,
                        change: "up",
                      },
                      {
                        name: "Alice Chen",
                        points: 7200,
                        level: 10,
                        streak: 15,
                        rank: 2,
                        change: "same",
                      },
                      {
                        name: "Bob Wilson",
                        points: 6800,
                        level: 9,
                        streak: 12,
                        rank: 3,
                        change: "down",
                      },
                      {
                        name: "John Doe",
                        points: 5500,
                        level: 8,
                        streak: 8,
                        rank: 4,
                        change: "up",
                      },
                      {
                        name: "Emma Davis",
                        points: 4900,
                        level: 7,
                        streak: 5,
                        rank: 5,
                        change: "up",
                      },
                    ].map((member, idx) => (
                      <Card
                        key={idx}
                        className={`${idx < 3 ? "ring-2 ring-yellow-200 dark:ring-yellow-800" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Rank Badge */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                  idx === 0
                                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                                    : idx === 1
                                      ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                                      : idx === 2
                                        ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {member.rank}
                              </div>

                              {/* Member Info */}
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    {member.name}
                                    {idx < 3 && (
                                      <Crown className="h-4 w-4 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Level {member.level} • {member.streak} day
                                    streak
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Points and Change */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {member.points.toLocaleString()}
                              </div>
                              <div
                                className={`text-sm flex items-center gap-1 ${
                                  member.change === "up"
                                    ? "text-green-600"
                                    : member.change === "down"
                                      ? "text-red-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {member.change === "up" && "↗"}
                                {member.change === "down" && "↘"}
                                {member.change === "same" && "—"}
                                <span>points</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="contributions">
                  <div className="text-center py-8">
                    <GitBranch className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      Contribution Rankings
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Based on commits, reviews, and collaboration
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="achievements">
                  <div className="text-center py-8">
                    <Medal className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      Achievement Leaders
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Top performers in quantum achievements
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">
                      This Month's Champions
                    </h3>
                    <p className="text-gray-600 mt-2">
                      September 2025 leaderboard
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* 11. Learning Path Modal */}
        <Dialog open={showLearningPath} onOpenChange={setShowLearningPath}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                Quantum Learning Path
              </DialogTitle>
              <DialogDescription>
                Structured learning journey to master quantum computing and
                collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[700px] overflow-y-auto">
              {/* Progress Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Your Learning Progress
                    </h3>
                    <Badge variant="default" className="bg-indigo-500">
                      Advanced Level
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span>73% (11/15 modules)</span>
                    </div>
                    <Progress value={73} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">
                          11
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">
                          2
                        </div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-500">
                          2
                        </div>
                        <div className="text-sm text-gray-600">Locked</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Modules */}
              <div className="space-y-4">
                {[
                  {
                    title: "Quantum Fundamentals",
                    description:
                      "Master the basics of qubits, superposition, and entanglement",
                    modules: [
                      "Qubit States",
                      "Quantum Gates",
                      "Measurement",
                      "Entanglement",
                    ],
                    completed: 4,
                    total: 4,
                    status: "completed",
                    difficulty: "Beginner",
                  },
                  {
                    title: "Quantum Algorithms",
                    description:
                      "Learn key quantum algorithms and their implementations",
                    modules: [
                      "Deutsch Algorithm",
                      "Grover Search",
                      "Shor's Algorithm",
                      "VQE",
                    ],
                    completed: 3,
                    total: 4,
                    status: "in_progress",
                    difficulty: "Intermediate",
                  },
                  {
                    title: "Quantum Machine Learning",
                    description:
                      "Explore the intersection of quantum computing and ML",
                    modules: [
                      "Quantum Features",
                      "QSVM",
                      "Quantum Neural Networks",
                      "Hybrid Models",
                    ],
                    completed: 2,
                    total: 4,
                    status: "in_progress",
                    difficulty: "Advanced",
                  },
                  {
                    title: "NISQ Programming",
                    description:
                      "Programming for Noisy Intermediate-Scale Quantum devices",
                    modules: [
                      "Error Mitigation",
                      "Circuit Optimization",
                      "Hardware Constraints",
                      "Benchmarking",
                    ],
                    completed: 2,
                    total: 4,
                    status: "available",
                    difficulty: "Expert",
                  },
                  {
                    title: "Quantum Collaboration",
                    description:
                      "Advanced teamwork and collaboration in quantum research",
                    modules: [
                      "Team Protocols",
                      "Shared Resources",
                      "Peer Review",
                      "Knowledge Sharing",
                    ],
                    completed: 0,
                    total: 4,
                    status: "locked",
                    difficulty: "Expert",
                  },
                ].map((path, idx) => (
                  <Card
                    key={idx}
                    className={`${path.status === "locked" ? "opacity-60" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {path.title}
                            </h3>
                            <Badge
                              variant={
                                path.status === "completed"
                                  ? "default"
                                  : path.status === "in_progress"
                                    ? "secondary"
                                    : path.status === "locked"
                                      ? "outline"
                                      : "outline"
                              }
                            >
                              {path.difficulty}
                            </Badge>
                            {path.status === "completed" && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                            {path.status === "locked" && (
                              <Lock className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {path.description}
                          </p>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>
                                {path.completed}/{path.total} modules
                              </span>
                            </div>
                            <Progress
                              value={(path.completed / path.total) * 100}
                              className="h-2"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {path.modules.map((module, midx) => (
                              <Badge
                                key={midx}
                                variant={
                                  midx < path.completed
                                    ? "default"
                                    : midx === path.completed &&
                                        path.status === "in_progress"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {midx < path.completed && "✓ "}
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="ml-4">
                          <Button
                            disabled={path.status === "locked"}
                            data-testid={`button-${path.status === "completed" ? "review" : path.status === "in_progress" ? "continue" : "start"}-path-${idx}`}
                            className="mb-2"
                          >
                            {path.status === "completed"
                              ? "Review"
                              : path.status === "in_progress"
                                ? "Continue"
                                : path.status === "locked"
                                  ? "Locked"
                                  : "Start"}
                          </Button>
                          {path.status !== "locked" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              data-testid={`button-view-curriculum-${idx}`}
                            >
                              View Curriculum
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommended Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Route className="h-4 w-4" />
                    Recommended Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Complete VQE Module</div>
                        <div className="text-sm text-gray-600">
                          Finish the last module in Quantum Algorithms
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Join Study Group</div>
                        <div className="text-sm text-gray-600">
                          Connect with peers learning Quantum ML
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* ================ QUANTUM HARDWARE & RESOURCES MODAL INTERFACES ================ */}

        {/* 1. Smart Scheduler Modal */}
        <Dialog open={showSmartScheduler} onOpenChange={setShowSmartScheduler}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Smart Hardware Scheduler
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    3 backends available
                  </Badge>
                  <Button size="icon" variant="ghost" data-testid="button-scheduler-settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Intelligent quantum hardware scheduling with optimal resource allocation and cost optimization
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[650px] gap-4">
              {/* Main Scheduler Interface */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Hardware Status Overview */}
                <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-500">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">1</div>
                      <div className="text-sm text-gray-500">Busy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">1</div>
                      <div className="text-sm text-gray-500">Maintenance</div>
                    </div>
                  </div>
                </div>

                {/* Backend Selection Grid */}
                <div className="flex-1 p-4 space-y-4">
                  <h3 className="text-lg font-semibold">Select Quantum Backend</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockBackends.slice(0, 4).map((backend) => (
                      <Card key={backend.id} className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-orange-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{backend.name}</h4>
                            <Badge className={backend.status === 'available' ? 'bg-green-100 text-green-800' : backend.status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                              {backend.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-gray-500">Qubits:</span> <span className="font-medium">{backend.qubits}</span></div>
                            <div><span className="text-gray-500">Queue:</span> <span className="font-medium">{backend.queueLength}</span></div>
                            <div><span className="text-gray-500">Wait:</span> <span className="font-medium">{backend.averageWaitTime}min</span></div>
                            <div><span className="text-gray-500">Uptime:</span> <span className="font-medium">{backend.uptime}</span></div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Utilization</span>
                              <span>{backend.queueLength || 0}/50</span>
                            </div>
                            <Progress value={((backend.queueLength || 0) / 50) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Quick Schedule Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Schedule New Reservation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Input type="datetime-local" />
                        </div>
                        <div>
                          <Label>Duration (minutes)</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Purpose</Label>
                        <Textarea placeholder="Describe your experiment or research purpose..." />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Reservation
                        </Button>
                        <Button variant="outline">
                          <Target className="h-4 w-4 mr-2" />
                          Optimize Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar - Current Reservations & AI Suggestions */}
              <div className="w-80 space-y-4">
                {/* Current Reservations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Current Reservations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockHardwareSchedule.map((reservation) => (
                      <div key={reservation.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{reservation.backend}</span>
                          <Badge className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">{reservation.purpose}</div>
                        <div className="text-xs text-gray-500">
                          {formatDistanceToNow(reservation.startTime)} • {reservation.duration}min
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Scheduling Suggestions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI Scheduling Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Optimal Time Slot</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Schedule for 2:00 AM EST for 40% faster execution
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm font-medium text-green-900 dark:text-green-100">Cost Savings</div>
                      <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Use simulator for testing first - save $25/hour
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2. Resource Optimizer Modal */}
        <Dialog open={showResourceOptimizer} onOpenChange={setShowResourceOptimizer}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  AI Resource Optimizer
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1 animate-pulse"></div>
                    AI Active
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                AI-powered optimization recommendations for efficient resource utilization and cost reduction
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[650px] gap-4">
              {/* Main Optimization Dashboard */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Optimization Metrics */}
                <div className="p-4 border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-gray-500">Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">$450</div>
                      <div className="text-sm text-gray-500">Weekly Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-500">Active Jobs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">94%</div>
                      <div className="text-sm text-gray-500">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Optimization Recommendations */}
                <div className="flex-1 p-4 space-y-4">
                  <h3 className="text-lg font-semibold">AI Optimization Recommendations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Cost Optimization */}
                    <Card className="border-green-200 dark:border-green-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Cost Optimization
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="font-medium text-green-900 dark:text-green-100 text-sm">Switch to Simulator</div>
                          <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                            Use quantum simulator for development and testing
                          </div>
                          <div className="text-xs font-medium text-green-600 mt-2">Potential savings: $200/month</div>
                        </div>
                        <Button size="sm" className="w-full">Apply Recommendation</Button>
                      </CardContent>
                    </Card>

                    {/* Performance Optimization */}
                    <Card className="border-blue-200 dark:border-blue-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          Performance Boost
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">Optimize Queue Timing</div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Schedule during off-peak hours (2-6 AM EST)
                          </div>
                          <div className="text-xs font-medium text-blue-600 mt-2">Time savings: 2-3 hours/day</div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">View Schedule</Button>
                      </CardContent>
                    </Card>

                    {/* Efficiency Optimization */}
                    <Card className="border-purple-200 dark:border-purple-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="h-4 w-4 text-purple-500" />
                          Efficiency Boost
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="font-medium text-purple-900 dark:text-purple-100 text-sm">Batch Experiments</div>
                          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                            Group similar VQE experiments to reduce overhead
                          </div>
                          <div className="text-xs font-medium text-purple-600 mt-2">Efficiency gain: 30%</div>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">Auto-Batch Jobs</Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Resource Usage Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-orange-500" />
                        Resource Usage Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">42.5h</div>
                          <div className="text-sm text-gray-500">Weekly Usage</div>
                          <div className="text-xs text-green-600 mt-1">+12% from last week</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">85%</div>
                          <div className="text-sm text-gray-500">Cost Efficiency</div>
                          <div className="text-xs text-yellow-600 mt-1">Can improve by 15%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">94.2%</div>
                          <div className="text-sm text-gray-500">Success Rate</div>
                          <div className="text-xs text-green-600 mt-1">Above average</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar - Real-time Metrics */}
              <div className="w-80 space-y-4">
                {/* Live Resource Monitor */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      Live Resource Monitor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU Usage</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Queue Load</span>
                        <span>32%</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Optimization History */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Optimizations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Queue optimization</span>
                        <span className="text-green-600">+15% speed</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost reduction</span>
                        <span className="text-green-600">-$45/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Job batching</span>
                        <span className="text-green-600">+30% efficiency</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 3. Live Circuit Editor Modal */}
        <Dialog open={showLiveCircuitEditor} onOpenChange={setShowLiveCircuitEditor}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-blue-500" />
                  Live Quantum Circuit Editor
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    3 collaborators
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Real-time collaborative quantum circuit design with live simulation and shared editing
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[650px] gap-4">
              {/* Main Circuit Editor */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Toolbar */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button size="sm" variant="outline">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Circuit: VQE_optimization_v2.qasm</span>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Simulate
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Circuit Design Area */}
                <div className="flex-1 p-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-full flex flex-col">
                    {/* Circuit Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div><span className="text-gray-500">Qubits:</span> <span className="font-medium">8</span></div>
                        <div><span className="text-gray-500">Gates:</span> <span className="font-medium">156</span></div>
                        <div><span className="text-gray-500">Depth:</span> <span className="font-medium">12</span></div>
                        <div><span className="text-gray-500">Backend:</span> <span className="font-medium">ibm_cairo</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Alice Chen (editing)</span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                        <span className="text-sm text-gray-600">Bob Wilson (viewing)</span>
                      </div>
                    </div>

                    {/* Circuit Visualization */}
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <CircuitBoard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Interactive Circuit Canvas</div>
                          <div className="text-sm text-gray-500 mt-2">
                            Drag and drop quantum gates to build your circuit
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gate Palette */}
                    <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                      <div className="text-sm font-medium mb-2">Quantum Gates</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="text-xs">H</Button>
                        <Button size="sm" variant="outline" className="text-xs">X</Button>
                        <Button size="sm" variant="outline" className="text-xs">Y</Button>
                        <Button size="sm" variant="outline" className="text-xs">Z</Button>
                        <Button size="sm" variant="outline" className="text-xs">CNOT</Button>
                        <Button size="sm" variant="outline" className="text-xs">RZ</Button>
                        <Button size="sm" variant="outline" className="text-xs">RY</Button>
                        <Button size="sm" variant="outline" className="text-xs">Measure</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Collaboration & Results */}
              <div className="w-80 space-y-4">
                {/* Active Collaborators */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Active Collaborators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockLiveCircuits[0].collaborators.map((collaborator, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-800 rounded-full ${
                            collaborator.status === 'editing' ? 'bg-green-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{collaborator.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{collaborator.status}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Simulation Results */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-500" />
                      Simulation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span>Fidelity</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-2 mb-3" />
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>|00⟩</span>
                          <span>487 (47.9%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>|11⟩</span>
                          <span>501 (49.2%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>|01⟩</span>
                          <span>18 (1.8%)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>|10⟩</span>
                          <span>18 (1.8%)</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Run on Hardware
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Changes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Alice added H gate to qubit 0</span>
                        <span className="text-gray-500 ml-auto">2m ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Bob optimized circuit depth</span>
                        <span className="text-gray-500 ml-auto">5m ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Circuit saved as v2.1</span>
                        <span className="text-gray-500 ml-auto">8m ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 4. Experiment Tracker Modal */}
        <Dialog open={showExperimentTracker} onOpenChange={setShowExperimentTracker}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-purple-500" />
                  Quantum Experiment Tracker
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></div>
                    5 active experiments
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Comprehensive tracking and management of quantum research experiments with hypothesis testing
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[650px] gap-4">
              {/* Main Experiments Dashboard */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Experiment Overview */}
                <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">2</div>
                      <div className="text-sm text-gray-500">Running</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1</div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">1</div>
                      <div className="text-sm text-gray-500">Paused</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">1</div>
                      <div className="text-sm text-gray-500">Planning</div>
                    </div>
                  </div>
                </div>

                {/* Experiments List */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Active Experiments</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Experiment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {mockExperiments.slice(0, 4).map((experiment) => (
                      <Card key={experiment.id} className="hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{experiment.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{experiment.description}</p>
                            </div>
                            <Badge className={experiment.status === 'running' ? 'bg-green-100 text-green-800' : 
                                             experiment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                             experiment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                                             'bg-gray-100 text-gray-800'}>
                              {experiment.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-gray-500">Owner:</span>
                              <div className="font-medium">{experiment.owner}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Progress:</span>
                              <div className="font-medium">{experiment.progress}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Jobs:</span>
                              <div className="font-medium">{experiment.jobsCompleted}/{experiment.totalJobs}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Backend:</span>
                              <div className="font-medium">{experiment.currentBackend || 'N/A'}</div>
                            </div>
                          </div>

                          {experiment.progress > 0 && (
                            <div className="mb-3">
                              <Progress value={experiment.progress} className="h-2" />
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {experiment.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {experiment.status === 'running' && (
                                <Button size="sm" variant="outline">
                                  <Pause className="h-4 w-4" />
                                </Button>
                              )}
                              {experiment.status === 'paused' && (
                                <Button size="sm" variant="outline">
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Experiment Details & Insights */}
              <div className="w-80 space-y-4">
                {/* Experiment Insights */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      AI Experiment Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Hypothesis Validation
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        VQE experiment shows 15% improvement - hypothesis confirmed
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm font-medium text-green-900 dark:text-green-100">
                        Optimization Suggestion
                      </div>
                      <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Increase ansatz depth to 16 layers for better convergence
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Experiment Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-green-600">95%</div>
                        <div className="text-gray-500">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-blue-600">8.5h</div>
                        <div className="text-gray-500">Avg Runtime</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">24</div>
                        <div className="text-gray-500">Total Circuits</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-orange-600">341</div>
                        <div className="text-gray-500">Jobs Run</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>VQE experiment completed</span>
                        <span className="text-gray-500 ml-auto">5m ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>New QAOA experiment started</span>
                        <span className="text-gray-500 ml-auto">12m ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Error mitigation paused</span>
                        <span className="text-gray-500 ml-auto">1h ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

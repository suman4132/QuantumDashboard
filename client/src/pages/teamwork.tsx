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
  StopCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/dashboard/header";
import { formatDistanceToNow } from "date-fns";

// Enhanced quantum collaboration workspace data
const mockWorkspaces = [
  {
    id: "ws-1",
    name: "Quantum ML Research",
    description: "Exploring quantum machine learning algorithms with variational circuits",
    members: ["Alice Chen", "Bob Wilson", "Dr. Sarah Kim"],
    status: "active",
    privacy: "private",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    progress: 75,
    circuits: 12,
    jobs: 45,
    quantumFeatures: {
      liveCircuits: 3,
      activeCollaborators: 2,
      quantumJobs: 18,
      hardwareReserved: "ibm_cairo",
      nextReservation: new Date(Date.now() + 4 * 60 * 60 * 1000),
      experimentsSaved: 24,
      hypothesesTesting: 2
    },
    recentActivity: [
      { user: "Alice Chen", action: "edited Variational Circuit #4", time: "2 min ago", type: "circuit" },
      { user: "Bob Wilson", action: "shared VQE experiment results", time: "15 min ago", type: "results" },
      { user: "Dr. Sarah Kim", action: "reserved ibm_cairo for 2pm-4pm", time: "1 hour ago", type: "hardware" }
    ]
  },
  {
    id: "ws-2", 
    name: "Optimization Algorithms",
    description: "Developing QAOA solutions for combinatorial optimization problems",
    members: ["John Doe", "Emma Davis", "Mike Thompson", "Lisa Zhang"],
    status: "active",
    privacy: "public",
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    progress: 60,
    circuits: 8,
    jobs: 28,
    quantumFeatures: {
      liveCircuits: 1,
      activeCollaborators: 3,
      quantumJobs: 12,
      hardwareReserved: "ibm_brisbane",
      nextReservation: new Date(Date.now() + 6 * 60 * 60 * 1000),
      experimentsSaved: 18,
      hypothesesTesting: 1
    },
    recentActivity: [
      { user: "John Doe", action: "optimized QAOA parameters", time: "5 min ago", type: "algorithm" },
      { user: "Emma Davis", action: "commented on Max-Cut results", time: "12 min ago", type: "discussion" },
      { user: "Mike Thompson", action: "scheduled hardware test", time: "30 min ago", type: "hardware" }
    ]
  },
  {
    id: "ws-3",
    name: "Quantum Cryptography",
    description: "Building quantum key distribution protocols and security analysis",
    members: ["Dr. Alex Moore", "Rachel Green"],
    status: "paused",
    privacy: "private",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    progress: 40,
    circuits: 6,
    jobs: 15,
    quantumFeatures: {
      liveCircuits: 0,
      activeCollaborators: 0,
      quantumJobs: 6,
      hardwareReserved: null,
      nextReservation: null,
      experimentsSaved: 12,
      hypothesesTesting: 0
    },
    recentActivity: [
      { user: "Dr. Alex Moore", action: "paused BB84 protocol development", time: "1 day ago", type: "project" },
      { user: "Rachel Green", action: "documented key distribution analysis", time: "1 day ago", type: "documentation" }
    ]
  }
];

// Enhanced quantum project data with advanced collaboration features
const mockProjects = [
  {
    id: "proj-1",
    name: "VQE Ground State Calculation",
    workspace: "Quantum ML Research",
    owner: "Alice Chen",
    collaborators: 3,
    status: "running",
    lastModified: new Date(Date.now() - 30 * 60 * 1000),
    runtime: "2h 15m",
    backend: "ibm_cairo",
    quantumDetails: {
      circuitDepth: 12,
      qubits: 8,
      gates: 156,
      fidelity: 0.92,
      shots: 8192,
      liveEditors: ["Alice Chen", "Bob Wilson"],
      comments: 7,
      versions: 15,
      experiments: 3,
      sharedResults: 2
    }
  },
  {
    id: "proj-2",
    name: "QAOA Max-Cut Implementation",
    workspace: "Optimization Algorithms", 
    owner: "John Doe",
    collaborators: 2,
    status: "completed",
    lastModified: new Date(Date.now() - 60 * 60 * 1000),
    runtime: "45m",
    backend: "ibm_brisbane",
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
      sharedResults: 5
    }
  },
  {
    id: "proj-3",
    name: "Quantum Teleportation Protocol",
    workspace: "Quantum Cryptography",
    owner: "Dr. Alex Moore",
    collaborators: 1,
    status: "draft",
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runtime: "-",
    backend: "simulator",
    quantumDetails: {
      circuitDepth: 6,
      qubits: 3,
      gates: 24,
      fidelity: null,
      shots: 1024,
      liveEditors: [],
      comments: 3,
      versions: 4,
      experiments: 1,
      sharedResults: 0
    }
  }
];

// Mock quantum hardware scheduling data
const mockHardwareSchedule = [
  {
    id: "hw-1",
    backend: "ibm_cairo",
    user: "Alice Chen",
    workspace: "Quantum ML Research",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 120, // minutes
    purpose: "VQE Parameter Optimization",
    status: "confirmed"
  },
  {
    id: "hw-2",
    backend: "ibm_brisbane",
    user: "John Doe",
    workspace: "Optimization Algorithms",
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    duration: 90,
    purpose: "QAOA Circuit Testing",
    status: "pending"
  }
];

// Mock quantum collaboration chat data
const mockQuantumChat = [
  {
    id: "msg-1",
    user: "Alice Chen",
    message: "Just optimized the VQE circuit depth to 12 layers. The new ansatz shows 8% improvement in convergence!",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: "algorithm",
    attachments: [{ type: "circuit", name: "optimized_vqe_v2.qasm" }]
  },
  {
    id: "msg-2",
    user: "Bob Wilson",
    message: "Great work! I'm seeing similar improvements in my simulation. Should we test this on real hardware?",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: "discussion",
    replyTo: "msg-1"
  },
  {
    id: "msg-3",
    user: "Dr. Sarah Kim",
    message: "I've reserved ibm_cairo for 2-4pm today. Let's run the full parameter sweep.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "hardware",
    attachments: [{ type: "reservation", name: "Hardware Booking #HW-1247" }]
  }
];

export default function Teamwork() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
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
  
  // Feature states
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [whiteboardTool, setWhiteboardTool] = useState('pen');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentChatMessage, setCurrentChatMessage] = useState('');

  // Filter workspaces based on search and filters
  const filteredWorkspaces = mockWorkspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || workspace.status === statusFilter;
    const matchesPrivacy = privacyFilter === "all" || workspace.privacy === privacyFilter;
    
    return matchesSearch && matchesStatus && matchesPrivacy;
  });

  // Filter projects for selected workspace
  const workspaceProjects = selectedWorkspace 
    ? mockProjects.filter(p => p.workspace === mockWorkspaces.find(w => w.id === selectedWorkspace)?.name)
    : mockProjects;

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
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "running": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    return privacy === "private" ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />;
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
                Work together on quantum computing projects with real-time collaboration
              </p>
            </div>
            <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-create-workspace">
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>
                    Set up a collaborative workspace for your quantum computing project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input 
                      id="workspace-name" 
                      placeholder="Enter workspace name..."
                      data-testid="input-workspace-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-desc">Description</Label>
                    <Textarea 
                      id="workspace-desc" 
                      placeholder="Describe your project goals and scope..."
                      data-testid="textarea-workspace-description"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workspace-private">Private Workspace</Label>
                    <Switch id="workspace-private" data-testid="switch-workspace-private" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateWorkspaceOpen(false)} data-testid="button-create-workspace-confirm">
                    Create Workspace
                  </Button>
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
                <SelectTrigger className="w-32" data-testid="select-status-filter">
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
                <SelectTrigger className="w-32" data-testid="select-privacy-filter">
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
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Live Collaboration</span>
                <Badge variant="secondary" className="ml-auto">{liveCollaborators} active</Badge>
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
                {showQuantumChat && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </Button>
              <Button 
                variant={isVoiceChatActive ? "default" : "outline"} 
                size="sm" 
                onClick={() => setShowVoiceChat(true)}
                className="flex items-center gap-2"
                data-testid="button-voice-chat"
              >
                {isVoiceChatActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
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
                <span className="text-sm font-medium text-green-700 dark:text-green-300">AI Intelligence</span>
                <Badge variant="secondary" className="ml-auto">{aiRecommendations} insights</Badge>
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
                {aiRecommendations > 0 && <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">{aiRecommendations}</Badge>}
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
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Quantum Achievements & Challenges</span>
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
              {currentAchievements > 0 && <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">{currentAchievements} new</Badge>}
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
              <Badge variant="secondary" className="ml-1 px-2 py-1 text-xs">{challengesInProgress} in progress</Badge>
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
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Quantum Hardware & Resources</span>
              <Badge variant="secondary" className="ml-auto">{mockHardwareSchedule.length} reservations</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHardwareScheduler(!showHardwareScheduler)}
              className="flex items-center gap-2"
              data-testid="button-hardware-scheduler"
            >
              <Calendar className="h-4 w-4" />
              Smart Scheduler
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              data-testid="button-resource-optimizer"
            >
              <Zap className="h-4 w-4" />
              Resource Optimizer
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
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
              className="flex items-center gap-2"
              data-testid="button-experiment-tracker"
            >
              <FlaskConical className="h-4 w-4" />
              Experiment Tracker
              <Badge variant="secondary" className="ml-1 px-2 py-1 text-xs">5 active</Badge>
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
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Smart Notifications & Context Alerts</span>
              <Badge variant="destructive" className="ml-auto">3 new</Badge>
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
                      <div className="text-sm font-medium">VQE Job Completed Successfully!</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Your optimization found ground state with 92% fidelity</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">AI Collaboration Suggestion</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Team member Alice has similar QAOA work - consider collaborating</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <Trophy className="h-4 w-4 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Achievement Unlocked: Circuit Optimizer!</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">You've optimized 10 quantum circuits - earned 150 points</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="workspaces" data-testid="tab-workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Live Projects</TabsTrigger>
            <TabsTrigger value="ai-insights" data-testid="tab-ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="gamification" data-testid="tab-gamification">Achievements</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="research" data-testid="tab-research">Research Hub</TabsTrigger>
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
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setSelectedWorkspace(workspace.id)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{workspace.name}</CardTitle>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{workspace.progress}%</span>
                        </div>
                        <Progress value={workspace.progress} className="h-2" />
                      </div>

                      {/* Enhanced Quantum Stats */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-blue-600">{workspace.circuits}</div>
                            <div className="text-xs text-gray-500">Circuits</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-green-600">{workspace.jobs}</div>
                            <div className="text-xs text-gray-500">Jobs</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-purple-600">{workspace.members.length}</div>
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
                            <span className="font-semibold">{workspace.quantumFeatures.liveCircuits}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-green-500" />
                              Active Now
                            </span>
                            <span className="font-semibold">{workspace.quantumFeatures.activeCollaborators}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <FlaskConical className="h-3 w-3 text-purple-500" />
                              Experiments
                            </span>
                            <span className="font-semibold">{workspace.quantumFeatures.experimentsSaved}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                            <span className="flex items-center gap-1">
                              <Cpu className="h-3 w-3 text-orange-500" />
                              Hardware
                            </span>
                            <span className="font-semibold text-xs">
                              {workspace.quantumFeatures.hardwareReserved || 'None'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members</div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {workspace.members.slice(0, 3).map((member, idx) => (
                              <Avatar key={idx} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                <AvatarFallback className="text-xs">
                                  {member.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {workspace.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <span className="text-xs font-medium">+{workspace.members.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Recent Quantum Activity */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Activity</div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {workspace.recentActivity.slice(0, 3).map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                                activity.type === 'circuit' ? 'bg-blue-500' :
                                activity.type === 'results' ? 'bg-green-500' :
                                activity.type === 'hardware' ? 'bg-orange-500' :
                                activity.type === 'algorithm' ? 'bg-purple-500' :
                                'bg-gray-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="text-gray-900 dark:text-white truncate">
                                  <span className="font-medium">{activity.user}</span> {activity.action}
                                </div>
                                <div className="text-gray-500">{activity.time}</div>
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workspaces found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery || statusFilter !== "all" || privacyFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Create your first collaborative workspace to get started"}
                </p>
                {(!searchQuery && statusFilter === "all" && privacyFilter === "all") && (
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
                    Real-time collaborative quantum computing projects across all workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr className="text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workspace</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Runtime</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Backend</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collaborators</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {workspaceProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Modified {formatDistanceToNow(project.lastModified)} ago
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.workspace}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {project.status === "running" && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                {project.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {project.status === "draft" && <Edit3 className="h-4 w-4 text-gray-400" />}
                                <Badge className={getStatusColor(project.status)}>
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
                                  {Array.from({ length: Math.min(project.collaborators, 3) }, (_, i) => (
                                    <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                      <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">+{project.collaborators}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{reservation.backend}</Badge>
                          <Badge 
                            variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{reservation.purpose}</div>
                        <div className="text-xs text-gray-500">
                          {reservation.user} • {reservation.duration}min • {formatDistanceToNow(reservation.startTime)} from now
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline" data-testid="button-reserve-hardware">
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
                      <span className="text-sm text-gray-500">47 this week</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hardware Hours</span>
                      <span className="text-sm text-gray-500">12.5 / 20 hours</span>
                    </div>
                    <Progress value={62} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Circuit Complexity</span>
                      <span className="text-sm text-gray-500">Avg 8.2 qubits</span>
                    </div>
                    <Progress value={41} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">94.2%</div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">2.1s</div>
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
                    { name: 'ibm_cairo', qubits: 27, status: 'online', queue: 3, fidelity: 0.95 },
                    { name: 'ibm_brisbane', qubits: 127, status: 'online', queue: 8, fidelity: 0.92 },
                    { name: 'ibm_kyiv', qubits: 127, status: 'maintenance', queue: 0, fidelity: 0.93 },
                    { name: 'ibm_torino', qubits: 133, status: 'online', queue: 12, fidelity: 0.91 },
                    { name: 'ionq_harmony', qubits: 56, status: 'online', queue: 2, fidelity: 0.97 },
                    { name: 'rigetti_aspen', qubits: 80, status: 'offline', queue: 0, fidelity: 0.89 }
                  ].map((backend) => (
                    <div key={backend.name} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{backend.name}</div>
                        <div className={`w-2 h-2 rounded-full ${
                          backend.status === 'online' ? 'bg-green-500' :
                          backend.status === 'maintenance' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {backend.qubits} qubits • Queue: {backend.queue}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Fidelity: </span>
                        <span className="font-medium">{(backend.fidelity * 100).toFixed(1)}%</span>
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
                      description: "Dr. Sarah Kim's quantum ML expertise complements your VQE optimization work perfectly",
                      confidence: 95,
                      action: "Invite to collaborate"
                    },
                    {
                      type: "mentorship",
                      title: "Mentorship Opportunity",
                      description: "Bob Wilson could benefit from your QAOA experience - consider offering guidance",
                      confidence: 88,
                      action: "Offer mentorship"
                    },
                    {
                      type: "project_suggestion",
                      title: "Breakthrough Project Idea",
                      description: "Hybrid VQE-QAOA approach could solve optimization problems 30% faster",
                      confidence: 92,
                      action: "Start project"
                    }
                  ].map((insight, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {insight.type === 'team_match' && <Users className="h-4 w-4 text-blue-500" />}
                            {insight.type === 'mentorship' && <Award className="h-4 w-4 text-purple-500" />}
                            {insight.type === 'project_suggestion' && <Lightbulb className="h-4 w-4 text-yellow-500" />}
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
                      <Button size="sm" className="w-full" data-testid={`button-${insight.type}-action`}>
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
                      <span className="font-medium text-green-700 dark:text-green-300">Optimization Found</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Your VQE circuit can be optimized by 23% by reducing gate depth and using hardware-native gates
                    </div>
                    <Button size="sm" className="mt-2" data-testid="button-apply-optimization">
                      Apply Optimization
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <span className="font-medium text-blue-700 dark:text-blue-300">Collaboration Insight</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Similar algorithm patterns detected in Alice Chen's work - potential for code sharing
                    </div>
                    <Button size="sm" variant="outline" className="mt-2" data-testid="button-compare-code">
                      Compare & Collaborate
                    </Button>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium text-purple-700 dark:text-purple-300">Innovation Opportunity</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Novel ansatz structure discovered - potential for research publication
                    </div>
                    <Button size="sm" variant="outline" className="mt-2" data-testid="button-research-path">
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
                      <div className="text-lg font-semibold text-green-600">32%</div>
                      <div className="text-xs text-gray-500">Cost Savings</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-semibold text-blue-600">18min</div>
                      <div className="text-xs text-gray-500">Avg Queue Time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Recommended Schedule:</div>
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
                  
                  <Button className="w-full" size="sm" data-testid="button-apply-schedule">
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
                      { step: 1, title: "Advanced VQE Techniques", status: "in-progress", progress: 75 },
                      { step: 2, title: "Quantum Error Mitigation", status: "next", progress: 0 },
                      { step: 3, title: "Hybrid Algorithms", status: "upcoming", progress: 0 }
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          item.status === 'next' ? 'bg-gray-100 text-gray-600' :
                          'bg-gray-50 text-gray-400'
                        }`}>
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          {item.progress > 0 && (
                            <Progress value={item.progress} className="h-1 mt-1" />
                          )}
                        </div>
                        {item.status === 'in-progress' && (
                          <Button size="sm" variant="outline" data-testid={`button-continue-step-${item.step}`}>
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
                        description: "Optimized 10 quantum circuits for better performance",
                        icon: "⚡",
                        rarity: "rare",
                        points: 150,
                        unlockedAt: "2 hours ago",
                        progress: 100
                      },
                      {
                        id: "collaboration_master",
                        name: "Collaboration Master",
                        description: "Successfully completed 5 team projects",
                        icon: "🤝",
                        rarity: "uncommon",
                        points: 200,
                        unlockedAt: "1 day ago",
                        progress: 100
                      },
                      {
                        id: "vqe_expert",
                        name: "VQE Expert",
                        description: "Master VQE algorithm implementation (8/10)",
                        icon: "🔬",
                        rarity: "epic",
                        points: 300,
                        unlockedAt: null,
                        progress: 80
                      }
                    ].map((achievement) => (
                      <div key={achievement.id} className={`p-4 border rounded-lg ${
                        achievement.progress === 100 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-800'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {achievement.name}
                                <Badge variant={
                                  achievement.rarity === 'legendary' ? 'default' :
                                  achievement.rarity === 'epic' ? 'secondary' :
                                  achievement.rarity === 'rare' ? 'outline' : 'secondary'
                                } className="text-xs">
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-600">+{achievement.points} pts</div>
                            {achievement.unlockedAt && (
                              <div className="text-xs text-gray-500">{achievement.unlockedAt}</div>
                            )}
                          </div>
                        </div>
                        {achievement.progress < 100 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Active Challenges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-500" />
                      Active Challenges
                    </CardTitle>
                    <CardDescription>
                      Test your skills with quantum computing challenges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: "quantum_hackathon",
                        name: "Quantum Hackathon 2025",
                        description: "Build innovative quantum applications in teams",
                        difficulty: "intermediate",
                        timeLeft: "5 days",
                        participants: 127,
                        maxParticipants: 200,
                        rewards: ["1000 pts", "Certificate", "Recognition"],
                        progress: 45
                      },
                      {
                        id: "vqe_challenge",
                        name: "VQE Mastery Challenge",
                        description: "Implement and optimize VQE for molecular systems",
                        difficulty: "advanced",
                        timeLeft: "12 days",
                        participants: 67,
                        maxParticipants: 100,
                        rewards: ["500 pts", "VQE Expert Badge"],
                        progress: 23
                      }
                    ].map((challenge) => (
                      <div key={challenge.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium flex items-center gap-2">
                              {challenge.name}
                              <Badge variant={
                                challenge.difficulty === 'expert' ? 'default' :
                                challenge.difficulty === 'advanced' ? 'secondary' :
                                'outline'
                              } className="text-xs">
                                {challenge.difficulty}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {challenge.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-orange-600">{challenge.timeLeft} left</div>
                            <div className="text-xs text-gray-500">
                              {challenge.participants}/{challenge.maxParticipants} joined
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Your Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {challenge.rewards.map((reward, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{reward}</Badge>
                            ))}
                          </div>
                          <Button size="sm" data-testid={`button-join-challenge-${challenge.id}`}>
                            Continue Challenge
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button className="w-full" variant="outline" data-testid="button-browse-challenges">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse All Challenges
                    </Button>
                  </CardContent>
                </Card>
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
                      <div className="text-3xl font-bold text-purple-600">Level 7</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Quantum Collaborator</div>
                      <Progress value={72} className="h-2" />
                      <div className="text-xs text-gray-500">2,450 / 3,000 XP to Level 8</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-lg font-semibold text-blue-600">15</div>
                        <div className="text-xs text-gray-500">Achievements</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-semibold text-green-600">8</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                        <div className="text-lg font-semibold text-purple-600">2</div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                        <div className="text-lg font-semibold text-orange-600">92%</div>
                        <div className="text-xs text-gray-500">Success Rate</div>
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
                      { rank: 1, name: "Alice Chen", points: 3250, change: "+125" },
                      { rank: 2, name: "You", points: 2450, change: "+89", highlight: true },
                      { rank: 3, name: "Dr. Sarah Kim", points: 2380, change: "+67" },
                      { rank: 4, name: "Bob Wilson", points: 2156, change: "+45" },
                      { rank: 5, name: "John Doe", points: 1890, change: "+23" }
                    ].map((player) => (
                      <div key={player.rank} className={`flex items-center gap-3 p-2 rounded ${
                        player.highlight ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : ''
                      }`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          player.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                          player.rank === 2 ? 'bg-gray-100 text-gray-700' :
                          player.rank === 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {player.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{player.name}</div>
                          <div className="text-xs text-gray-500">{player.points} pts</div>
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
                    <Button className="w-full justify-start" variant="outline" size="sm" data-testid="button-daily-challenge">
                      <Star className="h-4 w-4 mr-2" />
                      Daily Challenge
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm" data-testid="button-team-formation">
                      <Users className="h-4 w-4 mr-2" />
                      Form Team
                    </Button>
                    <Button className="w-full justify-start" variant="outline" size="sm" data-testid="button-skill-assessment">
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
                      <div className="text-2xl font-bold text-green-600">87%</div>
                      <div className="text-xs text-gray-500">Team Efficiency</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">94%</div>
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
                      <div className="text-2xl font-bold text-purple-600">92%</div>
                      <div className="text-xs text-gray-500">Avg Fidelity</div>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">15s</div>
                      <div className="text-xs text-gray-500">Avg Runtime</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Most Used Algorithms:</div>
                    <div className="space-y-1">
                      {[
                        { name: "VQE", usage: 45, success: 94 },
                        { name: "QAOA", usage: 32, success: 87 },
                        { name: "Grover", usage: 15, success: 96 },
                        { name: "Shor", usage: 8, success: 89 }
                      ].map((algo) => (
                        <div key={algo.name} className="flex items-center justify-between text-xs">
                          <span>{algo.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{algo.usage}%</span>
                            <span className="text-green-600">{algo.success}% ✓</span>
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
                      <div className="text-2xl font-bold text-orange-600">67%</div>
                      <div className="text-xs text-gray-500">Efficiency</div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">$127</div>
                      <div className="text-xs text-gray-500">Monthly Cost</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Backend Usage:</div>
                    <div className="space-y-1">
                      {[
                        { backend: "ibm_cairo", jobs: 23, efficiency: 89 },
                        { backend: "ibm_brisbane", jobs: 18, efficiency: 76 },
                        { backend: "simulator", jobs: 45, efficiency: 98 }
                      ].map((hw) => (
                        <div key={hw.backend} className="flex items-center justify-between text-xs">
                          <span>{hw.backend}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{hw.jobs} jobs</span>
                            <span className={`${hw.efficiency > 85 ? 'text-green-600' : 'text-orange-600'}`}>
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
                      { metric: "Live Sessions", value: "+23%", trend: "up", description: "vs last week" },
                      { metric: "Code Reviews", value: "+15%", trend: "up", description: "vs last week" },
                      { metric: "Knowledge Sharing", value: "+8%", trend: "up", description: "vs last week" },
                      { metric: "Response Time", value: "-12%", trend: "down", description: "faster responses" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{item.metric}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        <div className={`text-sm font-bold ${
                          (item.trend === 'up' && !item.metric.includes('Time')) || 
                          (item.trend === 'down' && item.metric.includes('Time'))
                            ? 'text-green-600' : 'text-red-600'
                        }`}>
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
                      <div className="text-sm font-medium text-green-700 dark:text-green-300">Project Success</div>
                      <div className="text-2xl font-bold text-green-600">94%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        High probability of completing current VQE project by deadline
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Team Growth</div>
                      <div className="text-2xl font-bold text-blue-600">+2</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Optimal team size increase predicted for next month
                      </div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Innovation Score</div>
                      <div className="text-2xl font-bold text-purple-600">8.7/10</div>
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
                      description: "Collaboration efficiency can improve with weekly standup",
                      action: "Schedule Meeting"
                    },
                    {
                      priority: "medium",
                      title: "Optimize Hardware Usage",
                      description: "Switch to ibm_cairo for better cost efficiency",
                      action: "Update Schedule"
                    },
                    {
                      priority: "low",
                      title: "Documentation Update",
                      description: "VQE implementation needs better documentation",
                      action: "Add Docs"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              item.priority === 'high' ? 'bg-red-500' :
                              item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full" data-testid={`button-action-${idx}`}>
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
                        contributors: 3
                      },
                      {
                        title: "QAOA Parameter Landscape Analysis",
                        author: "John Doe", 
                        updated: "1 day ago",
                        tags: ["QAOA", "Parameters", "Analysis"],
                        contributors: 2
                      },
                      {
                        title: "Quantum Error Mitigation Techniques",
                        author: "Alice Chen",
                        updated: "3 days ago",
                        tags: ["Error Mitigation", "NISQ", "Fidelity"],
                        contributors: 4
                      }
                    ].map((doc, idx) => (
                      <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
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
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline" data-testid="button-create-research-doc">
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
                          hypothesis: "Combining VQE and QAOA improves optimization",
                          progress: 75,
                          team: ["Alice Chen", "Bob Wilson"],
                          status: "testing"
                        },
                        {
                          title: "Quantum Advantage in Max-Cut",
                          hypothesis: "Quantum algorithms show advantage for graphs >50 nodes",
                          progress: 40,
                          team: ["John Doe", "Emma Davis"],
                          status: "data-collection"
                        }
                      ].map((exp, idx) => (
                        <div key={idx} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-medium">{exp.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {exp.hypothesis}
                              </div>
                            </div>
                            <Badge variant={exp.status === 'testing' ? 'default' : 'secondary'} className="text-xs">
                              {exp.status.replace('-', ' ')}
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
                                  <Avatar key={midx} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                    <AvatarFallback className="text-xs">
                                      {member.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{exp.team.join(', ')}</span>
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
                    <Button className="w-full justify-start" variant="outline" data-testid="button-algorithm-generator">
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Algorithm Template Generator
                    </Button>
                    <Button className="w-full justify-start" variant="outline" data-testid="button-hypothesis-tracker">
                      <Target className="h-4 w-4 mr-2" />
                      Hypothesis Tracker
                    </Button>
                    <Button className="w-full justify-start" variant="outline" data-testid="button-comparison-tool">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Result Comparison Tool
                    </Button>
                    <Button className="w-full justify-start" variant="outline" data-testid="button-paper-generator">
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
                          <div className="font-medium text-blue-600">{msg.user}</div>
                          <div className="text-gray-700 dark:text-gray-300">{msg.message}</div>
                          <div className="text-xs text-gray-500">{formatDistanceToNow(msg.timestamp)} ago</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Ask about quantum research..." className="flex-1" data-testid="input-research-chat" />
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

        {/* 1. Research Chat Modal */}
        <Dialog open={showResearchChat} onOpenChange={setShowResearchChat}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Research Chat - Quantum Collaboration
              </DialogTitle>
              <DialogDescription>
                Real-time chat with team members, AI suggestions, and quantum research tools
              </DialogDescription>
            </DialogHeader>
            <div className="flex h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {mockQuantumChat.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                          {msg.user.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-blue-600 dark:text-blue-400">{msg.user}</span>
                          <span className="text-xs text-gray-500">{formatDistanceToNow(msg.timestamp)} ago</span>
                          <Badge variant={msg.type === 'algorithm' ? 'default' : msg.type === 'hardware' ? 'destructive' : 'secondary'} className="text-xs">
                            {msg.type}
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                        {msg.attachments && (
                          <div className="mt-2">
                            {msg.attachments.map((att, idx) => (
                              <div key={idx} className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900 p-2 rounded text-sm">
                                <FileText className="h-4 w-4" />
                                {att.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Share your quantum research insights..."
                      value={currentChatMessage}
                      onChange={(e) => setCurrentChatMessage(e.target.value)}
                      className="flex-1"
                      data-testid="input-chat-message"
                    />
                    <Button size="icon" data-testid="button-send-chat">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" data-testid="button-attach-file">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Sidebar */}
              <div className="w-80 border-l p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Online Members (5)
                  </h3>
                  <div className="space-y-2">
                    {["Alice Chen", "Bob Wilson", "Dr. Sarah Kim", "John Doe", "Emma Davis"].map((user, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{user}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Suggestions
                  </h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900 rounded text-sm">
                      💡 Consider testing VQE with 8 qubits for better convergence
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900 rounded text-sm">
                      🔬 Hardware reservation for ibm_cairo available at 3pm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2. Voice Chat Modal */}
        <Dialog open={showVoiceChat} onOpenChange={setShowVoiceChat}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Voice Chat - Quantum Research Room
              </DialogTitle>
              <DialogDescription>
                Real-time voice collaboration with your quantum research team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Voice Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  variant={isMuted ? "destructive" : "outline"}
                  onClick={() => setIsMuted(!isMuted)}
                  className="h-16 w-16 rounded-full"
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <Button
                  size="lg"
                  variant={isCameraOn ? "default" : "outline"}
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className="h-16 w-16 rounded-full"
                  data-testid="button-toggle-camera"
                >
                  {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={() => setShowVoiceChat(false)}
                  className="h-16 w-16 rounded-full"
                  data-testid="button-leave-call"
                >
                  <StopCircle className="h-6 w-6" />
                </Button>
              </div>

              {/* Participants Grid */}
              <div className="grid grid-cols-2 gap-4">
                {["Alice Chen (You)", "Bob Wilson", "Dr. Sarah Kim", "John Doe"].map((user, idx) => (
                  <div key={idx} className="relative bg-gray-900 rounded-lg h-40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-bold">{user.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <p className="text-sm">{user}</p>
                    </div>
                    {/* Mic status indicator */}
                    <div className={`absolute bottom-2 right-2 p-1 rounded ${idx === 1 ? 'bg-red-500' : 'bg-green-500'}`}>
                      {idx === 1 ? <MicOff className="h-3 w-3 text-white" /> : <Mic className="h-3 w-3 text-white" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat alongside voice */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Voice Chat Messages</h3>
                <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded p-2 text-sm space-y-1 overflow-y-auto">
                  <div><span className="font-medium">Bob:</span> Can everyone hear me clearly?</div>
                  <div><span className="font-medium">Alice:</span> Yes, perfect audio quality!</div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 3. Screen Share Modal */}
        <Dialog open={showScreenShare} onOpenChange={setShowScreenShare}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-500" />
                Screen Share - Quantum Circuit Collaboration
              </DialogTitle>
              <DialogDescription>
                Share and collaborate on quantum circuits in real-time
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Screen Share Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse">● LIVE</Badge>
                  <span className="text-sm text-gray-600">Alice Chen is sharing: Quantum Circuit Editor</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid="button-request-control">
                    <MousePointer className="h-4 w-4 mr-2" />
                    Request Control
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-fullscreen">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Shared Screen Content (Simulated) */}
              <div className="bg-gray-900 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
                <div className="text-center text-white z-10">
                  <div className="mb-4">
                    <div className="w-20 h-20 border-2 border-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Atom className="h-10 w-10 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Quantum Circuit Editor</h3>
                    <p className="text-gray-300 mt-2">VQE Circuit with 8 Qubits - Live Collaboration</p>
                  </div>
                  <div className="flex justify-center gap-8 text-sm">
                    <div>
                      <div className="text-blue-400 font-semibold">Circuit Depth</div>
                      <div>12 layers</div>
                    </div>
                    <div>
                      <div className="text-green-400 font-semibold">Gates</div>
                      <div>156 total</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-semibold">Fidelity</div>
                      <div>92.4%</div>
                    </div>
                  </div>
                </div>
                {/* Cursor indicators */}
                <div className="absolute top-16 left-32 flex items-center gap-1">
                  <MousePointer className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400 bg-black/50 px-1 rounded">Bob Wilson</span>
                </div>
              </div>

              {/* Participants and Chat */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Viewing Participants (3)</h3>
                  <div className="flex gap-2">
                    {["Bob Wilson", "Dr. Sarah Kim", "John Doe"].map((user, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {user}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Live Comments</h3>
                  <div className="h-20 bg-gray-50 dark:bg-gray-900 rounded p-2 text-sm space-y-1 overflow-y-auto">
                    <div><span className="font-medium text-blue-600">Bob:</span> Can we adjust the rotation angle on qubit 3?</div>
                    <div><span className="font-medium text-green-600">Sarah:</span> The current parameterization looks good!</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 4. Whiteboard Modal */}
        <Dialog open={showWhiteboard} onOpenChange={setShowWhiteboard}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-500" />
                Quantum Collaboration Whiteboard
              </DialogTitle>
              <DialogDescription>
                Draw quantum circuits, share ideas, and collaborate visually with your team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Whiteboard Tools */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={whiteboardTool === 'pen' ? 'default' : 'outline'}
                    onClick={() => setWhiteboardTool('pen')}
                    data-testid="button-pen-tool"
                  >
                    <PenTool className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={whiteboardTool === 'eraser' ? 'default' : 'outline'}
                    onClick={() => setWhiteboardTool('eraser')}
                    data-testid="button-eraser-tool"
                  >
                    <Eraser className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={whiteboardTool === 'circle' ? 'default' : 'outline'}
                    onClick={() => setWhiteboardTool('circle')}
                    data-testid="button-circle-tool"
                  >
                    <Circle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={whiteboardTool === 'square' ? 'default' : 'outline'}
                    onClick={() => setWhiteboardTool('square')}
                    data-testid="button-square-tool"
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={whiteboardTool === 'text' ? 'default' : 'outline'}
                    onClick={() => setWhiteboardTool('text')}
                    data-testid="button-text-tool"
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" data-testid="button-undo">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-redo">
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-clear-board">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" data-testid="button-save-whiteboard">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Whiteboard Canvas */}
              <div className="relative bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-96 overflow-hidden">
                {/* Simulated drawing content */}
                <div className="absolute inset-0 p-4">
                  <div className="text-gray-400 text-center mt-20">
                    <PenTool className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Quantum Whiteboard</h3>
                    <p className="text-sm mt-2">Start drawing quantum circuits, diagrams, or brainstorming ideas</p>
                  </div>
                  
                  {/* Sample quantum circuit drawn on whiteboard */}
                  <div className="absolute top-8 left-8 text-blue-600 dark:text-blue-400">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-4 h-4 border-2 border-current rounded-full"></div>
                      <div className="h-0.5 bg-current w-20"></div>
                      <div className="w-8 h-8 border-2 border-current flex items-center justify-center text-xs">H</div>
                      <div className="h-0.5 bg-current w-20"></div>
                    </div>
                    <div className="text-xs">|ψ⟩ = (|0⟩ + |1⟩)/√2</div>
                  </div>
                  
                  {/* Live cursors */}
                  <div className="absolute top-32 right-20 flex items-center gap-1">
                    <MousePointer className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 bg-white dark:bg-gray-800 px-1 py-0.5 rounded shadow">Alice Chen</span>
                  </div>
                </div>
              </div>

              {/* Collaboration Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    4 collaborators active
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Auto-save enabled
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {["Alice", "Bob", "Sarah", "John"].map((user, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                      {user[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 5. Smart Suggestions Modal */}
        <Dialog open={showSmartSuggestions} onOpenChange={setShowSmartSuggestions}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Smart Suggestions
              </DialogTitle>
              <DialogDescription>
                Intelligent recommendations to optimize your quantum research and collaboration
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
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Schedule team synchronization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Alice and Bob have overlapping availability for 3 hours today. Consider scheduling a joint research session on VQE optimization.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-apply-suggestion-1">Apply</Button>
                        <Button size="sm" variant="outline" data-testid="button-dismiss-suggestion-1">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Knowledge sharing opportunity</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Dr. Sarah Kim has expertise in quantum error correction that could benefit the current project. Suggest adding her to the research chat.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-invite-expert">Invite Sarah</Button>
                        <Button size="sm" variant="outline" data-testid="button-learn-more">Learn More</Button>
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
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">!</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Circuit depth reduction available</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your current VQE circuit can be optimized to reduce depth by 23% while maintaining fidelity above 90%. This would improve noise resilience.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-optimize-circuit">Auto-Optimize</Button>
                        <Button size="sm" variant="outline" data-testid="button-show-comparison">Show Comparison</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">⚡</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Hardware-optimized parameters</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Based on ibm_cairo's calibration data, adjusting rotation angles by 12° would improve gate fidelity for your specific circuit.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-apply-calibration">Apply Parameters</Button>
                        <Button size="sm" variant="outline" data-testid="button-schedule-test">Schedule Test</Button>
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
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">$</div>
                    <div className="flex-1">
                      <h4 className="font-medium">Cost-efficient hardware scheduling</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Running your experiment at 2 AM UTC (off-peak hours) would reduce costs by 40% and provide better queue priority.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" data-testid="button-schedule-optimal">Schedule Optimal Time</Button>
                        <Button size="sm" variant="outline" data-testid="button-view-pricing">View Pricing</Button>
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
                    AI continuously analyzes your workflow for optimization opportunities
                  </span>
                </div>
                <Button size="sm" variant="outline" data-testid="button-configure-ai">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure AI
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 6. Team Analytics Modal */}
        <Dialog open={showTeamAnalytics} onOpenChange={setShowTeamAnalytics}>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Team Analytics Dashboard
              </DialogTitle>
              <DialogDescription>
                Comprehensive analytics and insights about your team's quantum research collaboration
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
                    <div className="text-2xl font-bold text-purple-500">156h</div>
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
                      <p className="text-sm text-gray-600">Interactive performance charts</p>
                      <p className="text-xs text-gray-500">7-day trending data</p>
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
                    {["Alice Chen", "Bob Wilson", "Dr. Sarah Kim", "John Doe", "Emma Davis"].map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                              {member.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-500">{12 + idx * 5}</div>
                            <div className="text-gray-500">Commits</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-500">{3 + idx * 2}</div>
                            <div className="text-gray-500">Projects</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-purple-500">{85 + idx * 3}%</div>
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
          <DialogContent className="max-w-5xl max-h-[90vh]">
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
                    <Badge variant="default" className="bg-green-500">Approved</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Code Quality Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Code Quality</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-32" />
                      <span className="text-sm font-semibold text-green-600">87/100</span>
                    </div>
                  </div>

                  {/* Review Items */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-700 dark:text-green-300">Excellent quantum circuit structure</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Your VQE ansatz implementation follows quantum computing best practices with proper gate sequencing and parameterization.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-700 dark:text-yellow-300">Minor optimization opportunity</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Line 45: Consider using hardware-efficient gate decomposition for better NISQ performance.
                        </p>
                        <Button size="sm" className="mt-2" data-testid="button-apply-fix">
                          Apply Suggested Fix
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-700 dark:text-blue-300">Performance enhancement suggestion</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Your gradient computation could be 23% faster with parameter-shift rule optimization.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Code Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-500">156</div>
                      <div className="text-sm text-gray-600">Lines of Code</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-500">94%</div>
                      <div className="text-sm text-gray-600">Test Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-500">A+</div>
                      <div className="text-sm text-gray-600">Maintainability</div>
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
                      { file: "QAOA_maxcut.py", score: 92, status: "approved", time: "2h ago" },
                      { file: "quantum_teleportation.py", score: 78, status: "needs_review", time: "5h ago" },
                      { file: "error_mitigation.py", score: 95, status: "approved", time: "1d ago" }
                    ].map((review, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="font-mono text-sm">{review.file}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold">{review.score}/100</span>
                          <Badge variant={review.status === 'approved' ? 'default' : 'secondary'}>
                            {review.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">{review.time}</span>
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
          <DialogContent className="max-w-4xl max-h-[80vh]">
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
                        description: "Successfully executed your first VQE algorithm", 
                        icon: Rocket, 
                        rarity: "rare", 
                        points: 500,
                        unlocked: true,
                        date: "2 days ago"
                      },
                      { 
                        name: "Circuit Master", 
                        description: "Optimized a quantum circuit to reduce depth by >20%", 
                        icon: Lightning, 
                        rarity: "epic", 
                        points: 1000,
                        unlocked: true,
                        date: "1 week ago"
                      },
                      { 
                        name: "Collaboration Expert", 
                        description: "Completed 10 successful team projects", 
                        icon: Users, 
                        rarity: "legendary", 
                        points: 2500,
                        unlocked: false,
                        progress: 7
                      },
                      { 
                        name: "Quantum Debugger", 
                        description: "Fixed critical errors in quantum algorithms", 
                        icon: Shield, 
                        rarity: "common", 
                        points: 200,
                        unlocked: true,
                        date: "3 days ago"
                      }
                    ].map((achievement, idx) => (
                      <Card key={idx} className={`relative overflow-hidden ${achievement.unlocked ? '' : 'opacity-60'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                              achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                              achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                              'bg-gradient-to-br from-gray-400 to-gray-500'
                            }`}>
                              <achievement.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold flex items-center gap-2">
                                {achievement.name}
                                {achievement.unlocked && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge variant={
                                  achievement.rarity === 'legendary' ? 'default' :
                                  achievement.rarity === 'epic' ? 'secondary' :
                                  achievement.rarity === 'rare' ? 'outline' : 'secondary'
                                } className="text-xs">
                                  {achievement.rarity}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm">
                                  <Flame className="h-3 w-3 text-orange-500" />
                                  <span className="font-semibold">{achievement.points} pts</span>
                                </div>
                              </div>
                              {achievement.unlocked && achievement.date && (
                                <div className="text-xs text-gray-500 mt-2">Unlocked {achievement.date}</div>
                              )}
                              {!achievement.unlocked && achievement.progress && (
                                <div className="mt-2">
                                  <div className="flex justify-between text-xs mb-1">
                                    <span>Progress</span>
                                    <span>{achievement.progress}/10</span>
                                  </div>
                                  <Progress value={achievement.progress * 10} className="h-1" />
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
                    <h3 className="text-lg font-semibold">Team Collaboration Achievements</h3>
                    <p className="text-gray-600 mt-2">Unlock achievements by working together on quantum projects</p>
                  </div>
                </TabsContent>

                <TabsContent value="research">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Research Milestones</h3>
                    <p className="text-gray-600 mt-2">Achievements for scientific contributions and discoveries</p>
                  </div>
                </TabsContent>

                <TabsContent value="mastery">
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Quantum Mastery</h3>
                    <p className="text-gray-600 mt-2">Expert-level achievements for quantum computing mastery</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* 9. Active Challenges Modal */}
        <Dialog open={showActiveChallenges} onOpenChange={setShowActiveChallenges}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-500" />
                Active Quantum Challenges
              </DialogTitle>
              <DialogDescription>
                Compete in quantum computing challenges and advance your skills
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {/* Challenge Categories */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Puzzle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-semibold">Algorithm</div>
                    <div className="text-sm text-gray-600">5 active</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="font-semibold">Team</div>
                    <div className="text-sm text-gray-600">2 active</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-4">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="font-semibold">Competition</div>
                    <div className="text-sm text-gray-600">1 active</div>
                  </CardContent>
                </Card>
              </div>

              {/* Active Challenges List */}
              <div className="space-y-4">
                {[
                  {
                    name: "VQE Optimization Challenge",
                    description: "Optimize a VQE algorithm to achieve >95% accuracy with minimum circuit depth",
                    difficulty: "Expert",
                    participants: 156,
                    timeLeft: "5 days",
                    reward: 5000,
                    progress: 65,
                    status: "in_progress"
                  },
                  {
                    name: "Quantum Error Correction",
                    description: "Implement and test a surface code error correction scheme",
                    difficulty: "Advanced",
                    participants: 89,
                    timeLeft: "12 days",
                    reward: 3500,
                    progress: 0,
                    status: "available"
                  },
                  {
                    name: "Team Circuit Design",
                    description: "Collaborate with 2+ members to design an efficient QAOA circuit",
                    difficulty: "Intermediate",
                    participants: 234,
                    timeLeft: "8 days",
                    reward: 2000,
                    progress: 30,
                    status: "in_progress"
                  }
                ].map((challenge, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{challenge.name}</h3>
                            <Badge variant={
                              challenge.difficulty === 'Expert' ? 'destructive' :
                              challenge.difficulty === 'Advanced' ? 'default' :
                              'secondary'
                            }>
                              {challenge.difficulty}
                            </Badge>
                            {challenge.status === 'in_progress' && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
                          
                          {challenge.status === 'in_progress' && (
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Your Progress</span>
                                <span>{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-2" />
                            </div>
                          )}

                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{challenge.participants} participants</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{challenge.timeLeft} left</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="font-semibold">{challenge.reward.toLocaleString()} pts</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Button 
                            data-testid={`button-${challenge.status === 'in_progress' ? 'continue' : 'join'}-challenge-${idx}`}
                            className="mb-2"
                          >
                            {challenge.status === 'in_progress' ? 'Continue' : 'Join Challenge'}
                          </Button>
                          <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-details-${idx}`}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* 10. Team Leaderboard Modal */}
        <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
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
                      { name: "Dr. Sarah Kim", points: 8750, level: 12, streak: 28, rank: 1, change: "up" },
                      { name: "Alice Chen", points: 7200, level: 10, streak: 15, rank: 2, change: "same" },
                      { name: "Bob Wilson", points: 6800, level: 9, streak: 12, rank: 3, change: "down" },
                      { name: "John Doe", points: 5500, level: 8, streak: 8, rank: 4, change: "up" },
                      { name: "Emma Davis", points: 4900, level: 7, streak: 5, rank: 5, change: "up" },
                    ].map((member, idx) => (
                      <Card key={idx} className={`${idx < 3 ? 'ring-2 ring-yellow-200 dark:ring-yellow-800' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Rank Badge */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {member.rank}
                              </div>
                              
                              {/* Member Info */}
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold flex items-center gap-2">
                                    {member.name}
                                    {idx < 3 && <Crown className="h-4 w-4 text-yellow-500" />}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Level {member.level} • {member.streak} day streak
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Points and Change */}
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{member.points.toLocaleString()}</div>
                              <div className={`text-sm flex items-center gap-1 ${
                                member.change === 'up' ? 'text-green-600' : 
                                member.change === 'down' ? 'text-red-600' : 
                                'text-gray-500'
                              }`}>
                                {member.change === 'up' && '↗'} 
                                {member.change === 'down' && '↘'} 
                                {member.change === 'same' && '—'}
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
                    <h3 className="text-lg font-semibold">Contribution Rankings</h3>
                    <p className="text-gray-600 mt-2">Based on commits, reviews, and collaboration</p>
                  </div>
                </TabsContent>

                <TabsContent value="achievements">
                  <div className="text-center py-8">
                    <Medal className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Achievement Leaders</h3>
                    <p className="text-gray-600 mt-2">Top performers in quantum achievements</p>
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">This Month's Champions</h3>
                    <p className="text-gray-600 mt-2">September 2025 leaderboard</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* 11. Learning Path Modal */}
        <Dialog open={showLearningPath} onOpenChange={setShowLearningPath}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                Quantum Learning Path
              </DialogTitle>
              <DialogDescription>
                Structured learning journey to master quantum computing and collaboration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[700px] overflow-y-auto">
              {/* Progress Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your Learning Progress</h3>
                    <Badge variant="default" className="bg-indigo-500">Advanced Level</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Overall Completion</span>
                      <span>73% (11/15 modules)</span>
                    </div>
                    <Progress value={73} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-500">11</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-500">2</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-500">2</div>
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
                    description: "Master the basics of qubits, superposition, and entanglement",
                    modules: ["Qubit States", "Quantum Gates", "Measurement", "Entanglement"],
                    completed: 4,
                    total: 4,
                    status: "completed",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Quantum Algorithms",
                    description: "Learn key quantum algorithms and their implementations",
                    modules: ["Deutsch Algorithm", "Grover Search", "Shor's Algorithm", "VQE"],
                    completed: 3,
                    total: 4,
                    status: "in_progress",
                    difficulty: "Intermediate"
                  },
                  {
                    title: "Quantum Machine Learning",
                    description: "Explore the intersection of quantum computing and ML",
                    modules: ["Quantum Features", "QSVM", "Quantum Neural Networks", "Hybrid Models"],
                    completed: 2,
                    total: 4,
                    status: "in_progress",
                    difficulty: "Advanced"
                  },
                  {
                    title: "NISQ Programming",
                    description: "Programming for Noisy Intermediate-Scale Quantum devices",
                    modules: ["Error Mitigation", "Circuit Optimization", "Hardware Constraints", "Benchmarking"],
                    completed: 2,
                    total: 4,
                    status: "available",
                    difficulty: "Expert"
                  },
                  {
                    title: "Quantum Collaboration",
                    description: "Advanced teamwork and collaboration in quantum research",
                    modules: ["Team Protocols", "Shared Resources", "Peer Review", "Knowledge Sharing"],
                    completed: 0,
                    total: 4,
                    status: "locked",
                    difficulty: "Expert"
                  }
                ].map((path, idx) => (
                  <Card key={idx} className={`${path.status === 'locked' ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{path.title}</h3>
                            <Badge variant={
                              path.status === 'completed' ? 'default' :
                              path.status === 'in_progress' ? 'secondary' :
                              path.status === 'locked' ? 'outline' : 'outline'
                            }>
                              {path.difficulty}
                            </Badge>
                            {path.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                            {path.status === 'locked' && <Lock className="h-5 w-5 text-gray-400" />}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{path.completed}/{path.total} modules</span>
                            </div>
                            <Progress value={(path.completed / path.total) * 100} className="h-2" />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {path.modules.map((module, midx) => (
                              <Badge key={midx} variant={
                                midx < path.completed ? 'default' :
                                midx === path.completed && path.status === 'in_progress' ? 'secondary' :
                                'outline'
                              } className="text-xs">
                                {midx < path.completed && '✓ '}
                                {module}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <Button 
                            disabled={path.status === 'locked'}
                            data-testid={`button-${path.status === 'completed' ? 'review' : path.status === 'in_progress' ? 'continue' : 'start'}-path-${idx}`}
                            className="mb-2"
                          >
                            {path.status === 'completed' ? 'Review' : 
                             path.status === 'in_progress' ? 'Continue' : 
                             path.status === 'locked' ? 'Locked' : 'Start'}
                          </Button>
                          {path.status !== 'locked' && (
                            <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-curriculum-${idx}`}>
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
                        <div className="text-sm text-gray-600">Finish the last module in Quantum Algorithms</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Join Study Group</div>
                        <div className="text-sm text-gray-600">Connect with peers learning Quantum ML</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
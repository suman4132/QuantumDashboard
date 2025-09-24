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
  Fingerprint
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
                onClick={() => setShowQuantumChat(!showQuantumChat)}
                className="flex items-center gap-2"
                data-testid="button-quantum-chat"
              >
                <MessageSquare className="h-4 w-4" />
                Research Chat
                {showQuantumChat && <div className="w-2 h-2 bg-green-500 rounded-full" />}
              </Button>
              <Button 
                variant={isVoiceChatActive ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsVoiceChatActive(!isVoiceChatActive)}
                className="flex items-center gap-2"
                data-testid="button-voice-chat"
              >
                {isVoiceChatActive ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                Voice Chat
              </Button>
              <Button 
                variant={isScreenSharing ? "default" : "outline"} 
                size="sm" 
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="flex items-center gap-2"
                data-testid="button-screen-share"
              >
                <ScreenShare className="h-4 w-4" />
                Share Screen
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
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
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="flex items-center gap-2"
                data-testid="button-ai-insights"
              >
                <Lightbulb className="h-4 w-4" />
                Smart Suggestions
                {aiRecommendations > 0 && <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">{aiRecommendations}</Badge>}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2"
                data-testid="button-analytics"
              >
                <BarChart3 className="h-4 w-4" />
                Team Analytics
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                data-testid="button-ai-reviewer"
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
              onClick={() => setShowGamification(!showGamification)}
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
              className="flex items-center gap-2"
              data-testid="button-challenges"
            >
              <Target className="h-4 w-4" />
              Active Challenges
              <Badge variant="secondary" className="ml-1 px-2 py-1 text-xs">{challengesInProgress} in progress</Badge>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              data-testid="button-leaderboard"
            >
              <TrendingUp className="h-4 w-4" />
              Team Leaderboard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
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
      </div>
    </div>
  );
}
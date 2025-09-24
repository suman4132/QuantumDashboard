import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Zap,
  BrainCircuit,
  FlaskConical,
  Cpu,
  Clock,
  Users,
  Activity,
  Settings,
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Share2,
  Plus,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  TrendingUp,
  Target,
  Layers,
  Network,
  Timer,
  BookOpen,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Bell,
  Star,
  Atom,
  CircuitBoard,
  Sparkles,
  BarChart3,
  MapPin,
  Gauge,
  HelpCircle,
  Lightbulb,
  Monitor,
  Workflow,
  Database,
  Shield,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  List,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
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
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/dashboard/header";
import { formatDistanceToNow } from "date-fns";

// Mock data for hardware backends
const mockBackends = [
  {
    id: "ibm_cairo",
    name: "IBM Cairo",
    qubits: 27,
    status: "available",
    queueLength: 12,
    averageWaitTime: 45,
    uptime: "99.2%",
    fidelity: 0.94,
    connectivity: "heavy-hex",
    location: "Yorktown Heights, NY",
    currentJobs: 3,
    maxJobs: 20,
  },
  {
    id: "ibm_brisbane",
    name: "IBM Brisbane",
    qubits: 127,
    status: "busy",
    queueLength: 45,
    averageWaitTime: 120,
    uptime: "98.7%",
    fidelity: 0.92,
    connectivity: "heavy-hex",
    location: "Brisbane, Australia",
    currentJobs: 18,
    maxJobs: 20,
  },
  {
    id: "ibm_sherbrooke",
    name: "IBM Sherbrooke",
    qubits: 127,
    status: "maintenance",
    queueLength: 0,
    averageWaitTime: 0,
    uptime: "97.5%",
    fidelity: 0.91,
    connectivity: "heavy-hex",
    location: "Montreal, Canada",
    currentJobs: 0,
    maxJobs: 20,
  },
  {
    id: "simulator",
    name: "Quantum Simulator",
    qubits: 32,
    status: "available",
    queueLength: 0,
    averageWaitTime: 0,
    uptime: "100%",
    fidelity: 1.0,
    connectivity: "all-to-all",
    location: "Cloud",
    currentJobs: 156,
    maxJobs: 1000,
  },
];

// Mock hardware reservations
const mockReservations = [
  {
    id: "res-1",
    backend: "ibm_cairo",
    user: "Alice Chen",
    workspace: "Quantum ML Research",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    duration: 120,
    purpose: "VQE Parameter Optimization",
    status: "confirmed",
    priority: "high",
    estimatedCost: "$45.00",
  },
  {
    id: "res-2",
    backend: "ibm_brisbane",
    user: "John Doe",
    workspace: "Optimization Algorithms",
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 7.5 * 60 * 60 * 1000),
    duration: 90,
    purpose: "QAOA Circuit Testing",
    status: "pending",
    priority: "medium",
    estimatedCost: "$67.50",
  },
  {
    id: "res-3",
    backend: "ibm_cairo",
    user: "Dr. Sarah Kim",
    workspace: "Quantum Cryptography",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    duration: 120,
    purpose: "Quantum Key Distribution Testing",
    status: "scheduled",
    priority: "low",
    estimatedCost: "$45.00",
  },
];

// Mock live circuits being edited
const mockLiveCircuits = [
  {
    id: "circuit-1",
    name: "Variational Quantum Eigensolver",
    owner: "Alice Chen",
    collaborators: [
      { name: "Bob Wilson", status: "editing", cursor: { x: 45, y: 120 } },
      { name: "Dr. Sarah Kim", status: "viewing", cursor: null },
    ],
    qubits: 8,
    gates: 156,
    depth: 12,
    lastModified: new Date(Date.now() - 5 * 60 * 1000),
    status: "editing",
    backend: "ibm_cairo",
    estimatedRuntime: "25 minutes",
  },
  {
    id: "circuit-2",
    name: "QAOA Max-Cut Circuit",
    owner: "John Doe",
    collaborators: [
      { name: "Emma Davis", status: "editing", cursor: { x: 200, y: 80 } },
    ],
    qubits: 6,
    gates: 89,
    depth: 8,
    lastModified: new Date(Date.now() - 10 * 60 * 1000),
    status: "testing",
    backend: "simulator",
    estimatedRuntime: "5 minutes",
  },
  {
    id: "circuit-3",
    name: "Quantum Teleportation Protocol",
    owner: "Dr. Alex Moore",
    collaborators: [],
    qubits: 3,
    gates: 24,
    depth: 6,
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "draft",
    backend: null,
    estimatedRuntime: "1 minute",
  },
];

// Mock active experiments
const mockExperiments = [
  {
    id: "exp-1",
    title: "VQE Ground State Convergence Analysis",
    description: "Testing convergence rates with different ansatz depths",
    owner: "Alice Chen",
    workspace: "Quantum ML Research",
    status: "running",
    progress: 75,
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    estimatedCompletion: new Date(Date.now() + 1 * 60 * 60 * 1000),
    circuits: 5,
    jobsCompleted: 45,
    totalJobs: 60,
    currentBackend: "ibm_cairo",
    hypothesis: "Deeper ansatz circuits will converge faster to ground state",
    methodology: "Parameter sweep with depth 4, 8, 12, 16, 20",
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
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    estimatedCompletion: null,
    circuits: 3,
    jobsCompleted: 24,
    totalJobs: 60,
    currentBackend: null,
    hypothesis: "Real hardware shows better performance than simulation for QAOA",
    methodology: "Same circuit on simulator, ibm_cairo, and ibm_brisbane",
    tags: ["QAOA", "benchmarking", "hardware"],
  },
  {
    id: "exp-3",
    title: "Quantum Error Mitigation Study",
    description: "Testing different error mitigation techniques",
    owner: "Dr. Sarah Kim",
    workspace: "Quantum ML Research",
    status: "completed",
    progress: 100,
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    estimatedCompletion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    circuits: 8,
    jobsCompleted: 120,
    totalJobs: 120,
    currentBackend: "ibm_brisbane",
    hypothesis: "Zero-noise extrapolation improves fidelity by >10%",
    methodology: "Compare readout error mitigation, ZNE, and symmetry verification",
    tags: ["error-mitigation", "fidelity", "ZNE"],
  },
  {
    id: "exp-4",
    title: "Quantum Speedup Verification",
    description: "Measuring quantum advantage in optimization problems",
    owner: "Emma Davis",
    workspace: "Optimization Algorithms",
    status: "planning",
    progress: 5,
    startTime: null,
    estimatedCompletion: null,
    circuits: 0,
    jobsCompleted: 0,
    totalJobs: 200,
    currentBackend: null,
    hypothesis: "Quantum algorithms show quadratic speedup for specific problem sizes",
    methodology: "Time classical vs quantum solutions for graph problems",
    tags: ["speedup", "complexity", "graphs"],
  },
  {
    id: "exp-5",
    title: "Quantum Machine Learning Benchmarks",
    description: "Evaluating QML algorithms on classification tasks",
    owner: "Mike Thompson",
    workspace: "Quantum ML Research",
    status: "running",
    progress: 60,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedCompletion: new Date(Date.now() + 3 * 60 * 60 * 1000),
    circuits: 12,
    jobsCompleted: 72,
    totalJobs: 120,
    currentBackend: "ibm_brisbane",
    hypothesis: "Variational quantum classifiers outperform classical SVMs",
    methodology: "Compare VQC, QNN, and classical ML on Iris, Wine datasets",
    tags: ["QML", "classification", "VQC"],
  },
];

export default function QuantumHardware() {
  const [activeTab, setActiveTab] = useState("scheduler");
  const [selectedBackend, setSelectedBackend] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Modal states
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [showCircuitEditor, setShowCircuitEditor] = useState(false);
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [showResourceOptimizer, setShowResourceOptimizer] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  // Form states
  const [newReservationData, setNewReservationData] = useState({
    backend: "",
    startTime: "",
    duration: 60,
    purpose: "",
    priority: "medium",
  });

  const [newExperimentData, setNewExperimentData] = useState({
    title: "",
    description: "",
    hypothesis: "",
    methodology: "",
    workspace: "",
    estimatedDuration: 120,
    circuits: 1,
    tags: "",
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    // Handle refresh interval change
  };

  const handleManualRefresh = () => {
    // Handle manual refresh
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "busy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "maintenance":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "planning":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
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
                <Cpu className="h-8 w-8 text-orange-500" />
                Quantum Hardware & Resources
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Manage quantum hardware, optimize resources, edit circuits, and track experiments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                data-testid="button-toggle-view"
              >
                {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                data-testid="button-refresh-data"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Available Backends
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockBackends.filter(b => b.status === "available").length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Reservations
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {mockReservations.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Live Circuits
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {mockLiveCircuits.filter(c => c.status === "editing").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <BrainCircuit className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Running Experiments
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mockExperiments.filter(e => e.status === "running").length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <FlaskConical className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="scheduler" data-testid="tab-smart-scheduler">
              <Calendar className="h-4 w-4 mr-2" />
              Smart Scheduler
            </TabsTrigger>
            <TabsTrigger value="optimizer" data-testid="tab-resource-optimizer">
              <Zap className="h-4 w-4 mr-2" />
              Resource Optimizer
            </TabsTrigger>
            <TabsTrigger value="circuits" data-testid="tab-live-circuits">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Live Circuits
            </TabsTrigger>
            <TabsTrigger value="experiments" data-testid="tab-experiments">
              <FlaskConical className="h-4 w-4 mr-2" />
              Experiments
            </TabsTrigger>
          </TabsList>

          {/* Smart Scheduler Tab */}
          <TabsContent value="scheduler">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Scheduler Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Smart Hardware Scheduler
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Intelligent scheduling with optimal resource allocation
                  </p>
                </div>
                <Dialog open={showNewReservation} onOpenChange={setShowNewReservation}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-new-reservation">
                      <Plus className="h-4 w-4 mr-2" />
                      New Reservation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Hardware Reservation</DialogTitle>
                      <DialogDescription>
                        Reserve quantum hardware for your experiments and research.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="backend">Quantum Backend</Label>
                        <Select
                          value={newReservationData.backend}
                          onValueChange={(value) =>
                            setNewReservationData({ ...newReservationData, backend: value })
                          }
                        >
                          <SelectTrigger data-testid="select-backend">
                            <SelectValue placeholder="Select a backend" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockBackends
                              .filter(b => b.status === "available")
                              .map(backend => (
                                <SelectItem key={backend.id} value={backend.id}>
                                  {backend.name} ({backend.qubits} qubits)
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="datetime-local"
                          value={newReservationData.startTime}
                          onChange={(e) =>
                            setNewReservationData({ ...newReservationData, startTime: e.target.value })
                          }
                          data-testid="input-start-time"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Slider
                          value={[newReservationData.duration]}
                          onValueChange={(value) =>
                            setNewReservationData({ ...newReservationData, duration: value[0] })
                          }
                          min={30}
                          max={480}
                          step={30}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-500 mt-1">
                          {newReservationData.duration} minutes (${(newReservationData.duration * 0.375).toFixed(2)} estimated cost)
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="purpose">Purpose</Label>
                        <Textarea
                          id="purpose"
                          placeholder="Describe your experiment or research purpose..."
                          value={newReservationData.purpose}
                          onChange={(e) =>
                            setNewReservationData({ ...newReservationData, purpose: e.target.value })
                          }
                          data-testid="textarea-purpose"
                        />
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newReservationData.priority}
                          onValueChange={(value) =>
                            setNewReservationData({ ...newReservationData, priority: value })
                          }
                        >
                          <SelectTrigger data-testid="select-priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="high">High Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewReservation(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowNewReservation(false)}
                        data-testid="button-confirm-reservation"
                      >
                        Schedule Reservation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Backend Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockBackends.map((backend) => (
                  <motion.div
                    key={backend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedBackend === backend.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedBackend(backend.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{backend.name}</CardTitle>
                          <Badge className={getStatusColor(backend.status)}>
                            {backend.status}
                          </Badge>
                        </div>
                        <CardDescription>{backend.qubits} qubits • {backend.connectivity}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Queue:</span>
                            <span className="font-medium ml-1">{backend.queueLength}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Wait:</span>
                            <span className="font-medium ml-1">{backend.averageWaitTime}min</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Uptime:</span>
                            <span className="font-medium ml-1">{backend.uptime}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Fidelity:</span>
                            <span className="font-medium ml-1">{(backend.fidelity * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Utilization</span>
                            <span>{backend.currentJobs}/{backend.maxJobs}</span>
                          </div>
                          <Progress
                            value={(backend.currentJobs / backend.maxJobs) * 100}
                            className="h-2"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {backend.location}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Current Reservations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                    Current Reservations
                  </CardTitle>
                  <CardDescription>
                    Manage your quantum hardware reservations and scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Cpu className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{reservation.purpose}</div>
                            <div className="text-sm text-gray-500">
                              {reservation.backend} • {reservation.user} • {reservation.workspace}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDistanceToNow(reservation.startTime)} • {reservation.duration}min • {reservation.estimatedCost}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                          <Badge className={getPriorityColor(reservation.priority)}>
                            {reservation.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit Reservation
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Resource Optimizer Tab */}
          <TabsContent value="optimizer">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Resource Optimizer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI-powered optimization for efficient resource utilization
                  </p>
                </div>
                <Button
                  onClick={() => setShowResourceOptimizer(true)}
                  data-testid="button-optimize-resources"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run Optimization
                </Button>
              </div>

              {/* Optimization Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Cost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="font-medium text-green-900 dark:text-green-100">
                          Switch to Simulator for Development
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Use quantum simulator for circuit development and testing. Switch to real hardware only for final validation.
                        </div>
                        <div className="text-sm font-medium text-green-600 mt-2">
                          Potential savings: $200/month
                        </div>
                      </div>
                      <Button size="sm" className="w-full">
                        Apply Recommendation
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Performance Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="font-medium text-blue-900 dark:text-blue-100">
                          Optimize Queue Scheduling
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Schedule jobs during off-peak hours (2-6 AM EST) for 40% faster execution.
                        </div>
                        <div className="text-sm font-medium text-blue-600 mt-2">
                          Time savings: 2-3 hours/day
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        View Schedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      Efficiency Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="font-medium text-purple-900 dark:text-purple-100">
                          Batch Similar Experiments
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                          Group VQE experiments with similar parameters to reduce setup overhead by 30%.
                        </div>
                        <div className="text-sm font-medium text-purple-600 mt-2">
                          Efficiency gain: 30%
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Auto-Batch Jobs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resource Usage Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    Resource Usage Analytics
                  </CardTitle>
                  <CardDescription>
                    Historical usage patterns and optimization opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Weekly Usage
                      </div>
                      <div className="text-2xl font-bold">42.5 hours</div>
                      <div className="text-sm text-green-600">+12% from last week</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Cost Efficiency
                      </div>
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-sm text-yellow-600">Can improve by 15%</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Success Rate
                      </div>
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-sm text-green-600">Above average</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Live Circuit Editor Tab */}
          <TabsContent value="circuits">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Live Circuit Editor
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Real-time collaborative quantum circuit design and simulation
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCircuitEditor(true)}
                    data-testid="button-new-circuit"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Circuit
                  </Button>
                  <Button data-testid="button-open-editor">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Full Editor
                  </Button>
                </div>
              </div>

              {/* Live Circuits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLiveCircuits.map((circuit) => (
                  <motion.div
                    key={circuit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all duration-200"
                      onClick={() => setSelectedCircuit(circuit.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{circuit.name}</CardTitle>
                            <CardDescription>by {circuit.owner}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(circuit.status)}>
                            {circuit.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Circuit Stats */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-blue-600">{circuit.qubits}</div>
                            <div className="text-gray-500">Qubits</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">{circuit.gates}</div>
                            <div className="text-gray-500">Gates</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-purple-600">{circuit.depth}</div>
                            <div className="text-gray-500">Depth</div>
                          </div>
                        </div>

                        {/* Active Collaborators */}
                        {circuit.collaborators.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Active Collaborators
                            </div>
                            <div className="space-y-1">
                              {circuit.collaborators.map((collaborator, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      collaborator.status === "editing"
                                        ? "bg-green-500 animate-pulse"
                                        : "bg-blue-500"
                                    }`}
                                  />
                                  <span>{collaborator.name}</span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5"
                                  >
                                    {collaborator.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Circuit Info */}
                        <div className="space-y-1 text-sm text-gray-500">
                          <div>
                            Last modified: {formatDistanceToNow(circuit.lastModified)} ago
                          </div>
                          {circuit.backend && (
                            <div>Target: {circuit.backend}</div>
                          )}
                          <div>
                            Estimated runtime: {circuit.estimatedRuntime}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Edit3 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Circuit Editor Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircuitBoard className="h-5 w-5 text-blue-500" />
                    Circuit Editor Preview
                  </CardTitle>
                  <CardDescription>
                    Quick circuit visualization and editing tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <CircuitBoard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <div className="text-lg font-medium mb-2">Interactive Circuit Editor</div>
                      <div className="text-sm">
                        Select a circuit above or create a new one to start editing
                      </div>
                      <Button className="mt-4" onClick={() => setShowCircuitEditor(true)}>
                        Open Circuit Editor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Experiment Tracker Tab */}
          <TabsContent value="experiments">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Experiment Tracker
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage and track your quantum research experiments
                  </p>
                </div>
                <Dialog open={showExperimentModal} onOpenChange={setShowExperimentModal}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-new-experiment">
                      <Plus className="h-4 w-4 mr-2" />
                      New Experiment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Experiment</DialogTitle>
                      <DialogDescription>
                        Set up a new quantum research experiment with hypothesis tracking.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="exp-title">Experiment Title</Label>
                          <Input
                            id="exp-title"
                            placeholder="e.g., VQE Ground State Analysis"
                            value={newExperimentData.title}
                            onChange={(e) =>
                              setNewExperimentData({ ...newExperimentData, title: e.target.value })
                            }
                            data-testid="input-experiment-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exp-workspace">Workspace</Label>
                          <Select
                            value={newExperimentData.workspace}
                            onValueChange={(value) =>
                              setNewExperimentData({ ...newExperimentData, workspace: value })
                            }
                          >
                            <SelectTrigger data-testid="select-experiment-workspace">
                              <SelectValue placeholder="Select workspace" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quantum-ml">Quantum ML Research</SelectItem>
                              <SelectItem value="optimization">Optimization Algorithms</SelectItem>
                              <SelectItem value="cryptography">Quantum Cryptography</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="exp-description">Description</Label>
                        <Textarea
                          id="exp-description"
                          placeholder="Describe your experiment goals and methodology..."
                          value={newExperimentData.description}
                          onChange={(e) =>
                            setNewExperimentData({ ...newExperimentData, description: e.target.value })
                          }
                          data-testid="textarea-experiment-description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-hypothesis">Hypothesis</Label>
                        <Textarea
                          id="exp-hypothesis"
                          placeholder="State your research hypothesis..."
                          value={newExperimentData.hypothesis}
                          onChange={(e) =>
                            setNewExperimentData({ ...newExperimentData, hypothesis: e.target.value })
                          }
                          data-testid="textarea-experiment-hypothesis"
                        />
                      </div>
                      <div>
                        <Label htmlFor="exp-methodology">Methodology</Label>
                        <Textarea
                          id="exp-methodology"
                          placeholder="Describe your experimental approach..."
                          value={newExperimentData.methodology}
                          onChange={(e) =>
                            setNewExperimentData({ ...newExperimentData, methodology: e.target.value })
                          }
                          data-testid="textarea-experiment-methodology"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="exp-duration">Duration (hours)</Label>
                          <Input
                            id="exp-duration"
                            type="number"
                            value={newExperimentData.estimatedDuration}
                            onChange={(e) =>
                              setNewExperimentData({ ...newExperimentData, estimatedDuration: parseInt(e.target.value) || 0 })
                            }
                            data-testid="input-experiment-duration"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exp-circuits">Number of Circuits</Label>
                          <Input
                            id="exp-circuits"
                            type="number"
                            value={newExperimentData.circuits}
                            onChange={(e) =>
                              setNewExperimentData({ ...newExperimentData, circuits: parseInt(e.target.value) || 1 })
                            }
                            data-testid="input-experiment-circuits"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exp-tags">Tags (comma-separated)</Label>
                          <Input
                            id="exp-tags"
                            placeholder="VQE, optimization, ML"
                            value={newExperimentData.tags}
                            onChange={(e) =>
                              setNewExperimentData({ ...newExperimentData, tags: e.target.value })
                            }
                            data-testid="input-experiment-tags"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowExperimentModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => setShowExperimentModal(false)}
                        data-testid="button-create-experiment"
                      >
                        Create Experiment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Experiments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExperiments.map((experiment) => (
                  <motion.div
                    key={experiment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all duration-200"
                      onClick={() => setSelectedExperiment(experiment.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{experiment.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {experiment.description}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(experiment.status)}>
                            {experiment.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        {experiment.status !== "planning" && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{experiment.progress}%</span>
                            </div>
                            <Progress value={experiment.progress} className="h-2" />
                          </div>
                        )}

                        {/* Experiment Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Circuits:</span>
                            <span className="font-medium ml-1">{experiment.circuits}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Jobs:</span>
                            <span className="font-medium ml-1">
                              {experiment.jobsCompleted}/{experiment.totalJobs}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Owner:</span>
                            <span className="font-medium ml-1">{experiment.owner}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500">Workspace:</span>
                            <span className="font-medium ml-1">{experiment.workspace}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {experiment.tags.map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Timing Info */}
                        <div className="space-y-1 text-sm text-gray-500">
                          {experiment.startTime && (
                            <div>
                              Started: {formatDistanceToNow(experiment.startTime)} ago
                            </div>
                          )}
                          {experiment.estimatedCompletion && (
                            <div>
                              ETA: {formatDistanceToNow(experiment.estimatedCompletion)}
                            </div>
                          )}
                          {experiment.currentBackend && (
                            <div>Backend: {experiment.currentBackend}</div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {experiment.status === "running" && (
                            <Button size="sm" variant="outline">
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {experiment.status === "paused" && (
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Clone
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Server, Hash, Tag, CheckCircle, XCircle, Play, Pause, Cpu, Zap, Code, BarChart3, Target, Activity, Database, Settings, TrendingUp, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIFailureAnalysis } from "@/components/ai/ai-failure-analysis";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from "recharts";
import type { Job, JobStatus } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

const statusColors: Record<JobStatus, string> = {
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  done: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const statusIcons: Record<JobStatus, React.ReactNode> = {
  queued: <Clock className="w-4 h-4" />,
  running: <Play className="w-4 h-4" />,
  done: <CheckCircle className="w-4 h-4" />,
  failed: <XCircle className="w-4 h-4" />,
  cancelled: <Pause className="w-4 h-4" />,
};

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Generate sample data for visualizations
  const generateErrorData = () => {
    return [
      { name: 'T1 (μs)', value: 311.79, min: 85.2, max: 523.4, type: 'coherence' },
      { name: 'T2 (μs)', value: 353.48, min: 127.8, max: 489.3, type: 'coherence' },
      { name: 'Readout Error', value: 4.7e-3, min: 1.343e-3, max: 1.936e-1, type: 'error' },
      { name: 'CZ Error', value: 1.681e-3, min: 6.943e-4, max: 1.99e-1, type: 'error' },
      { name: 'SX Error', value: 1.832e-4, min: 4.2e-5, max: 8.9e-4, type: 'error' }
    ];
  };

  const generateQueueData = () => {
    const data = [];
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      data.push({
        time: format(new Date(now - (24 - i) * 3600000), 'HH:mm'),
        position: Math.max(1, Math.floor(Math.random() * 50) - i * 2),
        estimatedWait: Math.max(5, 120 - i * 4)
      });
    }
    return data;
  };

  const generateTopologyData = () => {
    const nodes = [];
    const connections = [];
    const qubits = job.qubits || 27;
    
    // Generate qubit nodes in a grid-like pattern
    for (let i = 0; i < qubits; i++) {
      const row = Math.floor(i / Math.ceil(Math.sqrt(qubits)));
      const col = i % Math.ceil(Math.sqrt(qubits));
      nodes.push({
        id: i,
        x: col * 60 + 30,
        y: row * 60 + 30,
        error: Math.random() * 0.01,
        connected: i < qubits - 1
      });
      
      // Add connections to adjacent qubits
      if (col < Math.ceil(Math.sqrt(qubits)) - 1) {
        connections.push({ from: i, to: i + 1, error: Math.random() * 0.005 });
      }
      if (row < Math.floor(qubits / Math.ceil(Math.sqrt(qubits)))) {
        connections.push({ from: i, to: i + Math.ceil(Math.sqrt(qubits)), error: Math.random() * 0.005 });
      }
    }
    
    return { nodes, connections };
  };

  const errorData = generateErrorData();
  const queueData = generateQueueData();
  const topologyData = generateTopologyData();

  const formatScientific = (value: number) => {
    if (value < 0.001) {
      return value.toExponential(2);
    }
    return value.toFixed(3);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] overflow-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-white via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-2xl border-0 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
              <div className="absolute inset-0 opacity-30"></div>
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 py-6 px-8 border-b border-gray-200/70 dark:border-gray-700/70">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      {job.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-1">
                      ID: {job.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`${statusColors[job.status as JobStatus]} flex items-center gap-2 text-sm px-4 py-2 font-medium shadow-sm`}>
                    {statusIcons[job.status as JobStatus]}
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
                    data-testid="close-job-details"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
            </div>

            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-r from-gray-50/80 to-blue-50/30 dark:from-gray-800/80 dark:to-gray-700/50">
                  <TabsList className="grid w-full grid-cols-5 bg-transparent p-2 mx-8">
                    <TabsTrigger value="overview" className="flex items-center gap-2 font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-gray-700 data-[state=active]:scale-105 rounded-xl">
                      <BarChart3 className="w-4 h-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="circuit" className="flex items-center gap-2 font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-gray-700 data-[state=active]:scale-105 rounded-xl">
                      <Code className="w-4 h-4" />
                      Circuit
                    </TabsTrigger>
                    <TabsTrigger value="execution" className="flex items-center gap-2 font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-gray-700 data-[state=active]:scale-105 rounded-xl">
                      <Cpu className="w-4 h-4" />
                      Execution
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2 font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-gray-700 data-[state=active]:scale-105 rounded-xl">
                      <Target className="w-4 h-4" />
                      Results
                    </TabsTrigger>
                    <TabsTrigger value="calibration" className="flex items-center gap-2 font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-gray-700 data-[state=active]:scale-105 rounded-xl">
                      <Settings className="w-4 h-4" />
                      System
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="px-8 py-6 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Job Overview
                      </h4>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-blue-800 dark:text-blue-200">Created</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {format(job.submissionTime, "MMM dd, yyyy")}
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            {format(job.submissionTime, "HH:mm:ss")}
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200/60 dark:border-purple-700/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-purple-800 dark:text-purple-200">Duration</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {formatDuration(job.duration)}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-green-50 to-green-100/70 dark:from-green-900/30 dark:to-green-800/30 border border-green-200/60 dark:border-green-700/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                            <Server className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-green-800 dark:text-green-200">Backend</span>
                        </div>
                        <div className="text-sm text-green-900 dark:text-green-100 font-mono bg-green-100 dark:bg-green-800/30 px-3 py-2 rounded-lg">
                          {job.backend}
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-amber-50 to-amber-100/70 dark:from-amber-900/30 dark:to-amber-800/30 border border-amber-200/60 dark:border-amber-700/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                            <Hash className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-amber-800 dark:text-amber-200">Priority</span>
                        </div>
                        <div className="text-xl font-bold text-amber-900 dark:text-amber-100">
                          Normal
                        </div>
                      </motion.div>
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-700/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-lg">
                        <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                          <Activity className="w-5 h-5 text-blue-600" />
                          Job Information
                        </h5>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Server className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">Backend:</span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded">
                              {job.backend}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">Submitted:</span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {format(new Date(job.submissionTime), "PPpp")}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">Duration:</span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                              {formatDuration(job.duration)}
                            </span>
                          </div>
                          {job.queuePosition && (
                            <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Hash className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Queue Position:</span>
                              </div>
                              <Badge variant="outline" className="font-mono">#{job.queuePosition}</Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-700/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-lg">
                        <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                          <Zap className="w-5 h-5 text-purple-600" />
                          Circuit Specifications
                        </h5>
                        <div className="space-y-4">
                          {job.qubits && (
                            <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Cpu className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Qubits:</span>
                              </div>
                              <span className="text-lg font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                                {job.qubits}
                              </span>
                            </div>
                          )}
                          {job.shots && (
                            <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Target className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Shots:</span>
                              </div>
                              <span className="text-lg font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                                {job.shots.toLocaleString()}
                              </span>
                            </div>
                          )}
                          {job.program && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Code className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">Program Preview:</span>
                              </div>
                              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 shadow-inner">
                                <div className="text-xs font-mono text-green-400">
                                  {job.program.length > 150
                                    ? `${job.program.substring(0, 150)}...`
                                    : job.program}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* AI Failure Analysis - Only show for failed jobs */}
                    {job.status === 'failed' && (
                      <div className="pt-6">
                        <AIFailureAnalysis 
                          jobId={job.id} 
                          jobName={job.name || undefined}
                          error={job.error || undefined}
                          onRetryWithSuggestion={(suggestion) => {
                            // Handle retry with AI suggestion
                            console.log('Retry with suggestion:', suggestion);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="circuit" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Quantum Circuit Details
                    </h4>
                    
                    {/* Circuit Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800 dark:text-blue-200">Qubits</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {job.qubits || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-800 dark:text-purple-200">Shots</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {job.shots?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">Circuit Depth</span>
                        </div>
                        <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {job.qubits ? Math.floor(Math.random() * 50) + 10 : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Quantum Processor Topology */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          Processor Topology
                        </h5>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">Map View</Badge>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50/50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-lg">
                        <div className="relative w-full h-96 flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="0 0 400 300" className="rounded-xl">
                            <defs>
                              <radialGradient id="nodeGradient" cx="0.5" cy="0.5" r="0.5">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
                              </radialGradient>
                              <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                <feMerge> 
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/> 
                                </feMerge>
                              </filter>
                            </defs>
                            
                            {/* Draw connections first (behind nodes) */}
                            {topologyData.connections.map((conn, i) => {
                              const fromNode = topologyData.nodes[conn.from];
                              const toNode = topologyData.nodes[conn.to];
                              if (!fromNode || !toNode) return null;
                              
                              const opacity = Math.max(0.3, 1 - conn.error * 100);
                              const color = conn.error > 0.003 ? '#ef4444' : conn.error > 0.002 ? '#f59e0b' : '#10b981';
                              return (
                                <line
                                  key={`conn-${i}`}
                                  x1={fromNode.x}
                                  y1={fromNode.y}
                                  x2={toNode.x}
                                  y2={toNode.y}
                                  stroke={color}
                                  strokeWidth="3"
                                  opacity={opacity}
                                  filter="url(#glow)"
                                />
                              );
                            })}
                            
                            {/* Draw qubit nodes */}
                            {topologyData.nodes.map((node) => {
                              const color = node.error > 0.005 ? '#ef4444' : node.error > 0.002 ? '#f59e0b' : '#10b981';
                              return (
                                <g key={`node-${node.id}`}>
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="16"
                                    fill={color}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    filter="url(#glow)"
                                    className="hover:r-18 transition-all duration-200 cursor-pointer"
                                  />
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="16"
                                    fill="url(#nodeGradient)"
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="white"
                                    fontWeight="bold"
                                    className="pointer-events-none"
                                  >
                                    {node.id}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Good (&lt; 0.002)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Fair (0.002-0.005)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Poor (&gt; 0.005)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Circuit Program */}
                    {job.program && (
                      <div>
                        <h5 className="font-medium mb-2">Quantum Circuit Program</h5>
                        <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {job.program}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Basis Gates */}
                    <div>
                      <h5 className="font-medium mb-2">Basis Gates</h5>
                      <div className="flex flex-wrap gap-2">
                        {['cx', 'u1', 'u2', 'u3', 'measure'].map((gate) => (
                          <Badge key={gate} variant="outline" className="font-mono">
                            {gate}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="execution" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Backend & Execution Details
                    </h4>
                    
                    {/* Backend Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Backend Specifications</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Backend Name:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{job.backend}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Total Qubits:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">127</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Processor Type:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Eagle r3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Region:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">US-East</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Queue Information</h5>
                        <div className="space-y-3">
                          {job.queuePosition && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Position in Queue:</span>
                              <Badge variant="outline">#{job.queuePosition}</Badge>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Estimated Wait:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {job.status === 'queued' ? '~15 minutes' : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Queue Length:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">23 jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Queue Timeline Chart */}
                    {job.status === 'queued' && (
                      <div>
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Queue Position Timeline (24h)
                        </h5>
                        <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-indigo-900/20 border border-blue-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-lg">
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={queueData}>
                              <defs>
                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                              <XAxis 
                                dataKey="time" 
                                fontSize={12} 
                                stroke="#64748b"
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                fontSize={12} 
                                stroke="#64748b"
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'white',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '12px',
                                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value, name) => [
                                  name === 'position' ? `#${value}` : `${value} min`,
                                  name === 'position' ? 'Queue Position' : 'Est. Wait Time'
                                ]}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="position" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                fill="url(#areaGradient)"
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Performance Metrics Chart */}
                    <div>
                      <h5 className="font-medium mb-4">Backend Performance Metrics</h5>
                      <div className="bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-red-900/20 border border-red-200/60 dark:border-gray-700/60 rounded-2xl p-6 shadow-lg">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart data={errorData.filter(d => d.type === 'error')} margin={{ bottom: 80 }}>
                            <defs>
                              <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                            <XAxis 
                              dataKey="name" 
                              fontSize={12} 
                              angle={-45} 
                              textAnchor="end" 
                              height={80}
                              stroke="#64748b"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              fontSize={12} 
                              tickFormatter={formatScientific}
                              stroke="#64748b"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                              }}
                              formatter={(value) => [formatScientific(Number(value)), 'Error Rate']} 
                            />
                            <Bar 
                              dataKey="value" 
                              fill="url(#errorGradient)"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="px-6 pb-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Execution Results
                    </h4>
                    
                    {job.results ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-4">Measurement Results</h5>
                        <div className="bg-white dark:bg-gray-800 rounded p-4 font-mono text-sm">
                          <pre>{JSON.stringify(job.results, null, 2)}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                          {job.status === "queued" && "Job is queued - results will appear when execution completes"}
                          {job.status === "running" && "Job is currently running - results will appear when execution completes"}
                          {job.status === "done" && "Results not available"}
                          {job.status === "failed" && "Job failed - no results available"}
                          {job.status === "cancelled" && "Job was cancelled - no results available"}
                        </p>
                      </div>
                    )}
                    
                    {/* Show progress for running jobs */}
                    {job.status === "running" && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-200">Execution Progress</h4>
                        <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-3">
                          <motion.div
                            className="bg-blue-500 h-3 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "70%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">Job is currently executing on quantum hardware...</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="calibration" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System Calibration & Performance
                    </h4>
                    
                    {/* Coherence Times Chart */}
                    <div>
                      <h5 className="font-medium mb-4">Coherence Times Distribution</h5>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={errorData.filter(d => d.type === 'coherence')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip formatter={(value) => [`${value} μs`, 'Coherence Time']} />
                            <Bar dataKey="value" fill="#10b981">
                              <Bar dataKey="min" fill="#dc2626" />
                              <Bar dataKey="max" fill="#3b82f6" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500"></div>
                          <span>Median</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-600"></div>
                          <span>Minimum</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-600"></div>
                          <span>Maximum</span>
                        </div>
                      </div>
                    </div>

                    {/* Error Rate Scatter Plot */}
                    <div>
                      <h5 className="font-medium mb-4">Error Rate Analysis</h5>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <ScatterChart data={[
                            { x: 1.68e-3, y: 1.83e-4, name: 'CZ vs SX Error' },
                            { x: 4.7e-3, y: 1.343e-3, name: 'Readout vs Min' },
                            { x: 6.94e-4, y: 1.99e-1, name: 'Best vs Max' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="number" 
                              dataKey="x" 
                              fontSize={12}
                              tickFormatter={formatScientific}
                              name="Error Rate A"
                            />
                            <YAxis 
                              type="number" 
                              dataKey="y" 
                              fontSize={12}
                              tickFormatter={formatScientific}
                              name="Error Rate B"
                            />
                            <Tooltip 
                              formatter={(value, name) => [formatScientific(Number(value)), name]}
                            />
                            <Scatter dataKey="y" fill="#8884d8" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Detailed Error Rates Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Error Rates</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">2Q Error (best):</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">6.94E-4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median CZ Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">1.68E-3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median SX Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">1.83E-4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Readout Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">4.7E-3</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Coherence Times</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median T1:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">311.79 μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median T2:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">353.48 μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">CLOPS:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">180K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Last Calibrated:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">31 minutes ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
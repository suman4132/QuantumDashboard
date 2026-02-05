
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  RefreshCw, 
  Cpu, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  AlertCircle,
  FileCode,
  Activity,
  Zap,
  BarChart,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { JobDetailsModal } from "@/components/dashboard/job-details-modal";
import type { Job as SchemaJob } from "@shared/schema";

// Define Job Interface matching the API response
interface APIJob {
  id: string;
  name: string;
  backend: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  created: string;
  qubits: number;
  shots: number;
  duration?: number | null;
 
  program?: string;
  error?: string;
}

interface IBMResponse {
  jobs: APIJob[];
  timestamp: string;
  isSimulated: boolean;
}

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefetching, setIsRefetching] = useState(false);
  const [selectedJob, setSelectedJob] = useState<SchemaJob | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<IBMResponse>({
    queryKey: ["ibm-quantum-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/ibm-quantum/live");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    refetchInterval: 30000 // Auto refresh every 30s
  });

  const handleManualRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setTimeout(() => setIsRefetching(false), 800);
  };

  const statusTags = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed") return { color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800", icon: <CheckCircle className="w-3 h-3" /> };
    if (s === "running") return { color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800", icon: <Activity className="w-3 h-3 animate-pulse" /> };
    if (s === "queued") return { color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800", icon: <Clock className="w-3 h-3" /> };
    if (s === "failed") return { color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800", icon: <XCircle className="w-3 h-3" /> };
    return { color: "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800 border-gray-200 dark:border-gray-700", icon: <AlertCircle className="w-3 h-3" /> };
  };

  const handleJobClick = (apiJob: APIJob) => {
    // Map APIJob to SchemaJob for the modal
    const job: SchemaJob = {
      id: apiJob.id,
      name: apiJob.name,
      backend: apiJob.backend,
      status: apiJob.status === "completed" ? "done" : apiJob.status,
      queuePosition: apiJob.status === 'queued' ? 1 : null,
      submissionTime: new Date(apiJob.created),
      startTime: apiJob.status === 'running' || apiJob.status === 'completed' ? new Date(apiJob.created) : null,
      endTime: apiJob.status === 'completed' ? new Date(Date.now()) : null, // Approximate
      duration: apiJob.duration || null,
      qubits: apiJob.qubits,
      shots: apiJob.shots,
      program: apiJob.program || null,
      results: null,
      error: apiJob.error || null,
      tags: [],
      sessionId: null,
      userId: null
    };
    setSelectedJob(job);
  };

  // Filter jobs logic
  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    
    let result = data.jobs.filter(job => 
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.backend.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeTab === 'active') {
      result = result.filter(job => job.status === 'running' || job.status === 'queued');
    } else if (activeTab === 'completed') {
      result = result.filter(job => job.status === 'completed');
    } else if (activeTab === 'failed') {
      result = result.filter(job => job.status === 'failed' || job.status === 'cancelled');
    }

    return result;
  }, [data?.jobs, searchQuery, activeTab]);

  // Statistics
  const stats = useMemo(() => {
    if (!data?.jobs) return { total: 0, active: 0, completed: 0, failed: 0, successRate: 0 };
    const total = data.jobs.length;
    const active = data.jobs.filter(j => j.status === 'running' || j.status === 'queued').length;
    const completed = data.jobs.filter(j => j.status === 'completed').length;
    const failed = data.jobs.filter(j => j.status === 'failed' || j.status === 'cancelled').length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, active, completed, failed, successRate };
  }, [data?.jobs]);

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section with Glow Effect */}
        <div className="relative">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                  Quantum Operations
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Monitor and analyze your quantum processor executions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleManualRefresh}
                className="gap-2 border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all shadow-sm hover:shadow-md"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin text-purple-500' : 'text-gray-500'}`} />
                <span className="hidden sm:inline">Sync Data</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { title: "Total Jobs", value: stats.total, icon: FileCode, color: "text-blue-500", bg: "bg-blue-500/10", desc: "Lifetime submissions" },
             { title: "Active Queue", value: stats.active, icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10", desc: "Processing now" },
             { title: "Success Rate", value: `${stats.successRate}%`, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "Completion ratio" },
             { title: "Critical Errors", value: stats.failed, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", desc: "Attention needed" }
           ].map((stat, idx) => (
             <motion.div
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
                <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{stat.value}</div>
                    <p className="text-xs text-gray-400 mt-1 font-medium">{stat.desc}</p>
                  </CardContent>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Info Alert for Simulated Data */}
        <AnimatePresence>
          {data?.isSimulated && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 p-3 rounded-xl flex items-center gap-3 text-amber-800 dark:text-amber-500 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0 animate-pulse" />
                <p className="text-sm font-medium">Simulation Mode Active: Displaying synthetic data for demonstration purposes.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-gray-900/50 p-1 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50">
               <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList className="bg-transparent border-none p-1 gap-1">
                        <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm transition-all">All Jobs</TabsTrigger>
                        <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-600 transition-all">Active</TabsTrigger>
                        <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-emerald-100 dark:data-[state=active]:bg-emerald-900/30 data-[state=active]:text-emerald-600 transition-all">Done</TabsTrigger>
                        <TabsTrigger value="failed" className="rounded-lg data-[state=active]:bg-rose-100 dark:data-[state=active]:bg-rose-900/30 data-[state=active]:text-rose-600 transition-all">Failed</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative flex-1 max-w-sm w-full mr-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                        placeholder="Filter by ID, Name or Backend..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 bg-white dark:bg-gray-800 border-none ring-1 ring-gray-200 dark:ring-gray-700 focus-visible:ring-purple-500 transition-all rounded-lg"
                    />
                </div>
            </div>

            <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-gray-200 dark:ring-gray-800 overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                    {isLoading ? (
                    <div className="h-96 flex items-center justify-center bg-gray-50/30 dark:bg-gray-900/30">
                        <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-900 rounded-full animate-spin border-t-purple-600"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-500">Retrieving quantum telemetry...</span>
                        </div>
                    </div>
                    ) : filteredJobs.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                            <Filter className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No jobs found</h3>
                        <p className="max-w-xs text-center mt-1">We couldn't find any jobs matching your current filters.</p>
                        <Button variant="link" onClick={() => { setActiveTab('all'); setSearchQuery(''); }} className="mt-4 text-purple-600 font-semibold">
                            Clear filters
                        </Button>
                    </div>
                    ) : (
                    <Table>
                        <TableHeader>
                        <TableRow className="bg-gray-50/80 dark:bg-gray-900/80 hover:bg-gray-50/80 border-b border-gray-100 dark:border-gray-800">
                            <TableHead className="w-[180px] font-semibold text-gray-600 dark:text-gray-300">Job ID</TableHead>
                            <TableHead className="w-[200px] font-semibold text-gray-600 dark:text-gray-300">Job Name</TableHead>
                            <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Backend</TableHead>
                            <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Qubits</TableHead>
                            <TableHead className="font-semibold text-gray-600 dark:text-gray-300">Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-600 dark:text-gray-300">Submitted</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredJobs.map((job, index) => {
                                const status = statusTags(job.status);
                                return (
                                <motion.tr
                                    key={job.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    onClick={() => handleJobClick(job)}
                                    className="group hover:bg-purple-50/40 dark:hover:bg-purple-900/10 border-b border-gray-100/50 dark:border-gray-800/50 cursor-pointer transition-all"
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {job.id.slice(0, 8)}...
                                            </span>
                                            {job.status === 'failed' && <AlertCircle className="w-3 h-3 text-rose-500" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span className="font-medium text-gray-900 dark:text-gray-200">
                                            {job.name || "Untitled Experiment"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-mono text-xs">{job.backend}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="font-normal text-gray-500 border-gray-200 dark:border-gray-700">
                                            {job.qubits}q
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                            {status.icon}
                                            <span className="capitalize">{job.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(job.created), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <MoreHorizontal className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </TableCell>
                                </motion.tr>
                            )})}
                        </AnimatePresence>
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

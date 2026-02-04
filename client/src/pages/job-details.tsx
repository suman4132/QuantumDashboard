
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Cpu, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  AlertCircle,
  Hash,
  Share2,
  Calendar,
  Terminal,
  Activity,
  Layers,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow, format } from "date-fns";

// Use same interface or detailed one
interface JobDetail {
  id: string;
  name: string;
  backend: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  created: string;
  updated?: string;
  runtime?: number;
  qubits: number;
  shots: number;
  program?: string;
  results?: any; // Could be counts object 
  error?: string;
}

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading, error } = useQuery<JobDetail>({
    queryKey: ["ibm-quantum-job", id],
    queryFn: async () => {
      const res = await fetch(`/api/ibm-quantum/jobs/${id}`);
      if (!res.ok) throw new Error("Failed to fetch job details");
      return res.json();
    },
    enabled: !!id // Only run if ID exists
  });

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "running": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "queued": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "failed": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const statusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return <CheckCircle className="w-5 h-5 mr-2" />;
      case "running": return <PlayCircle className="w-5 h-5 mr-2 animate-pulse" />;
      case "queued": return <Clock className="w-5 h-5 mr-2" />;
      case "failed": return <XCircle className="w-5 h-5 mr-2" />;
      default: return <AlertCircle className="w-5 h-5 mr-2" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 animate-pulse">Loading execution details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-6 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-6">Could not retrieve details for job {id}</p>
        <Link to="/my-jobs">
          <Button>Back to My Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4">
          <Link to="/my-jobs" className="self-start">
             <Button variant="ghost" className="hover:bg-transparent pl-0 text-gray-500 dark:text-gray-400 hover:text-blue-500">
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Jobs List
             </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold tracking-tight">{job.name || "Untitled Execution"}</h1>
                 <Badge variant="outline" className={`${statusColor(job.status)} capitalize px-3 py-1 text-sm font-medium`}>
                   {statusIcon(job.status)}
                   {job.status}
                 </Badge>
               </div>
               <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                  <span className="flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    {job.id}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(job.created), "PPpp")}
                  </span>
               </div>
             </div>
             
             <div className="flex gap-2">
               <Button variant="outline" size="sm">
                 <Share2 className="w-4 h-4 mr-2" />
                 Share
               </Button>
               {/* Could add a Rerun button here in future */}
             </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Metrics & Config */}
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  Backend Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                   <span className="text-gray-500">Target System</span>
                   <Badge variant="secondary" className="font-mono">{job.backend}</Badge>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                   <span className="text-gray-500">Qubits Used</span>
                   <span className="font-mono font-medium">{job.qubits}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                   <span className="text-gray-500">Shots (Repeats)</span>
                   <span className="font-mono font-medium">{job.shots}</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                   <span className="text-gray-500">Execution Time</span>
                   <span className="font-mono font-medium">{job.runtime ? `${job.runtime}ms` : 'N/A'}</span>
                 </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Status Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-gray-200 dark:border-gray-800 pl-4 ml-2 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500"></div>
                    <p className="text-sm font-medium">Job Created</p>
                    <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(job.created), { addSuffix: true })}</p>
                  </div>
                  {job.updated && (
                     <div className="relative">
                       <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500"></div>
                       <p className="text-sm font-medium">Completed</p>
                       <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(job.updated), { addSuffix: true })}</p>
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Code & Results */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800">
                <TabsTrigger value="results">
                   <Activity className="w-4 h-4 mr-2" />
                   Results & Visualization
                </TabsTrigger>
                <TabsTrigger value="code">
                   <Terminal className="w-4 h-4 mr-2" />
                   QASM / Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="mt-4">
                 <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-card-foreground shadow-sm h-[400px]">
                    <CardHeader>
                      <CardTitle>Measurement Probabilities</CardTitle>
                      <CardDescription>Distribution of quantum state measurements</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full flex flex-col">
                       {/* Basic Histogram Visualization Simulation */}
                       {job.results || (job.status === 'completed' && !job.results) ? (
                         <div className="flex-1 w-full flex items-end justify-center gap-4 px-4 pb-8 border-b border-gray-100 dark:border-gray-800">
                           {/* Render bars based on result object keys */}
                           {Object.entries(job.results || {'00': 50, '11': 50}).map(([state, count]: [string, any], i) => (
                             <div key={state} className="flex flex-col items-center group w-full max-w-[80px]">
                               <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-t-md overflow-hidden" style={{ height: '200px' }}>
                                 <motion.div 
                                   initial={{ height: 0 }}
                                   animate={{ height: `${(Number(count) / job.shots) * 100}%` }} // Approximate scale
                                   transition={{ duration: 1, delay: i * 0.1 }}
                                   className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity"
                                 />
                               </div>
                               <div className="mt-2 text-center">
                                 <div className="font-mono font-bold text-lg">{state}</div>
                                 <div className="text-xs text-gray-500">{Number(count)} hits</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="h-full flex items-center justify-center text-gray-500">
                            No result data available for this job status
                         </div>
                       )}
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-4">
                <Card className="border-gray-200 dark:border-gray-800 bg-gray-900 text-gray-100 shadow-sm">
                   <CardHeader className="flex flex-row items-center justify-between">
                     <CardTitle className="text-sm font-mono text-gray-400">OPENQASM 2.0</CardTitle>
                     <Button variant="ghost" size="sm" className="h-8">Copy</Button>
                   </CardHeader>
                   <CardContent>
                     <ScrollArea className="h-[300px] w-full rounded-md border border-gray-800 bg-black p-4">
                       <pre className="font-mono text-xs sm:text-sm leading-relaxed text-green-400">
                         {job.program || `// No source code available for this job\n// Job ID: ${job.id}`}
                       </pre>
                     </ScrollArea>
                   </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

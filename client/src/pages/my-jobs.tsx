
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
  FileCode
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";

// Define Job Interface matching the API response
interface Job {
  id: string;
  name: string;
  backend: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  created: string;
  qubits: number;
  shots: number;
  program?: string;
  error?: string;
}

interface IBMResponse {
  jobs: Job[];
  timestamp: string;
  isSimulated: boolean;
}

export default function MyJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefetching, setIsRefetching] = useState(false);
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

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "running": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "queued": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "failed": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const statusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="w-4 h-4 mr-1" />;
      case "running": return <PlayCircle className="w-4 h-4 mr-1 animate-pulse" />;
      case "queued": return <Clock className="w-4 h-4 mr-1" />;
      case "failed": return <XCircle className="w-4 h-4 mr-1" />;
      default: return <AlertCircle className="w-4 h-4 mr-1" />;
    }
  };

  // Filter jobs based on search
  const filteredJobs = data?.jobs.filter(job => 
    job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.backend.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                My Quantum Jobs
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Overview of your circuit executions on IBM Quantum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleManualRefresh}
              className="gap-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Job ID, Name or Backend..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-gray-200 dark:border-gray-700 bg-white dark:bg-black/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Job History</CardTitle>
                <CardDescription>
                  Found {filteredJobs.length} execution records
                  {data?.isSimulated && <span className="ml-2 text-yellow-500 text-xs">(Simulated Data)</span>}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-500">Loading execution history...</span>
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FileCode className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>No jobs found matching your criteria</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100 dark:border-gray-800">
                    <TableHead className="w-[180px]">Job ID</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Backend</TableHead>
                    <TableHead>Qubits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => navigate(`/my-jobs/${job.id}`)}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-100 dark:border-gray-800 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-mono text-xs text-gray-500 dark:text-gray-400">
                        {job.id.slice(0, 16)}...
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-200">
                        {job.name || "Untitled Job"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                           <Cpu className="w-3 h-3 mr-1" />
                           {job.backend}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {job.qubits}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusColor(job.status)} border-0 capitalize`}>
                          <span className="flex items-center">
                             {statusIcon(job.status)}
                             {job.status}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-500 dark:text-gray-400 text-sm">
                        <div className="flex flex-col items-end">
                          <span>{formatDistanceToNow(new Date(job.created), { addSuffix: true })}</span>
                          <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {format(new Date(job.created), "PP p")}
                          </span>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

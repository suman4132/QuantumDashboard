
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Eye, Square, Download, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useJobs, useBackends, useUpdateJobStatus, useLiveQuantumStatus } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";
import { JobDetailsModal } from "./job-details-modal";
import type { Job, JobStatus, BackendStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<JobStatus, string> = {
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  done: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const backendStatusColors: Record<BackendStatus, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  maintenance: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  offline: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
};

interface AllBackendsViewProps {
  onBack: () => void;
}

export function AllBackendsView({ onBack }: AllBackendsViewProps) {
  const [selectedBackend, setSelectedBackend] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch both live and local data
  const { data: liveData, isLoading: liveLoading } = useLiveQuantumStatus();
  const { data: jobsData, isLoading: localJobsLoading } = useJobs(currentPage, 20);
  const { data: localBackends = [], isLoading: localBackendsLoading } = useBackends();
  
  const updateJobStatus = useUpdateJobStatus();
  const { toast } = useToast();

  // Prefer live backends if available, otherwise fallback to local
  const backends = liveData?.backends.map(b => ({
    id: b.name, // live data uses 'name' as id effectively
    name: b.name,
    status: b.status as BackendStatus,
    queueLength: b.queue,
    qubits: b.qubits,
    uptime: "99.9%", // Mock for live
    averageWaitTime: b.queue * 20 // Estimate
  })) || localBackends;

  // Prefer live jobs if available
  const rawJobs = liveData?.jobs || jobsData?.jobs || [];
  
  // Map live jobs to expected Job interface
  const jobs: Job[] = liveData?.jobs 
    ? liveData.jobs.map(j => ({
        id: j.id,
        name: j.name,
        backend: j.backend,
        status: j.status as JobStatus,
        submissionTime: new Date(j.created),
        startTime: new Date(j.created), // approximate
        endTime: null,
        duration: null,
        queuePosition: j.status === 'queued' ? Math.floor(Math.random() * 10) + 1 : undefined,
        shots: j.shots,
        programCode: "qiskit",
        results: null,
        tags: [],
        error: null
      }))
    : (jobsData?.jobs || []);

  const isLoading = liveLoading || (localJobsLoading && localBackendsLoading);
  const pagination = !liveData ? jobsData?.pagination : {
    currentPage: 1,
    totalPages: 1,
    totalJobs: jobs.length,
    limit: 50
  };

  // Filter jobs by selected backend
  const filteredJobs = jobs.filter(job => 
    selectedBackend === "all" || job.backend === selectedBackend
  );

  const handleStatusUpdate = async (jobId: string, status: JobStatus) => {
    try {
      if (liveData) {
        toast({
          title: "Read-only View",
          description: "Cannot modify live IBM Quantum jobs directly from dashboard yet.",
          variant: "default",
        });
        return;
      }
      await updateJobStatus.mutateAsync({ id: jobId, status });
      toast({
        title: "Job updated",
        description: `Job ${jobId} status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "-";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                All Backends
                {liveData && (
                  <Badge 
                    variant={liveData.isSimulated ? "secondary" : "default"}
                    className={liveData.isSimulated 
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200" 
                      : "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"}
                  >
                    {liveData.isSimulated ? "Simulated Data" : "Live Connection"}
                  </Badge>
                )}
              </h2>
            </div>
            <Select value={selectedBackend} onValueChange={setSelectedBackend}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by backend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Backends</SelectItem>
                {backends.map(backend => (
                  <SelectItem key={backend.id} value={backend.id}>
                    {backend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Backends Status Overview */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backend Status Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backends.map((backend, index) => (
              <motion.div
                key={backend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{backend.name}</h4>
                  <Badge className={backendStatusColors[backend.status as BackendStatus]}>
                    {backend.status.charAt(0).toUpperCase() + backend.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Queue: {backend.queueLength} jobs</p>
                  <p>Qubits: {backend.qubits}</p>
                  <p>Uptime: {backend.uptime}</p>
                  {backend.averageWaitTime && (
                    <p>Avg wait: {Math.floor(backend.averageWaitTime / 60)}m</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Jobs {selectedBackend !== "all" && `(${backends.find(b => b.id === selectedBackend)?.name})`}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredJobs.length} jobs found
            </p>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Backend</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Queue Position</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredJobs.map((job, index) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <TableCell className="font-mono text-sm">{job.id}</TableCell>
                    <TableCell>{job.backend}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[job.status as JobStatus]}>
                        <motion.div 
                          className="w-2 h-2 rounded-full mr-1.5"
                          animate={job.status === "running" ? { opacity: [1, 0.3, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{
                            backgroundColor: job.status === "running" ? "#10b981" : 
                                           job.status === "queued" ? "#f59e0b" :
                                           job.status === "done" ? "#3b82f6" :
                                           job.status === "failed" ? "#ef4444" : "#6b7280"
                          }}
                        />
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.queuePosition ? `#${job.queuePosition}` : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDistanceToNow(new Date(job.submissionTime), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDuration(job.duration)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {job.status === "running" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleStatusUpdate(job.id, "cancelled")}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        )}
                        {job.status === "done" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500 hover:text-green-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {job.status === "failed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-yellow-500 hover:text-yellow-600"
                            onClick={() => handleStatusUpdate(job.id, "queued")}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalJobs)} of {pagination.totalJobs} jobs
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={pagination.currentPage === 1}
                  onClick={() => setCurrentPage(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant="outline"
                      size="sm"
                      className={pagination.currentPage === pageNum ? "bg-blue-600 text-white" : ""}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Job Details Modal */}
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

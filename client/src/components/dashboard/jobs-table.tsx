import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Square, Download, RotateCcw, Plus, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useJobs, useUpdateJobStatus, useDeleteJob } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";
import { JobForm } from "./job-form";
import { JobDetailsModal } from "./job-details-modal";
import type { Job, JobStatus } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

const statusColors: Record<JobStatus, string> = {
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  done: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

interface JobsTableProps {
  searchQuery: string;
}

export function JobsTable({ searchQuery }: JobsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [backendFilter, setBackendFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("submissionTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading } = useJobs(currentPage, 10);
  const jobs = data?.jobs || [];
  const pagination = data?.pagination;
  const updateJobStatus = useUpdateJobStatus();
  const deleteJob = useDeleteJob();
  const { toast } = useToast();

  // Enhanced search with keyword matching
  const filteredJobs = jobs
    .filter((job) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        
        // Direct field matches
        const directMatches = [
          job.id.toLowerCase(),
          job.backend.toLowerCase(),
          job.status.toLowerCase(),
          job.name?.toLowerCase() || "",
          ...(job.tags || []).map(tag => tag.toLowerCase()),
          job.error && typeof job.error === 'string' ? job.error.toLowerCase() : (job.error ? JSON.stringify(job.error).toLowerCase() : ""),
        ];

        // Check for direct matches
        const hasDirectMatch = directMatches.some(field => field.includes(query));
        
        // Enhanced keyword matching
        const keywords = query.split(' ').filter(word => word.length > 0);
        const hasKeywordMatch = keywords.every(keyword => 
          directMatches.some(field => field.includes(keyword))
        );

        // Special keyword handling
        const specialKeywords = {
          'error': job.status === 'failed' || Boolean(job.error),
          'success': job.status === 'done',
          'active': job.status === 'running',
          'pending': job.status === 'queued',
          'timeout': (typeof job.error === 'string' ? job.error : JSON.stringify(job.error || ""))?.toLowerCase().includes('timeout') || false,
          'circuit': job.name?.toLowerCase().includes('circuit') || false,
          'simulation': job.backend.toLowerCase().includes('simulator'),
          'hardware': !job.backend.toLowerCase().includes('simulator'),
          'recent': new Date(job.submissionTime).getTime() > Date.now() - 3600000, // Last hour
          'today': new Date(job.submissionTime).toDateString() === new Date().toDateString()
        };

        const hasSpecialMatch = Object.entries(specialKeywords).some(([keyword, condition]) =>
          query.includes(keyword.toLowerCase()) && condition
        );

        return hasDirectMatch || hasKeywordMatch || hasSpecialMatch;
      }
      return true;
    })
    .filter((job) => statusFilter === "all" || job.status === statusFilter)
    .filter((job) => backendFilter === "all" || job.backend === backendFilter)
    .sort((a, b) => {
      const aVal = a[sortBy as keyof Job] as any;
      const bVal = b[sortBy as keyof Job] as any;
      
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleStatusUpdate = async (jobId: string, status: JobStatus) => {
    try {
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

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob.mutateAsync(jobId);
      toast({
        title: "Job deleted",
        description: `Job ${jobId} has been deleted`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
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

  const uniqueBackends = Array.from(new Set(jobs.map(job => job.backend)));

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quantum Jobs</h2>
          <div className="flex items-center space-x-3">
            {/* Filters */}
            <Select value={backendFilter} onValueChange={setBackendFilter}>
              <SelectTrigger className="w-40" data-testid="select-backend-filter">
                <SelectValue placeholder="All Backends" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Backends</SelectItem>
                {uniqueBackends.map(backend => (
                  <SelectItem key={backend} value={backend}>{backend}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32" data-testid="select-status-filter">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={() => setShowJobForm(true)}
              data-testid="button-new-job"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => {
                  if (sortBy === "id") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("id");
                    setSortOrder("asc");
                  }
                }}
                data-testid="header-job-id"
              >
                Job ID <ArrowUpDown className="w-3 h-3 ml-1 inline" />
              </TableHead>
              <TableHead data-testid="header-name">Name</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => {
                  if (sortBy === "backend") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("backend");
                    setSortOrder("asc");
                  }
                }}
                data-testid="header-backend"
              >
                Backend <ArrowUpDown className="w-3 h-3 ml-1 inline" />
              </TableHead>
              <TableHead data-testid="header-status">Status</TableHead>
              <TableHead data-testid="header-queue-position">Queue Position</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => {
                  if (sortBy === "submissionTime") {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("submissionTime");
                    setSortOrder("desc");
                  }
                }}
                data-testid="header-submitted"
              >
                Submitted <ArrowUpDown className="w-3 h-3 ml-1 inline" />
              </TableHead>
              <TableHead data-testid="header-duration">Duration</TableHead>
              <TableHead data-testid="header-actions">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredJobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  data-testid={`job-row-${job.id}`}
                >
                  <TableCell className="font-mono text-sm">{job.id}</TableCell>
                  <TableCell className="font-medium">{job.name || "Untitled Job"}</TableCell>
                  <TableCell>{job.backend}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[job.status as JobStatus]} animate-fade-in`}>
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
                        data-testid={`button-view-${job.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {job.status === "running" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleStatusUpdate(job.id, "cancelled")}
                          data-testid={`button-cancel-${job.id}`}
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                      {job.status === "done" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-500 hover:text-green-600"
                          data-testid={`button-download-${job.id}`}
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
                          data-testid={`button-retry-${job.id}`}
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

      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {pagination && (
              <>
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalJobs)} of {pagination.totalJobs} jobs
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination || pagination.currentPage === 1}
              onClick={() => pagination && handlePageChange(pagination.currentPage - 1)}
              data-testid="button-previous-page"
            >
              Previous
            </Button>
            
            {pagination && Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                  onClick={() => handlePageChange(pageNum)}
                  data-testid={`button-page-${pageNum}`}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!pagination || pagination.currentPage === pagination.totalPages}
              onClick={() => pagination && handlePageChange(pagination.currentPage + 1)}
              data-testid="button-next-page"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Job Creation Form Modal */}
      <AnimatePresence>
        {showJobForm && (
          <JobForm onClose={() => setShowJobForm(false)} />
        )}
      </AnimatePresence>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailsModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </AnimatePresence>
    </Card>
  );
}

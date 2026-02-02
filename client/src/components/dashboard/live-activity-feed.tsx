
import { useJobs } from "@/hooks/use-jobs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Zap, Square, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { JobStatus } from "@shared/schema";

const statusConfig: Record<JobStatus, { 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}> = {
  done: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  running: {
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  queued: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  cancelled: {
    icon: Square,
    color: "text-gray-600",
    bgColor: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

export function LiveActivityFeed() {
  const { data, isLoading } = useJobs(1, 50);
  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Get recent activity (jobs from last 2 hours or active jobs)
  const recentJobs = jobs
    .filter(job => {
      const isRecent = new Date(job.submissionTime).getTime() > Date.now() - 2 * 60 * 60 * 1000;
      const isActive = job.status === "running" || job.status === "queued";
      return isRecent || isActive;
    })
    .slice(0, 8);

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {recentJobs.map((job, index) => {
        const config = statusConfig[job.status as JobStatus] || statusConfig['queued'];
        const StatusIcon = config.icon;
        
        return (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className={`p-1.5 rounded-full ${config.color === "text-blue-600" && job.status === "running" ? "animate-pulse" : ""}`}>
              <StatusIcon className={`w-4 h-4 ${config.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium truncate">
                  {job.name || job.id}
                </p>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {job.backend}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${config.bgColor} text-xs`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(job.submissionTime), { addSuffix: true })}
                </span>
                {job.queuePosition && (
                  <span className="text-xs text-muted-foreground">
                    • Queue #{job.queuePosition}
                  </span>
                )}
              </div>
            </div>
            
            {job.status === "running" && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            )}
          </motion.div>
        );
      })}
      
      {recentJobs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      )}
    </div>
  );
}

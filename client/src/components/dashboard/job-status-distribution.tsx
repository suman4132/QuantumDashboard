
import { useJobs } from "@/hooks/use-jobs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Zap, Square, Activity } from "lucide-react";

const statusConfig = {
  done: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    progressColor: "bg-green-500",
  },
  running: {
    label: "Running",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    progressColor: "bg-blue-500",
  },
  queued: {
    label: "Queued",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    progressColor: "bg-yellow-500",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    progressColor: "bg-red-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: Square,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    progressColor: "bg-gray-500",
  },
};

export function JobStatusDistribution() {
  const { data, isLoading } = useJobs(1, 1000); // Get all jobs for accurate counts
  const jobs = data?.jobs || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalJobs = jobs.length;
  const statusCounts = {
    done: jobs.filter(job => job.status === "done").length,
    running: jobs.filter(job => job.status === "running").length,
    queued: jobs.filter(job => job.status === "queued").length,
    failed: jobs.filter(job => job.status === "failed").length,
    cancelled: jobs.filter(job => job.status === "cancelled").length,
  };

  return (
    <div className="space-y-4">
      {Object.entries(statusConfig).map(([status, config], index) => {
        const count = statusCounts[status as keyof typeof statusCounts];
        const percentage = totalJobs > 0 ? (count / totalJobs) * 100 : 0;
        
        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-sm font-medium">{config.label}</span>
                <Badge className={config.bgColor}>
                  {count}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {percentage.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={percentage}
              className="h-2"
              style={{
                background: "var(--muted)",
              }}
            />
          </motion.div>
        );
      })}
      
      {totalJobs === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No jobs found</p>
        </div>
      )}
    </div>
  );
}

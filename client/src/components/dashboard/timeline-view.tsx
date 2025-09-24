import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useJobs } from "@/hooks/use-jobs";
import type { JobStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<JobStatus, { bg: string; text: string }> = {
  queued: { bg: "bg-yellow-400", text: "text-yellow-800" },
  running: { bg: "bg-green-500", text: "text-white" },
  done: { bg: "bg-blue-500", text: "text-white" },
  failed: { bg: "bg-red-500", text: "text-white" },
  cancelled: { bg: "bg-gray-500", text: "text-white" },
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const progressBarVariants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 1, ease: "easeOut" },
  }),
};

export function TimelineView() {
  const { data, isLoading } = useJobs(1, 50); // Get more jobs for timeline
  const jobs = data?.jobs || [];

  // Filter to show only active/recent jobs for timeline
  const timelineJobs = jobs
    .filter(job => job.status === "running" || job.status === "queued" || 
            (job.status === "done" && new Date(job.submissionTime).getTime() > Date.now() - 3600000))
    .slice(0, 5);

  const getJobProgress = (job: any) => {
    if (job.status === "done" || job.status === "failed") return 100;
    if (job.status === "running") return 70; // Assume 70% progress for running jobs
    if (job.status === "queued") return 30; // 30% for queued
    return 0;
  };

  const getStatusText = (job: any) => {
    if (job.status === "running") return "Running";
    if (job.status === "queued") return `Queued (Position #${job.queuePosition || "?"})`;
    if (job.status === "done") return "Completed Successfully";
    if (job.status === "failed") return "Failed";
    return job.status;
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Timeline</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {timelineJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No active jobs to display in timeline</p>
          </div>
        ) : (
          timelineJobs.map((job, index) => (
            <motion.div
              key={job.id}
              custom={index}
              variants={timelineItemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
              data-testid={`timeline-job-${job.id}`}
            >
              <div className="text-sm font-mono text-gray-600 dark:text-gray-400 w-32 flex-shrink-0">
                {job.id}
              </div>
              <div className="flex-1 relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  custom={getJobProgress(job)}
                  variants={progressBarVariants}
                  initial="initial"
                  animate="animate"
                  className={`absolute left-0 top-0 h-full ${statusColors[job.status as JobStatus].bg} rounded-full ${
                    job.status === "running" ? "animate-pulse" : ""
                  }`}
                />
                <div className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${statusColors[job.status as JobStatus].text}`}>
                  {getStatusText(job)}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 w-20 flex-shrink-0">
                {job.duration ? `${Math.floor(job.duration / 60)}:${(job.duration % 60).toString().padStart(2, '0')}` : 
                 job.status === "running" ? "Running" : 
                 formatDistanceToNow(new Date(job.submissionTime), { addSuffix: false })}
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

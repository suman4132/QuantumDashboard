import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, XCircle, Clock, Play, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJobStats, useJobs } from "@/hooks/use-jobs";
import { formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const panelVariants = {
  hidden: { opacity: 0, x: 100, scale: 0.95 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const notificationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { data: stats } = useJobStats();
  const { data: jobsData } = useJobs(1, 50);
  const jobs = jobsData?.jobs || [];

  // Get recent completed jobs (last 24 hours)
  const recentCompletedJobs = jobs
    .filter(job => 
      (job.status === "done" || job.status === "failed") && 
      job.endTime && 
      new Date(job.endTime).getTime() > Date.now() - 24 * 60 * 60 * 1000
    )
    .sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime())
    .slice(0, 10);

  // Get running jobs
  const runningJobs = jobs.filter(job => job.status === "running").slice(0, 5);

  // Get queued jobs
  const queuedJobs = jobs.filter(job => job.status === "queued").slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      case "running": return <Play className="w-4 h-4 text-blue-500" />;
      case "queued": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "failed": return "text-red-600 bg-red-50 dark:bg-red-900/20";
      case "running": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "queued": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed top-16 right-4 w-96 max-h-[80vh] bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {recentCompletedJobs.length} completed today
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-notifications">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats?.totalJobs || 0}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">Total Jobs</div>
              </motion.div>
              <motion.div 
                className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats?.runningJobs || 0}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Running</div>
              </motion.div>
              <motion.div 
                className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(stats?.successRate || 0)}%
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Success Rate</div>
              </motion.div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto notification-scroll">
            {/* Recent Completed Jobs */}
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <h3 className="font-medium text-gray-900 dark:text-white">Recent Completions</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {recentCompletedJobs.length}
                </Badge>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {recentCompletedJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                      data-testid={`notification-completed-${job.id}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(job.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {job.name}
                            </p>
                            <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {job.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {job.backend} • {job.endTime && formatDistanceToNow(new Date(job.endTime), { addSuffix: true })}
                          </p>
                          {job.duration && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Duration: {Math.floor(job.duration / 60)}m {job.duration % 60}s
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Currently Running */}
            {runningJobs.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Play className="w-4 h-4 text-blue-600" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Currently Running</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {runningJobs.length}
                  </Badge>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scroll-smooth notification-scroll">
                  {runningJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      data-testid={`notification-running-${job.id}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Play className="w-3 h-3 text-blue-600" />
                        <span className="text-sm text-gray-900 dark:text-white truncate">
                          {job.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {job.backend}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Queue Status */}
            {queuedJobs.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-medium text-gray-900 dark:text-white">In Queue</h3>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    {queuedJobs.length}
                  </Badge>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scroll-smooth notification-scroll">
                  {queuedJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                      data-testid={`notification-queued-${job.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-yellow-600" />
                          <span className="text-sm text-gray-900 dark:text-white truncate">
                            {job.name}
                          </span>
                        </div>
                        {job.queuePosition && (
                          <Badge variant="outline" className="text-xs">
                            #{job.queuePosition}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle, XCircle, Clock, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJobStats, useJobs } from "@/hooks/use-jobs";
import { formatDistanceToNow } from "date-fns";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 100 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const contentVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: "auto", 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export function NotificationWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
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
    .slice(0, 5);

  // Get running jobs
  const runningJobs = jobs.filter(job => job.status === "running").slice(0, 3);

  // Calculate notification count
  const notificationCount = runningJobs.length + recentCompletedJobs.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "failed": return <XCircle className="w-3 h-3 text-red-500" />;
      case "running": return <Play className="w-3 h-3 text-blue-500" />;
      case "queued": return <Clock className="w-3 h-3 text-yellow-500" />;
      default: return <Clock className="w-3 h-3 text-gray-500" />;
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <CardHeader 
          className="p-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notificationCount} updates
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {notificationCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {notificationCount}
                </Badge>
              )}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {/* Running Jobs */}
                {runningJobs.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-3">
                      <Play className="w-3 h-3 text-blue-600" />
                      <h4 className="text-xs font-medium text-gray-900 dark:text-white">Running Now</h4>
                    </div>
                    <div className="space-y-2">
                      {runningJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <Play className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-gray-900 dark:text-white truncate flex-1">
                              {job.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {job.backend}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Completions */}
                {recentCompletedJobs.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <h4 className="text-xs font-medium text-gray-900 dark:text-white">Recent Completions</h4>
                    </div>
                    <div className="space-y-2">
                      {recentCompletedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {getStatusIcon(job.status)}
                              <span className="text-xs text-gray-900 dark:text-white truncate">
                                {job.name}
                              </span>
                            </div>
                            <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                              {job.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {job.backend} • {job.endTime && formatDistanceToNow(new Date(job.endTime), { addSuffix: true })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {notificationCount === 0 && (
                  <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                    <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">No new notifications</p>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

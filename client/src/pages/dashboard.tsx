import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, XCircle, Clock, Play, Activity, Search, Bell, Plus, Settings, Menu, X, Users, BarChart3, Zap } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { JobSimulator } from "@/lib/job-simulator";
import { useUpdateJobStatus } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";
import { ActiveSessions } from "@/components/dashboard/active-sessions";
import { BackendAdvisor } from "@/components/dashboard/backend-advisor";
import { AllBackendsView } from "@/components/dashboard/all-backends-view";
import { SessionForm } from "@/components/dashboard/session-form";
import { NotificationPanel } from "@/components/dashboard/notification-panel";
import { AnimatePresence } from "framer-motion";
import { useJobNotifications } from "@/hooks/use-job-notifications";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { JobStatusDistribution } from "@/components/dashboard/job-status-distribution";
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed";
import { AIAssistant } from "@/components/ai/ai-assistant";
import { NewsPanel } from "@/components/dashboard/news-panel";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};




export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(10);
  const updateJobStatus = useUpdateJobStatus();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentView = searchParams.get('view') || 'overview'; // Default to 'overview'

  // Initialize job notifications
  useJobNotifications();

  // Set up job simulator
  useEffect(() => {
    const simulator = JobSimulator.getInstance();

    simulator.onStatusChange((jobId, status, error) => {
      updateJobStatus.mutate(
        { id: jobId, status, error },
        {
          onSuccess: () => {
            const statusMessages = {
              running: "Job started running",
              done: "Job completed successfully",
              failed: "Job failed",
              cancelled: "Job was cancelled",
              queued: "Job queued",
            };

            const statusIcons = {
              running: <Play className="w-4 h-4" />,
              done: <CheckCircle className="w-4 h-4" />,
              failed: <XCircle className="w-4 h-4" />,
              cancelled: <XCircle className="w-4 h-4" />,
              queued: <Clock className="w-4 h-4" />,
            };

            toast({
              title: "Job Status Update",
              description: `${jobId}: ${statusMessages[status]}`,
              variant: status === "failed" ? "destructive" : "default",
            });
          },
        }
      );
    });
  }, [updateJobStatus, toast]);

  // Set up auto-refresh for IBM Quantum API endpoints
  useEffect(() => {
    if (refreshInterval === 0) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/analytics/stats"] });
      queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/backends"] });
      queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/sessions"] });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefreshIntervalChange = useCallback((interval: number) => {
    setRefreshInterval(interval);
  }, []);

  const handleManualRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/jobs"] });
    queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/analytics/stats"] });
    queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/backends"] });
    queryClient.invalidateQueries({ queryKey: ["https://runtime.quantum-computing.ibm.com/sessions"] });
  }, []);

  const handleViewChange = (view: string) => {
    setSearchParams({ view: view });
  };

  const handleOpenSessionForm = () => {
    setShowSessionForm(true);
  };

  const handleCloseSessionForm = () => {
    setShowSessionForm(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  // Conditionally render different views (now handled by renderCurrentView)
  if (currentView === 'all-backends') {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.1, 1, 1.1],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <Header
          onSearch={handleSearch}
          onRefreshIntervalChange={handleRefreshIntervalChange}
          onManualRefresh={handleManualRefresh}
          onViewChange={handleViewChange}
          onNotificationToggle={handleNotificationToggle}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div variants={itemVariants}>
            <AllBackendsView onBack={() => handleViewChange('overview')} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <Header
        onSearch={setSearchQuery}
        onRefreshIntervalChange={setRefreshInterval}
        onManualRefresh={handleManualRefresh}
        onViewChange={handleViewChange}
        onNotificationToggle={() => setShowNotifications(!showNotifications)}
      />

      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentView === 'overview' && 'Quantum Dashboard Overview'}
                    {currentView === 'jobs' && 'Quantum Jobs Management'}
                    {currentView === 'backends' && 'Quantum Backends Status'}
                    {currentView === 'sessions' && 'Active Sessions'}
                    {currentView === 'analytics' && 'Analytics & Insights'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Real-time monitoring of IBM Quantum Cloud resources
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Live Data</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Only show StatsCards once at the top for all views */}
                <div className="mb-6">
                  <StatsCards />
                </div>

                {/* Show search results indicator */}
                {searchQuery && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Searching for: "{searchQuery}"
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                )}

                {/* Comprehensive Status Overview */}
                {currentView === 'overview' && (
                  <div className="space-y-6">
                    {/* Analytics Charts Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
                          <p className="text-gray-600 dark:text-gray-400">Real-time insights and performance metrics</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleViewChange('analytics')}
                          className="flex items-center space-x-2"
                        >
                          <BarChart3 className="w-4 h-4" />
                          <span>View Full Analytics</span>
                        </Button>
                      </div>
                      <AnalyticsCharts />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                        <CardHeader>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-500" />
                            Job Status Distribution
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <JobStatusDistribution />
                        </CardContent>
                      </Card>

                      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                        <CardHeader>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-green-500" />
                            Live Activity Feed
                          </h3>
                        </CardHeader>
                        <CardContent>
                          <LiveActivityFeed />
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                      <CardHeader>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
                          Recent Jobs Overview
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <JobsTable searchQuery={searchQuery} />
                      </CardContent>
                    </Card>
                  </div>
                )}
                {currentView === 'analytics' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Analytics Dashboard
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Comprehensive insights into your quantum job performance
                      </p>
                    </div>
                    <AnalyticsCharts />
                  </div>
                )}
                {currentView === 'jobs' && <JobsTable searchQuery={searchQuery} />}
                {currentView === 'sessions' && <ActiveSessions />}
                {currentView === 'backends' && <AllBackendsView onBack={() => handleViewChange('overview')} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>

      {/* News Panel - floating on all dashboard views */}
      <NewsPanel />
      
      {/* AI Assistant - floating on all dashboard views */}
      <AIAssistant />
    </div>
  );
}
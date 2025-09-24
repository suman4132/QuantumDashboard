
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Area, 
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
import { useJobStats, useJobTrends, useJobs } from "@/hooks/use-jobs";
import { TrendingUp, Activity, CheckCircle, XCircle, Clock, Zap, BarChart3 } from "lucide-react";

const COLORS = {
  done: "#10b981",
  running: "#3b82f6", 
  queued: "#f59e0b",
  failed: "#ef4444",
  cancelled: "#6b7280"
};

const chartVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsCharts() {
  const { data: stats, isLoading: statsLoading } = useJobStats();
  const { data: trends, isLoading: trendsLoading } = useJobTrends();
  const { data: jobsData } = useJobs(1, 100);
  const jobs = jobsData?.jobs || [];

  // Prepare comprehensive status data
  const statusData = [
    { 
      name: "Completed", 
      value: jobs.filter(j => j.status === "done").length,
      color: COLORS.done,
      icon: CheckCircle
    },
    { 
      name: "Running", 
      value: jobs.filter(j => j.status === "running").length,
      color: COLORS.running,
      icon: Zap
    },
    { 
      name: "Queued", 
      value: jobs.filter(j => j.status === "queued").length,
      color: COLORS.queued,
      icon: Clock
    },
    { 
      name: "Failed", 
      value: jobs.filter(j => j.status === "failed").length,
      color: COLORS.failed,
      icon: XCircle
    },
    { 
      name: "Cancelled", 
      value: jobs.filter(j => j.status === "cancelled").length,
      color: COLORS.cancelled,
      icon: Activity
    },
  ].filter(item => item.value > 0);

  // Success rate data for radial chart
  const totalJobs = jobs.length;
  const successfulJobs = jobs.filter(j => j.status === "done").length;
  const successRate = totalJobs > 0 ? Math.round((successfulJobs / totalJobs) * 100) : 0;

  const successRateData = [
    {
      name: "Success Rate",
      value: successRate,
      fill: successRate >= 80 ? "#10b981" : successRate >= 60 ? "#f59e0b" : "#ef4444"
    }
  ];

  // Job performance over time data
  const performanceData = trends?.map(trend => ({
    ...trend,
    successRate: Math.round(Math.random() * 100), // Mock data - replace with real calculation
    efficiency: Math.round(Math.random() * 100), // Mock data - replace with real calculation
  })) || [];

  if (statsLoading || trendsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Job Status Distribution - Enhanced Pie Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-1"
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Distribution</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-jobs-by-status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((entry, index) => {
                const IconComponent = entry.icon;
                return (
                  <div key={entry.name} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <IconComponent className="w-4 h-4" style={{ color: entry.color }} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {entry.name}
                    </span>
                    <span className="text-xs font-bold" style={{ color: entry.color }}>
                      {entry.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Rate - Radial Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Success Rate</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={successRateData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={successRateData[0].fill}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-3xl font-bold fill-gray-900 dark:fill-white"
                  >
                    {successRate}%
                  </text>
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {successfulJobs} of {totalJobs} jobs completed successfully
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Trends - Area Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Trends</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-job-trends">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends || []}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis 
                    dataKey="label" 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorJobs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Status Bar Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Overview</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="lg:col-span-2"
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Timeline</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                  <XAxis 
                    dataKey="label" 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    fontSize={11}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    name="Jobs Submitted"
                  />
                  <Line
                    type="monotone"
                    dataKey="successRate"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                    name="Success Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

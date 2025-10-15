import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, TrendingUp, Activity, Zap, DollarSign, ArrowUp, ArrowDown,
  Server, ShoppingCart, BarChart3, Clock, Sparkles, Target, Award
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { UserLocationMap } from "./user-location-map";
import { RealTimeCalendar } from "./real-time-calendar";
import { useJobStats } from "@/hooks/use-jobs";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    scale: 1.03,
    y: -8,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/users/stats"],
  });

  const { data: jobStats } = useJobStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${((analytics?.totalRevenue || 0) / 100).toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      gradient: "from-emerald-500 via-emerald-600 to-teal-600",
      bgGradient: "from-emerald-500/10 to-teal-500/5",
      iconBg: "bg-emerald-500/20",
      description: "vs last month",
      sparkle: true
    },
    {
      title: "Total Users",
      value: (userStats?.totalUsers || 0).toLocaleString(),
      change: "+18.2%",
      trend: "up" as const,
      icon: Users,
      gradient: "from-blue-500 via-blue-600 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-500/5",
      iconBg: "bg-blue-500/20",
      description: "active accounts",
      sparkle: true
    },
    {
      title: "Quantum Jobs",
      value: (jobStats?.totalJobs || 0).toLocaleString(),
      change: "+23.1%",
      trend: "up" as const,
      icon: Server,
      gradient: "from-violet-500 via-purple-600 to-indigo-600",
      bgGradient: "from-violet-500/10 to-indigo-500/5",
      iconBg: "bg-violet-500/20",
      description: "total executed",
      sparkle: true
    },
    {
      title: "Avg Response",
      value: "1.2s",
      change: "-5.3%",
      trend: "down" as const,
      icon: Clock,
      gradient: "from-amber-500 via-orange-600 to-red-600",
      bgGradient: "from-amber-500/10 to-orange-500/5",
      iconBg: "bg-amber-500/20",
      description: "system latency",
      sparkle: false
    },
  ];

  const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2" data-testid="text-analytics-title">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Monitor your platform performance and key metrics
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Badge 
            variant="outline" 
            className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            Live Data
          </Badge>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.title}
              variants={statCardVariants}
              whileHover="hover"
              custom={index}
            >
              <Card 
                className={`relative overflow-hidden border-2 border-border/50 hover:border-primary/30 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl bg-gradient-to-br ${stat.bgGradient}`}
                data-testid={`card-stat-${stat.title.toLowerCase().replace(' ', '-')}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-white dark:from-white to-transparent rounded-full -translate-y-24 translate-x-24" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white dark:from-white to-transparent rounded-full translate-y-16 -translate-x-16" />
                </div>
                
                {/* Sparkle Effect for Positive Trends */}
                {stat.sparkle && (
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-primary/30" />
                  </motion.div>
                )}

                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm shadow-lg`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} strokeWidth={2.5} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className={`text-3xl font-bold mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} data-testid={`text-${stat.title.toLowerCase().replace(' ', '-')}-value`}>
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-500/10' : 'bg-emerald-500/10'}`}>
                      {stat.trend === "up" ? (
                        <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                      )}
                      <span className={`font-bold text-xs ${stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {stat.change}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* User Location Map */}
      <motion.div variants={item}>
        <UserLocationMap />
      </motion.div>

      {/* Enhanced Charts Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div 
          variants={item} 
          className="lg:col-span-4"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative border-2 border-border/50 hover:border-emerald-500/30 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />
            
            <CardHeader className="relative bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <motion.div 
                      className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
                      animate={{ 
                        boxShadow: [
                          "0 10px 20px rgba(16,185,129,0.3)",
                          "0 10px 30px rgba(16,185,129,0.5)",
                          "0 10px 20px rgba(16,185,129,0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="h-5 w-5 text-white" />
                    </motion.div>
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent font-bold">
                      Revenue Overview
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2 font-medium">
                    Monthly revenue performance and growth trends
                  </CardDescription>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/30 font-bold text-sm px-3 py-1.5">
                    <Award className="h-3.5 w-3.5 mr-1.5" />
                    +12.5%
                  </Badge>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 relative">
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={analytics?.userGrowthData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#14b8a6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="revenueLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                      <feOffset dx="0" dy="4" result="offsetblur"/>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs font-semibold" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    className="text-xs font-semibold"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      backdropFilter: 'blur(12px)',
                      border: '2px solid',
                      borderImage: 'linear-gradient(135deg, #10b981, #14b8a6) 1',
                      borderRadius: '16px',
                      boxShadow: '0 20px 60px rgba(16,185,129,0.25), 0 0 0 1px rgba(16,185,129,0.1)',
                      padding: '12px 16px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                    itemStyle={{ color: '#10b981', fontWeight: '600' }}
                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '8 8', opacity: 0.3 }}
                    animationDuration={300}
                  />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="url(#revenueLineGradient)"
                    strokeWidth={4}
                    fill="url(#revenueAreaGradient)"
                    fillOpacity={1}
                    dot={{ 
                      fill: '#fff', 
                      stroke: '#10b981', 
                      strokeWidth: 3, 
                      r: 6,
                      filter: 'url(#shadow)'
                    }}
                    activeDot={{ 
                      r: 8, 
                      fill: '#10b981',
                      stroke: '#fff',
                      strokeWidth: 3,
                      filter: 'url(#shadow)'
                    }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={item} 
          className="lg:col-span-3"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative border-2 border-border/50 hover:border-violet-500/30 hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden group">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.1),transparent)]" />
            
            <CardHeader className="relative bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-transparent border-b border-border/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <motion.div 
                  className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
                  animate={{ 
                    boxShadow: [
                      "0 10px 20px rgba(139,92,246,0.3)",
                      "0 10px 30px rgba(139,92,246,0.5)",
                      "0 10px 20px rgba(139,92,246,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BarChart3 className="h-5 w-5 text-white" />
                </motion.div>
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                  Monthly Revenue
                </span>
              </CardTitle>
              <CardDescription className="mt-2 font-medium">
                Last 6 months breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 relative">
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={analytics?.revenueByMonth || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barColorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="barGlowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="8 8" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs font-semibold"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    className="text-xs font-semibold"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      backdropFilter: 'blur(12px)',
                      border: '2px solid',
                      borderImage: 'linear-gradient(135deg, #8b5cf6, #a855f7) 1',
                      borderRadius: '16px',
                      boxShadow: '0 20px 60px rgba(139,92,246,0.25), 0 0 0 1px rgba(139,92,246,0.1)',
                      padding: '12px 16px'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(value: any) => [`$${(value / 100).toLocaleString()}`, 'Revenue']}
                    cursor={{ fill: 'rgba(139,92,246,0.1)' }}
                    animationDuration={300}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#barColorGradient)"
                    radius={[16, 16, 0, 0]}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Calendar */}
      <motion.div variants={item}>
        <RealTimeCalendar />
      </motion.div>

      {/* Enhanced Recent Activity */}
      <motion.div variants={item}>
        <Card className="border-2 border-border/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="mt-2">Latest platform events and updates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {[
                {
                  icon: ShoppingCart,
                  title: "New subscription",
                  desc: "Premium plan activated - user@example.com",
                  time: "2 minutes ago",
                  gradient: "from-emerald-500 to-teal-500",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20"
                },
                {
                  icon: Users,
                  title: "User milestone reached",
                  desc: "2,000 active users achieved",
                  time: "1 hour ago",
                  gradient: "from-blue-500 to-cyan-500",
                  bg: "bg-blue-500/10",
                  border: "border-blue-500/20"
                },
                {
                  icon: Server,
                  title: "Quantum job completed",
                  desc: "Grover's Algorithm - 15 qubits",
                  time: "3 hours ago",
                  gradient: "from-violet-500 to-purple-500",
                  bg: "bg-violet-500/10",
                  border: "border-violet-500/20"
                },
                {
                  icon: Zap,
                  title: "System update deployed",
                  desc: "Backend performance improvements",
                  time: "5 hours ago",
                  gradient: "from-amber-500 to-orange-500",
                  bg: "bg-amber-500/10",
                  border: "border-amber-500/20"
                }
              ].map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 8 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${activity.border} ${activity.bg} hover:shadow-lg transition-all cursor-pointer group`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activity.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.desc}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap font-medium px-3 py-1 rounded-full bg-muted/50">{activity.time}</span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

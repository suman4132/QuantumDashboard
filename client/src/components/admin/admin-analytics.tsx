import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, TrendingUp, Activity, Zap, DollarSign, ArrowUp, ArrowDown,
  Server, ShoppingCart, BarChart3, Clock, Sparkles, Target, Award, FileText
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { UserLocationMap } from "./user-location-map";
import { RealTimeCalendar } from "./real-time-calendar";
import { QuantumSystemsMonitor } from "./quantum-systems-monitor";
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
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export default function AdminAnalytics() {
  const { data: analytics, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/analytics"],
  });

  const { data: userStats } = useQuery<any>({
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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Enhanced Header - More Compact Professional */}
      <motion.div variants={item} className="flex items-end justify-between pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" data-testid="text-analytics-title">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
            <Target className="h-4 w-4 text-primary/80" />
            Platform performance metrics and real-time insights
          </p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full font-mono">
                {new Date().toLocaleDateString()}
            </span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge 
                variant="outline" 
                className="px-3 py-1 text-xs font-semibold border-emerald-500/30 text-emerald-600 bg-emerald-500/5 gap-1.5"
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live System
            </Badge>
            </motion.div>
        </div>
      </motion.div>
      
      {/* Live Quantum Systems Monitor - Compact */}
      <motion.div variants={item}>
        <QuantumSystemsMonitor />
      </motion.div>

      {/* Enhanced Stats Cards - Uniform Height */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                className={`h-full relative overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md bg-gradient-to-br ${stat.bgGradient}`}
                data-testid={`card-stat-${stat.title.toLowerCase().replace(' ', '-')}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-current rounded-full -translate-y-10 translate-x-10" />
                </div>
                
                <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
                   <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            {stat.title}
                          </p>
                          <div className={`text-2xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                             {stat.value}
                          </div>
                      </div>
                      <div className={`p-2.5 rounded-lg ${stat.iconBg} backdrop-blur-sm`}>
                        <Icon className={`h-5 w-5 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`} strokeWidth={2.5} />
                      </div>
                   </div>
                   
                   <div className="mt-4 flex items-center gap-2">
                        <Badge 
                            variant="secondary" 
                            className={`h-5 px-1.5 text-[10px] font-bold ${
                                stat.trend === 'up' 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                                : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                            }`}
                        >
                            {stat.trend === "up" ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                            {stat.change}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{stat.description}</span>
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

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div 
          variants={item} 
          className="lg:col-span-4"
        >
          <Card className="h-full border border-border/50 shadow-sm rounded-xl overflow-hidden bg-card/50">
            <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    Revenue Growth
                  </CardTitle>
                  <CardDescription className="text-xs">6 month performance trend</CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">YEARLY</Badge>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analytics?.userGrowthData || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: '12px' }}
                    cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="signups"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={item} 
          className="lg:col-span-3"
        >
          <Card className="h-full border border-border/50 shadow-sm rounded-xl overflow-hidden bg-card/50">
            <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-row items-center justify-between">
              <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-violet-500" />
                    Monthly Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">Revenue distribution</CardDescription>
              </div>
              <SelectButton />
            </CardHeader>
            <CardContent className="pt-6 relative">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics?.revenueByMonth || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    tickFormatter={(value) => `$${(value/1000)}k`}
                  />
                  <Tooltip 
                     cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                     contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

       {/* Bottom Section: Pro 2:1 Split for Calendar & Logs */}
       <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Calendar - Main Widget (2/3 width) */}
        <motion.div variants={item} className="lg:col-span-2 min-h-[500px]">
          <RealTimeCalendar />
        </motion.div>

        {/* Recent Activity - Side Feed (1/3 width) - Matching Height */}
        <motion.div variants={item} className="lg:col-span-1 h-full">
          <Card className="h-full border border-border/50 shadow-sm rounded-2xl overflow-hidden flex flex-col bg-card/40 backdrop-blur-md">
            <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Activity className="h-4 w-4 text-orange-500" />
                  Live Feed
                </CardTitle>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Real-time</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
              <div className="divide-y divide-border/30">
                {[
                  {
                    icon: ShoppingCart,
                    title: "Subscription Upgraded",
                    desc: "Enterprise Plan",
                    user: "Acme Corp",
                    time: "2m ago",
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10"
                  },
                  {
                    icon: Users,
                    title: "New Registration",
                    desc: "via Referral #492",
                    user: "sarah.w@tech.io",
                    time: "14m ago",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10"
                  },
                  {
                    icon: Server,
                    title: "Quantum Job Success",
                    desc: "Grover's Algorithm",
                    user: "Researcher ID: 942",
                    time: "32m ago",
                    color: "text-violet-500",
                    bg: "bg-violet-500/10"
                  },
                  {
                    icon: Zap,
                    title: "High Latency Warning",
                    desc: "> 500ms on Node 4",
                    user: "System Monitor",
                    time: "1h ago",
                    color: "text-amber-500",
                    bg: "bg-amber-500/10"
                  },
                   {
                    icon: FileText,
                    title: "Invoice Generated",
                    desc: "#INV-2024-001",
                    user: "Billing System",
                    time: "2h ago",
                    color: "text-slate-500",
                    bg: "bg-slate-500/10"
                  },
                  {
                    icon: Award,
                    title: "Goal Reached",
                    desc: "1000 Daily Users",
                    user: "Analytics Engine",
                    time: "4h ago",
                    color: "text-pink-500",
                    bg: "bg-pink-500/10"
                  }
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors group cursor-default"
                    >
                      <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border/50 shadow-sm ${activity.bg}`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-xs font-semibold truncate text-foreground/90 group-hover:text-primary transition-colors">
                            {activity.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">{activity.time}</span>
                        </div>
                         <p className="text-[11px] text-muted-foreground truncate">{activity.desc} <span className="text-border mx-1">|</span> {activity.user}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
             <div className="p-3 border-t border-border/30 bg-muted/10 text-center">
                 <button className="text-[11px] font-medium text-primary hover:text-primary/80 hover:underline transition-colors">
                    View full activity log
                 </button>
              </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Simple internal component to clean up main render
function SelectButton() {
    return (
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-0.5 border border-border/50">
            <div className="px-2 py-0.5 bg-background shadow-sm rounded-md text-[10px] font-medium">6M</div>
            <div className="px-2 py-0.5 text-muted-foreground text-[10px] font-medium hover:text-foreground cursor-pointer">1Y</div>
            <div className="px-2 py-0.5 text-muted-foreground text-[10px] font-medium hover:text-foreground cursor-pointer">ALL</div>
        </div>
    )
}

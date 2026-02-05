import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle, XCircle, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { useJobStats } from "@/hooks/use-jobs";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

async function fetchJobStats() {
  const response = await fetch("/api/analytics/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch job stats");
  }
  return response.json();
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 },
  },
};

export function StatsCards() {
  const { data: stats, isLoading: statsLoading } = useJobStats();

  // Only show loading if we have NO data at all
  if (statsLoading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-16"></div>
              <div className="h-4 w-4 bg-gradient-to-r from-gray-300 to-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-12 mb-1"></div>
              <div className="h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Use the calculated stats from local storage (Simulated Jobs)
  const displayStats = stats;

  const statsConfig = [
    {
      title: "Total Jobs",
      value: displayStats?.totalJobs || 0,
      icon: Activity,
      description: "All quantum jobs",
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      title: "Running",
      value: displayStats?.runningJobs || 0,
      icon: Zap,
      description: "Currently executing",
      color: "text-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
      pulse: true,
    },
    {
      title: "Queued",
      value: displayStats?.queuedJobs || 0,
      icon: Clock,
      description: "Waiting in queue",
      color: "text-yellow-600",
      bgGradient: "from-yellow-500/10 to-yellow-600/10",
      borderColor: "border-yellow-200",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Completed",
      value: displayStats?.completedJobs || 0,
      icon: CheckCircle,
      description: "Successfully finished",
      color: "text-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      title: "Failed",
      value: displayStats?.failedJobs || 0,
      icon: XCircle,
      description: "Execution failed",
      color: "text-red-600",
      bgGradient: "from-red-500/10 to-red-600/10",
      borderColor: "border-red-200",
      iconBg: "bg-red-100",
    },
    {
      title: "Success Rate",
      value: `${displayStats?.successRate || 0}%`,
      icon: TrendingUp,
      description: "Job success ratio",
      color: "text-purple-600",
      bgGradient: "from-purple-500/10 to-purple-600/10",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {statsConfig.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105",
              "bg-gradient-to-br", stat.bgGradient,
              "border-0 shadow-lg",
              stat.borderColor,
              stat.pulse && stat.value > 0 ? "animate-pulse" : ""
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", stat.iconBg, stat.pulse && stat.value > 0 ? "animate-bounce" : "")}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", stat.color)}>
                {typeof stat.value === 'number' ? (
                  <AnimatedCounter value={stat.value} />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {stat.description}
              </p>
              {/* Live indicator for running jobs */}
              {stat.pulse && stat.value > 0 && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">LIVE</span>
                </div>
              )}
            </CardContent>
            {/* Subtle background pattern */}
            <div className="absolute -right-4 -top-4 opacity-10">
              <stat.icon className="h-16 w-16" />
            </div>
          </Card>
        ))}
      </div>
  );
}
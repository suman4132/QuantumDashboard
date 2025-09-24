import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBackends } from "@/hooks/use-jobs";
import type { BackendStatus } from "@shared/schema";

const statusColors: Record<BackendStatus, string> = {
  available: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
  busy: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
  maintenance: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700",
  offline: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700",
};

const statusBadgeColors: Record<BackendStatus, string> = {
  available: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  busy: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  maintenance: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  offline: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
};

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

interface BackendAdvisorProps {
  onViewChange?: (view: string) => void;
}

export function BackendAdvisor({ onViewChange }: BackendAdvisorProps) {
  const { data: backends = [], isLoading } = useBackends();

  const sortedBackends = [...backends].sort((a, b) => {
    const statusPriority: Record<BackendStatus, number> = { available: 0, busy: 1, maintenance: 2, offline: 3 };
    return statusPriority[a.status as BackendStatus] - statusPriority[b.status as BackendStatus];
  });

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Backend Advisor</h3>
          <motion.div 
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedBackends.map((backend, index) => (
          <motion.div
            key={backend.id}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`p-4 border rounded-lg cursor-pointer ${statusColors[backend.status as BackendStatus]}`}
            data-testid={`backend-${backend.id}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium text-gray-900 dark:text-white">{backend.name}</div>
              <Badge className={statusBadgeColors[backend.status as BackendStatus]}>
                {backend.status.charAt(0).toUpperCase() + backend.status.slice(1)}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {backend.status === "available" && (
                <>Queue: {backend.queueLength} jobs • Avg wait: {backend.averageWaitTime}s</>
              )}
              {backend.status === "busy" && (
                <>Queue: {backend.queueLength} jobs • Avg wait: ~{Math.floor(backend.averageWaitTime! / 60)}min</>
              )}
              {backend.status === "maintenance" && (
                <>Expected back: In maintenance</>
              )}
              {backend.status === "offline" && (
                <>Currently offline</>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{backend.qubits} qubits</span>
              <span>Uptime: {backend.uptime}</span>
            </div>
          </motion.div>
        ))}

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => onViewChange?.('all-backends')}
          data-testid="button-view-all-backends"
        >
          View All Backends
        </Button>
      </CardContent>
    </Card>
  );
}

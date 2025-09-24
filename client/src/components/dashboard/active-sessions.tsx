import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSessions } from "@/hooks/use-jobs";
import { formatDistanceToNow } from "date-fns";

const sessionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
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

interface ActiveSessionsProps {
  onOpenSessionForm?: () => void;
}

export function ActiveSessions({ onOpenSessionForm }: ActiveSessionsProps) {
  const { data: sessions = [], isLoading } = useSessions();

  const activeSessions = sessions.filter(session => session.status === "active");

  if (isLoading) {
    return (
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeSessions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No active sessions</p>
          </div>
        ) : (
          activeSessions.map((session, index) => (
            <motion.div
              key={session.id}
              custom={index}
              variants={sessionVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-lg cursor-pointer group"
              data-testid={`session-${session.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900 dark:text-white text-sm">{session.name}</div>
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {session.jobCount} jobs • Started {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Last activity: {formatDistanceToNow(new Date(session.lastActivity), { addSuffix: true })}
              </div>
            </motion.div>
          ))
        )}

        <Button 
          variant="outline"
          className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={onOpenSessionForm}
          data-testid="button-new-session"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </CardContent>
    </Card>
  );
}

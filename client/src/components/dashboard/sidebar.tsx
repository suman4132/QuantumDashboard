import { motion } from "framer-motion";
import { BackendAdvisor } from "./backend-advisor";
import { ActiveSessions } from "./active-sessions";
import { ExportOptions } from "./export-options";
import { SystemStatus } from "./system-status";

const sidebarVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
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

interface SidebarProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  onOpenSessionForm?: () => void;
}

export function Sidebar({ currentView, onViewChange, onOpenSessionForm }: SidebarProps) {
  return (
    <motion.div
      className="xl:col-span-1 space-y-6"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <BackendAdvisor onViewChange={onViewChange} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ActiveSessions onOpenSessionForm={onOpenSessionForm} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ExportOptions />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SystemStatus />
      </motion.div>
    </motion.div>
  );
}
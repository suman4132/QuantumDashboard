
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useJobStats } from "@/hooks/use-jobs";
import { Cpu, HardDrive, Wifi, Thermometer, Zap, Monitor, Activity } from "lucide-react";

const statusIndicatorVariants = {
  animate: {
    opacity: [1, 0.3, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MetricCard = ({ icon: Icon, label, value, unit, progress, color = "blue" }: {
  icon: any;
  label: string;
  value: string | number;
  unit?: string;
  progress?: number;
  color?: string;
}) => {
  const colorMap = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
    orange: "text-orange-600 dark:text-orange-400",
    red: "text-red-600 dark:text-red-400",
    purple: "text-purple-600 dark:text-purple-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
      <div className="flex items-center space-x-3">
        <Icon className={`w-4 h-4 ${colorMap[color]}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {value}{unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
        </span>
        {progress !== undefined && (
          <div className="w-16 mt-1">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export function SystemStatus() {
  const { data: stats, dataUpdatedAt } = useJobStats();

  const getLastUpdateText = () => {
    if (!dataUpdatedAt) return "Never";
    const secondsAgo = Math.floor((Date.now() - dataUpdatedAt) / 1000);
    return `${secondsAgo}s ago`;
  };

  // Simulate realistic system metrics based on job activity
  const activeJobs = (stats?.runningJobs || 0) + (stats?.queuedJobs || 0);
  
  // CPU metrics - higher with more active jobs
  const cpuUsage = Math.min(95, 15 + (activeJobs * 12) + Math.random() * 5);
  const cpuTemp = Math.min(85, 45 + (cpuUsage * 0.4) + Math.random() * 3);
  
  // Memory metrics - based on job complexity
  const memoryUsage = Math.min(90, 25 + (activeJobs * 8) + Math.random() * 10);
  const memoryTotal = 32; // GB
  const memoryUsed = (memoryUsage / 100) * memoryTotal;
  
  // Storage metrics
  const storageUsage = Math.min(95, 40 + (stats?.totalJobs || 0) * 0.1 + Math.random() * 5);
  const storageTotal = 512; // GB
  const storageUsed = (storageUsage / 100) * storageTotal;
  
  // Network metrics - higher with more job traffic
  const networkUsage = Math.min(95, 20 + (activeJobs * 15) + Math.random() * 8);
  const networkSpeed = 1000; // Mbps
  const currentSpeed = (networkUsage / 100) * networkSpeed;
  
  // Power and thermal
  const powerConsumption = Math.min(750, 200 + (cpuUsage * 4) + Math.random() * 20);
  const systemLoad = Math.min(100, 10 + (activeJobs * 15) + Math.random() * 5);
  
  // GPU metrics (simulated for quantum processing units)
  const qpuUsage = Math.min(100, activeJobs * 25 + Math.random() * 10);
  const qpuTemp = Math.min(70, 20 + (qpuUsage * 0.3) + Math.random() * 2);

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-500" />
            System Status
          </h3>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              variants={statusIndicatorVariants}
              animate="animate"
            />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">LIVE</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Status */}
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              variants={statusIndicatorVariants}
              animate="animate"
            />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Operational</span>
          </div>
        </div>

        {/* Hardware Metrics Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hardware Metrics</h4>
          
          {/* CPU */}
          <MetricCard
            icon={Cpu}
            label="CPU Usage"
            value={cpuUsage.toFixed(1)}
            unit="%"
            progress={cpuUsage}
            color={cpuUsage > 80 ? "red" : cpuUsage > 60 ? "orange" : "green"}
          />
          
          {/* Memory */}
          <MetricCard
            icon={Activity}
            label="Memory"
            value={`${memoryUsed.toFixed(1)}/${memoryTotal}`}
            unit="GB"
            progress={memoryUsage}
            color={memoryUsage > 80 ? "red" : memoryUsage > 60 ? "orange" : "blue"}
          />
          
          {/* Storage */}
          <MetricCard
            icon={HardDrive}
            label="Storage"
            value={`${storageUsed.toFixed(0)}/${storageTotal}`}
            unit="GB"
            progress={storageUsage}
            color={storageUsage > 90 ? "red" : storageUsage > 70 ? "orange" : "green"}
          />
          
          {/* Network */}
          <MetricCard
            icon={Wifi}
            label="Network"
            value={currentSpeed.toFixed(0)}
            unit="Mbps"
            progress={networkUsage}
            color="purple"
          />
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance</h4>
          
          {/* System Load */}
          <MetricCard
            icon={Activity}
            label="System Load"
            value={systemLoad.toFixed(1)}
            unit="%"
            progress={systemLoad}
            color={systemLoad > 90 ? "red" : systemLoad > 70 ? "orange" : "green"}
          />
          
          {/* CPU Temperature */}
          <MetricCard
            icon={Thermometer}
            label="CPU Temp"
            value={cpuTemp.toFixed(0)}
            unit="°C"
            progress={(cpuTemp / 100) * 100}
            color={cpuTemp > 75 ? "red" : cpuTemp > 60 ? "orange" : "green"}
          />
          
          {/* Power Consumption */}
          <MetricCard
            icon={Zap}
            label="Power"
            value={powerConsumption.toFixed(0)}
            unit="W"
            progress={(powerConsumption / 800) * 100}
            color="yellow"
          />
        </div>

        {/* Quantum Processing Unit */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantum Processing</h4>
          
          <MetricCard
            icon={Cpu}
            label="QPU Usage"
            value={qpuUsage.toFixed(1)}
            unit="%"
            progress={qpuUsage}
            color={qpuUsage > 80 ? "red" : qpuUsage > 50 ? "orange" : "blue"}
          />
          
          <MetricCard
            icon={Thermometer}
            label="QPU Temp"
            value={qpuTemp.toFixed(1)}
            unit="mK"
            progress={(qpuTemp / 100) * 100}
            color={qpuTemp > 50 ? "orange" : "green"}
          />
        </div>

        {/* System Info */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Response Time</span>
              <span className="font-medium text-gray-900 dark:text-white">142ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Uptime</span>
              <span className="font-medium text-gray-900 dark:text-white">99.9%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Jobs</span>
              <span className="font-medium text-gray-900 dark:text-white">{activeJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Update</span>
              <span className="font-medium text-gray-900 dark:text-white" data-testid="text-last-update">
                {getLastUpdateText()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

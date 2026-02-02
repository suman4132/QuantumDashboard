import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, Activity, Cpu, Thermometer, Wind, AlertTriangle, 
  Terminal, CheckCircle2, RefreshCw, Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Qubit State
type QubitState = "idle" | "active" | "entangled" | "error" | "decohering";

interface Qubit {
  id: number;
  state: QubitState;
  coherence: number; // 0-100
  temperature: number; // mK
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
}

const generateQubits = (count: number): Qubit[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    state: "idle",
    coherence: 100,
    temperature: 15,
  }));
};

const getStatusColor = (state: QubitState) => {
  switch (state) {
    case "idle": return "bg-slate-800 border-slate-700";
    case "active": return "bg-cyan-500/20 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    case "entangled": return "bg-purple-500/20 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]";
    case "error": return "bg-red-500/20 border-red-500";
    case "decohering": return "bg-yellow-500/20 border-yellow-500";
    default: return "bg-slate-800";
  }
};

const getStatusDot = (state: QubitState) => {
  switch (state) {
    case "idle": return "bg-slate-500";
    case "active": return "bg-cyan-400";
    case "entangled": return "bg-purple-400";
    case "error": return "bg-red-500";
    case "decohering": return "bg-yellow-400";
  }
};

export function QuantumSystemsMonitor() {
  const [qubits, setQubits] = useState<Qubit[]>(generateQubits(64));
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'System initialization complete' },
    { id: '2', timestamp: new Date().toLocaleTimeString(), level: 'success', message: 'Cryostat stable at 15mK' },
    { id: '3', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'Quantum Volume calibration succeeded' },
  ]);
  const [systemLoad, setSystemLoad] = useState(42);
  const [temperature, setTemperature] = useState(15.2);
  const [coherenceTime, setCoherenceTime] = useState(124); // microseconds

  // Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate Qubit Fluctuations
      setQubits(prev => prev.map(q => {
        const rand = Math.random();
        let newState = q.state;
        let newCoherence = q.coherence;

        if (q.state === "active" && rand > 0.8) newState = "idle";
        else if (q.state === "idle" && rand > 0.95) newState = "active";
        else if (rand > 0.98) newState = "entangled";
        else if (rand > 0.995) newState = "error";

        if (newState === "active") newCoherence = Math.max(0, q.coherence - Math.random() * 5);
        if (newState === "idle") newCoherence = Math.min(100, q.coherence + Math.random() * 2);

        return { ...q, state: newState, coherence: newCoherence };
      }));

      // Simulate Logs
      if (Math.random() > 0.7) {
        const messages = [
          { l: 'info', m: 'Pulse shape optimization running...' },
          { l: 'success', m: 'Job #88291 completed successfully' },
          { l: 'warning', m: 'Microwave leakage detected on Line 4' },
          { l: 'info', m: 'Calibrating readout resonators' },
          { l: 'active', m: 'Executing Grover Search algorithm' }
        ];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const newLog: LogEntry = {
          id: Math.random().toString(36),
          timestamp: new Date().toLocaleTimeString(),
          level: msg.l as any,
          message: msg.m
        };
        setLogs(prev => [newLog, ...prev].slice(0, 50));
      }

      // Simulate Metrics
      setSystemLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 5)));
      setTemperature(prev => 15 + (Math.random() - 0.5) * 0.5);
      setCoherenceTime(prev => 120 + (Math.random() - 0.5) * 10);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* 64-Qubit Processor Visualization */}
      <Card className="lg:col-span-2 border-slate-800 bg-slate-950/50 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Cpu className="h-5 w-5" />
              Quantum Processor Unit (QPU)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Real-time qubit state monitoring • 64-Qubit Architecture
            </CardDescription>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400 mr-2">
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>{qubits.filter(q => q.state === 'active').length} Active</span>
               <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>{qubits.filter(q => q.state === 'entangled').length} Entangled</span>
             </div>
             <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-950/30 animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              LIVE
             </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Qubit Grid */}
          <div className="grid grid-cols-8 gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800/50 shadow-inner">
            {qubits.map((qubit) => (
              <motion.div
                key={qubit.id}
                layout
                initial={false}
                animate={{ 
                  backgroundColor: qubit.state === 'active' ? 'rgba(6,182,212,0.2)' : 
                                  qubit.state === 'entangled' ? 'rgba(168,85,247,0.2)' : 
                                  qubit.state === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.5)',
                  borderColor: qubit.state === 'active' ? 'rgb(6,182,212)' : 
                               qubit.state === 'entangled' ? 'rgb(168,85,247)' : 
                               qubit.state === 'error' ? 'rgb(239,68,68)' : 'rgba(51,65,85,0.5)'
                }}
                className={`
                  aspect-square rounded-md border text-[10px] flex flex-col items-center justify-center relative cursor-help group transition-colors duration-300
                  ${getStatusColor(qubit.state)}
                `}
              >
                <div className={`w-1.5 h-1.5 rounded-full mb-1 ${getStatusDot(qubit.state)} box-shadow-[0_0_5px_currentColor]`} />
                <span className="text-slate-500 font-mono opacity-50 group-hover:opacity-100">q{qubit.id}</span>
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-32 bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs">
                  <div className="font-bold text-slate-300 mb-1">Qubit {qubit.id}</div>
                  <div className="flex justify-between text-slate-400"><span>State:</span> <span className="text-white capitalize">{qubit.state}</span></div>
                  <div className="flex justify-between text-slate-400"><span>Coherence:</span> <span className={`${qubit.coherence > 80 ? 'text-green-400' : 'text-yellow-400'}`}>{qubit.coherence.toFixed(0)}%</span></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500" /> Idle</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]" /> Active</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_5px_purple]" /> Entangled</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_red]" /> Error</div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics & Logs */}
      <div className="space-y-6">
        {/* Environmental Metrics */}
        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Cryogenic Environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Thermometer className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-200">{temperature.toFixed(2)} mK</div>
                  <div className="text-xs text-slate-500">Dilution Refrigerator Temp</div>
                </div>
              </div>
              <Wind className={`h-5 w-5 text-blue-500/50 ${temperature > 15.5 ? 'animate-spin' : ''}`} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>System Load</span>
                <span>{systemLoad.toFixed(1)}%</span>
              </div>
              <Progress value={systemLoad} className="h-1.5" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Avg. Coherence (T1)</span>
                <span>{coherenceTime.toFixed(0)} μs</span>
              </div>
              <Progress value={(coherenceTime / 200) * 100} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Live Logs Terminal */}
        <Card className="border-slate-800 bg-black/80 backdrop-blur-xl flex-1 h-[260px] flex flex-col">
          <CardHeader className="py-3 border-b border-slate-800/50">
            <CardTitle className="flex items-center gap-2 text-sm font-mono text-green-400">
              <Terminal className="h-4 w-4" />
              SYSTEM_LOGS://LIVE
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden font-mono text-xs">
            <ScrollArea className="h-full p-4">
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {logs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      <span className="text-slate-600">[{log.timestamp}]</span>
                      <span className={`
                        ${log.level === 'info' ? 'text-blue-400' : ''}
                        ${log.level === 'warning' ? 'text-yellow-400' : ''}
                        ${log.level === 'error' ? 'text-red-400' : ''}
                        ${log.level === 'success' ? 'text-green-400' : ''}
                      `}>
                        {log.level.toUpperCase()}:
                      </span>
                      <span className="text-slate-300">{log.message}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

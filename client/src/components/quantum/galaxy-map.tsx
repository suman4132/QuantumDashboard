
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Level } from "@/pages/quantum-quest";
import { Lock, Star, CheckCircle, Play, ChevronRight, Atom, Zap, Brain, Rocket, Disc } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Updated coordinates for a more "Game Level Map" flow (zigzag/S-curve)
const LEVEL_COORDINATES: Record<string, { x: number; y: number }> = {
  // Sector 1: The Awakening (Bottom Left)
  "qb-101": { x: 15, y: 80 },
  "qb-102": { x: 25, y: 75 },
  "qb-103": { x: 20, y: 65 },

  // Sector 2: The Gatekeeper (Mid-Left)
  "qg-201": { x: 15, y: 50 },
  "qg-202": { x: 25, y: 45 },
  "qg-203": { x: 35, y: 50 },
  "qg-204": { x: 40, y: 40 },

  // Sector 3: Entanglement Core (Center)
  "qe-301": { x: 50, y: 50 },
  "qe-302": { x: 60, y: 55 },
  "qe-303": { x: 65, y: 45 },
  "qe-304": { x: 55, y: 35 },

  // Sector 4: Algorithm Expanse (Right)
  "qa-401": { x: 70, y: 30 },
  "qa-402": { x: 80, y: 25 },
  "qa-403": { x: 85, y: 35 },
  "qa-404": { x: 75, y: 45 },

  // Sector 5: Research Frontier (Top Center)
  "qr-501": { x: 65, y: 15 },
  "qr-502": { x: 55, y: 10 },
  "qr-503": { x: 45, y: 15 },
  "qr-504": { x: 35, y: 10 },
  "qr-505": { x: 45, y: 5 },
};

// Visual "Zones" for background
const ZONES = [
  { name: "Sector 01: Fundamentals", x: 20, y: 85, color: "text-blue-500" },
  { name: "Sector 02: Logic Gates", x: 25, y: 40, color: "text-purple-500" },
  { name: "Sector 03: Entanglement", x: 60, y: 60, color: "text-pink-500" },
  { name: "Sector 04: Algorithms", x: 80, y: 20, color: "text-yellow-500" },
  { name: "Sector 05: Deep Research", x: 45, y: 20, color: "text-red-500" },
];

interface GalaxyMapProps {
  levels: Level[];
  onLevelClick: (level: Level) => void;
}

export function GalaxyMap({ levels, onLevelClick }: GalaxyMapProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const selectedLevel = levels.find(l => l.id === selectedLevelId);

  const handleNodeClick = (level: Level) => {
    setSelectedLevelId(level.id);
  };

  const handleStartMission = () => {
    if (selectedLevel && !selectedLevel.locked) {
      onLevelClick(selectedLevel);
    }
  };

  // Parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const connections = [
    ["qb-101", "qb-102"], ["qb-102", "qb-103"], ["qb-103", "qg-201"],
    ["qg-201", "qg-202"], ["qg-202", "qg-203"], ["qg-203", "qg-204"], ["qg-204", "qe-301"],
    ["qe-301", "qe-302"], ["qe-302", "qe-303"], ["qe-303", "qe-304"], ["qe-304", "qa-401"],
    ["qa-401", "qa-402"], ["qa-402", "qa-403"], ["qa-403", "qa-404"], ["qa-404", "qr-501"],
    ["qr-501", "qr-502"], ["qr-502", "qr-503"], ["qr-503", "qr-504"], ["qr-504", "qr-505"]
  ];

  return (
    <div 
        className="relative w-full h-[800px] bg-[#02040a] rounded-xl overflow-hidden shadow-2xl border border-blue-900/40 group select-none"
        onMouseMove={handleMouseMove}
    >
      {/* --- LAYER 0: Moving Nebulas (Parallax) --- */}
      <motion.div 
         className="absolute inset-[-20%] pointer-events-none opacity-40 mix-blend-screen"
         animate={{ 
             x: mousePosition.x * -30, 
             y: mousePosition.y * -30,
         }}
         transition={{ type: "tween", ease: "linear", duration: 0 }}
      >
           <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-900/40 rounded-full blur-[100px]" />
           <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-indigo-900/30 rounded-full blur-[80px]" />
      </motion.div>

      {/* --- LAYER 1: Tactical Grid --- */}
      <div className="absolute inset-0" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)',
             backgroundSize: '80px 80px',
             transform: 'perspective(1000px) rotateX(20deg) scale(1.5)',
             transformOrigin: 'center 80%'
           }} 
      />
      
      {/* --- LAYER 2: Starfield --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.5,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: Math.random() > 0.9 ? '3px' : '1px',
                height: Math.random() > 0.9 ? '3px' : '1px',
              }}
            />
         ))}
      </div>

      {/* --- LAYER 3: Zone Labels --- */}
      {ZONES.map((zone, i) => (
          <motion.div key={i} 
               className={`absolute font-mono text-xs tracking-[0.2em] font-bold opacity-40 ${zone.color} border-l-2 border-current pl-2`}
               style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
               animate={{ x: mousePosition.x * 20, y: mousePosition.y * 20 }}
          >
              <div className="text-[10px] opacity-70 mb-1">COORDS: {zone.x}::{zone.y}</div>
              {zone.name}
          </motion.div>
      ))}

      {/* --- LAYER 4: Connections & Data Streams --- */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
            </linearGradient>
        </defs>
        {connections.map(([startId, endId], i) => {
          const start = LEVEL_COORDINATES[startId];
          const end = LEVEL_COORDINATES[endId];
          const startLevel = levels.find(l => l.id === startId);
          const endLevel = levels.find(l => l.id === endId);

          if (!start || !end || !startLevel || !endLevel) return null;

          const isUnlocked = !endLevel.locked;

          return (
            <g key={i}>
                {/* Base Line */}
                <motion.line
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isUnlocked ? 0.4 : 0.1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                stroke={isUnlocked ? "#3B82F6" : "#4B5563"}
                strokeWidth={isUnlocked ? "2" : "1"}
                strokeDasharray={isUnlocked ? "none" : "8 4"}
                />
                
                {/* Traveling Data Packet (Only on unlocked lines) */}
                {isUnlocked && (
                    <motion.circle r="3" fill="#60A5FA" filter="url(#glow)">
                        <animateMotion 
                            dur={`${Math.random() * 2 + 2}s`} 
                            repeatCount="indefinite"
                            path={`M${start.x * 8},${start.y * 8} L${end.x * 8},${end.y * 8}`} // Note: coordinates need mapped to SVG space logic or use percentage via manual interpolation if animateMotion is tricky in React.
                            // Simplified approach: Moving line dash
                        />
                         {/* Fallback to simple dashed line animation since animateMotion path needs absolute headers */}
                    </motion.circle>
                )}
                 {/* Better Data Stream Effect using StrokeDashoffset */}
                {isUnlocked && (
                     <motion.line
                        x1={`${start.x}%`}
                        y1={`${start.y}%`}
                        x2={`${end.x}%`}
                        y2={`${end.y}%`}
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        strokeDasharray="10 100"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        animate={{ strokeDashoffset: [-110, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
                     />
                )}
            </g>
          );
        })}
      </svg>

      {/* --- LAYER 5: Nodes (Complex Gyroscopes) --- */}
      <div className="absolute inset-0 z-10">
          {levels.map((level) => {
            const coords = LEVEL_COORDINATES[level.id] || { x: 50, y: 50 };
            const status = level.completed ? "completed" : level.locked ? "locked" : "active";
            const isSelected = selectedLevelId === level.id;
            
            return (
              <div 
                key={level.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/node cursor-pointer"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                onClick={() => !level.locked && handleNodeClick(level)}
              >
                  {/* Outer Targeting Rings */}
                  {isSelected && (
                      <div className="absolute inset-0 -m-12 border border-white/20 rounded-full animate-[spin_10s_linear_infinite]" 
                           style={{ width: '160%', height: '160%', left: '-30%', top: '-30%' }}>
                           <div className="absolute top-0 left-1/2 w-1 h-3 bg-blue-400 -translate-x-1/2" />
                           <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-blue-400 -translate-x-1/2" />
                           <div className="absolute left-0 top-1/2 h-1 w-3 bg-blue-400 -translate-y-1/2" />
                           <div className="absolute right-0 top-1/2 h-1 w-3 bg-blue-400 -translate-y-1/2" />
                      </div>
                  )}

                  {/* Complex Node Structure */}
                  <div className="relative">
                      {/* Active/Unlocked Ambient Rings */}
                      {(status !== 'locked') && (
                          <>
                            <div className={cn(
                                "absolute inset-0 -m-1 border rounded-full animate-[spin_3s_linear_infinite]",
                                status === 'completed' ? "border-green-500/40" : "border-blue-500/40"
                            )} />
                            <div className={cn(
                                "absolute inset-0 -m-3 border rounded-full animate-[spin_5s_linear_infinite_reverse] opacity-50",
                                status === 'completed' ? "border-green-500/20" : "border-blue-500/20"
                            )} />
                          </>
                      )}
                      
                      {/* Core Node Button */}
                      <motion.div
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden backdrop-blur-sm z-10",
                          status === 'completed' && "bg-green-900/40 border-2 border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.5)]",
                          status === 'active' && "bg-blue-900/40 border-2 border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.8)]",
                          status === 'locked' && "bg-gray-900/80 border border-gray-700",
                          isSelected && "scale-110 bg-blue-900/80 ring-4 ring-blue-400/30"
                        )}
                        whileHover={{ scale: 1.2 }}
                      >
                         {/* Internal Icon Rotation */}
                         <motion.div 
                             animate={status === 'active' ? { rotate: 360 } : {}}
                             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                         >
                            {status === 'completed' && <CheckCircle className="w-6 h-6 text-green-400" />}
                            {status === 'locked' && <Lock className="w-5 h-5 text-gray-500" />}
                            {status === 'active' && (
                                <div className="text-blue-200">
                                    {level.id.includes('qb') && <Atom className="w-6 h-6" />}
                                    {level.id.includes('qg') && <Zap className="w-6 h-6" />}
                                    {level.id.includes('qe') && <Disc className="w-6 h-6" />}
                                    {level.id.includes('qa') && <Brain className="w-6 h-6" />}
                                    {level.id.includes('qr') && <Star className="w-6 h-6" />}
                                </div>
                            )}
                         </motion.div>
                         
                         {/* Glossy Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-full" />
                      </motion.div>
                  </div>

                  {/* Level Title Label - Futuristic Tag */}
                  <div className={cn(
                      "mt-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest transition-all duration-300 border border-transparent",
                      status === 'locked' ? "text-gray-600 bg-transparent" : "text-blue-200 bg-blue-900/80 border-blue-500/30 shadow-lg",
                      isSelected && "bg-blue-600 text-white border-blue-400 translate-y-1"
                  )}>
                      {level.title.toUpperCase()}
                  </div>
              </div>
            );
          })}
      </div>

      {/* --- LAYER 6: Mission Briefing Hologram --- */}
      <AnimatePresence>
          {selectedLevel && (
              <motion.div 
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute top-0 right-0 w-[420px] h-full bg-[#050a14]/95 backdrop-blur-xl border-l border-blue-500/50 z-40 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
              >
                  {/* Decorative Scanline */}
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                  
                  {/* Header Bar */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 w-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  
                  <div className="p-8 flex-1 overflow-y-auto relative z-10">
                      <div className="flex items-center justify-between mb-8">
                           <div className="flex flex-col">
                                <span className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mb-1">Incoming Transmission</span>
                                <Badge variant="outline" className="border-blue-500 text-blue-300 uppercase tracking-widest text-xs py-1 px-3 bg-blue-900/20">
                                    Classified Intel
                                </Badge>
                           </div>
                           <Button variant="ghost" size="sm" onClick={() => setSelectedLevelId(null)} className="h-10 w-10 p-0 rounded-full hover:bg-blue-900/40 text-blue-400 hover:text-white border border-transparent hover:border-blue-500/50 transition-all">
                               <ChevronRight className="w-6 h-6" />
                           </Button>
                      </div>

                      <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase leading-none">{selectedLevel.title}</h2>
                        <div className="text-blue-400 font-mono text-xs border-l-2 border-blue-500 pl-3 mb-8">{selectedLevel.category} // ID: {selectedLevel.id}</div>
                      </motion.div>

                      <div className="space-y-6">
                          <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-blue-900/10 p-5 rounded-sm border-l-2 border-blue-500 relative"
                          >
                              <div className="absolute top-0 right-0 p-1 opacity-20">
                                  <Atom className="w-12 h-12" />
                              </div>
                              <h3 className="text-[10px] font-bold text-blue-300 uppercase mb-2 tracking-wider">Mission Objective</h3>
                              <p className="text-gray-300 leading-relaxed text-sm font-light">
                                  {selectedLevel.description}
                              </p>
                          </motion.div>

                          <div className="grid grid-cols-2 gap-3">
                              <motion.div 
                                  whileHover={{ scale: 1.02 }}
                                  className="bg-black/40 p-3 rounded border border-blue-900/30 text-center hover:border-blue-500/50 transition-colors"
                              >
                                  <div className="text-[10px] text-gray-500 uppercase mb-1">Threat Level</div>
                                  <div className={cn(
                                      "font-bold capitalize text-lg", 
                                      selectedLevel.difficulty === 'beginner' ? "text-green-400" :
                                      selectedLevel.difficulty === 'intermediate' ? "text-blue-400" :
                                      selectedLevel.difficulty === 'advanced' ? "text-purple-400" : "text-red-400"
                                  )}>
                                      {selectedLevel.difficulty}
                                  </div>
                              </motion.div>
                              <motion.div 
                                  whileHover={{ scale: 1.02 }}
                                  className="bg-black/40 p-3 rounded border border-blue-900/30 text-center hover:border-yellow-500/30 transition-colors"
                              >
                                  <div className="text-[10px] text-gray-500 uppercase mb-1">Bounty</div>
                                  <div className="font-bold text-yellow-500 flex items-center justify-center gap-2 text-lg">
                                      <Star className="w-4 h-4" />
                                      {selectedLevel.points}
                                  </div>
                              </motion.div>
                          </div>

                          <div className="bg-gradient-to-b from-blue-900/10 to-transparent p-1 rounded border border-blue-500/10">
                              <h3 className="bg-blue-900/20 text-[10px] font-bold text-blue-200 uppercase p-2 flex items-center gap-2 mb-2">
                                  <Brain className="w-3 h-3" /> Outcomes
                              </h3>
                              <ul className="space-y-1 p-2">
                                  {[1, 2, 3].map((_, idx) => (
                                      <motion.li 
                                          key={idx}
                                          initial={{ x: -10, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ delay: 0.4 + (idx * 0.1) }}
                                          className="flex items-center gap-3 text-sm text-gray-400 border-b border-gray-800 pb-2 last:border-0"
                                      >
                                          <div className="w-1.5 h-1.5 rounded-sm bg-blue-500" />
                                          <span>Crypto-analysis protocol mastery</span>
                                      </motion.li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 bg-[#02040a] border-t border-blue-900/30 relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
                      <Button 
                          className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all transform hover:scale-[1.02] tracking-widest clip-path-polygon"
                          onClick={handleStartMission}
                      >
                           {selectedLevel.completed ? "RE_DEPLOY" : "ENGAGE SYSTEMS"}
                           <Rocket className="w-5 h-5 ml-3 fill-current" />
                      </Button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* --- LAYER 7: CRT/Overlay Effects --- */}
      <div className="absolute inset-0 pointer-events-none ring-1 ring-white/5 rounded-xl z-50">
           {/* Vignette */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
           {/* Scanlines */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))]" style={{ backgroundSize: "100% 3px, 3px 100%" }} />
           {/* HUD Corners */}
           <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-blue-500/50" />
           <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-blue-500/50" />
           <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500/50" />
           <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/50" />
      </div>

    </div>
  );
}




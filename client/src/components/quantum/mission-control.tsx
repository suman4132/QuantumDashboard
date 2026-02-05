
import { motion } from "framer-motion";
import { User, Zap, Trophy, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MissionControlProps {
  user: {
    level: number;
    totalPoints: number;
    rank: number;
    streak: number;
    name?: string;
  };
  xpTarget?: number; // Total points needed for next level
  prevLevelTarget?: number; // Total points needed for current level (base)
}

export function MissionControl({ user, xpTarget = 1000, prevLevelTarget = 0 }: MissionControlProps) {
  // Calculate relative progress for the current level
  const levelRange = xpTarget - prevLevelTarget;
  const currentProgress = user.totalPoints - prevLevelTarget;
  // Ensure progress is between 0 and 100
  const xpProgress = Math.min(Math.max((currentProgress / levelRange) * 100, 0), 100);
  const xpNeeded = xpTarget - user.totalPoints;

  return (
    <div className="bg-[#0f172a] border-b border-blue-900/30 p-4 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Profile Section */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
             <Avatar className="h-14 w-14 border-2 border-white relative z-10">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="bg-slate-900 text-blue-200 font-bold">You</AvatarFallback>
             </Avatar>
             <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900 z-20">
                {user.level}
             </div>
          </div>
          
          <div className="flex-1">
             <h2 className="text-white font-bold text-lg flex items-center gap-2">
                Quantum Explorer
                <span className="text-xs font-normal text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-800">Rank #{user.rank}</span>
             </h2>
             <div className="w-48 md:w-64">
                <div className="flex justify-between text-[10px] text-blue-300 mb-1 uppercase tracking-wider">
                    <span>Level {user.level}</span>
                    <span>{currentProgress} / {levelRange} XP</span>
                </div>
                <Progress value={xpProgress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
             </div>
          </div>
        </div>

        {/* Stats HUD */}
        <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto justify-between md:justify-end">
            
            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800"
            >
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-white leading-none">{user.totalPoints}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Total XP</div>
                </div>
            </motion.div>

            <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800"
            >
                <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-white leading-none">{user.streak} <span className="text-sm font-normal text-slate-500">days</span></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Streak</div>
                </div>
            </motion.div>

             <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800"
            >
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                     {/* Placeholder for achievement count, hardcoded for visual context */}
                    <div className="text-2xl font-bold text-white leading-none">3 <span className="text-sm font-normal text-slate-500">/ 20</span></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Trophies</div>
                </div>
            </motion.div>
        </div>

      </div>
    </div>
  );
}

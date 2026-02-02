import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Award, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminGameScores() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deletingScoreId, setDeletingScoreId] = useState<string | null>(null);

  const { data: leaderboard, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/leaderboard"],
  });

  const deleteScoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/game-scores/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/game-scores"] });
      setDeletingScoreId(null);
      toast({ title: "Score deleted", description: "The score has been removed from the leaderboard." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete score.", variant: "destructive" });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const scoreDistribution = [
    { range: "0-2000", count: 145, fill: "#ef4444" },
    { range: "2000-4000", count: 387, fill: "#f59e0b" },
    { range: "4000-6000", count: 524, fill: "#3b82f6" },
    { range: "6000-8000", count: 298, fill: "#8b5cf6" },
    { range: "8000+", count: 89, fill: "#10b981" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Game Scores & Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">Monitor player performance and manage scores.</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Top Score", value: "9,850", desc: "By player_quantum_master", icon: Trophy, color: "text-amber-500", bgColor: "bg-amber-500/10", gradient: "from-amber-500 to-amber-600" },
          { title: "Avg Score", value: "4,250", desc: "+12% from last week", icon: TrendingUp, color: "text-emerald-500", bgColor: "bg-emerald-500/10", gradient: "from-emerald-500 to-emerald-600" },
          { title: "Active Players", value: "1,234", desc: "Playing this week", icon: Award, color: "text-blue-500", bgColor: "bg-blue-500/10", gradient: "from-blue-500 to-blue-600" }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={item} whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={item}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers across all games</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[60px]">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Game Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!leaderboard || leaderboard.length === 0) ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No game scores yet</TableCell></TableRow>
                  ) : (
                    leaderboard.map((entry: any, index: number) => (
                      <motion.tr key={entry.id || index} className="border-b hover:bg-accent/50 transition-colors group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {index === 0 && <Trophy className="h-5 w-5 text-amber-500 animate-pulse" />}
                            {index === 1 && <Trophy className="h-5 w-5 text-slate-400" />}
                            {index === 2 && <Trophy className="h-5 w-5 text-amber-700" />}
                            <span className={`font-bold ${index < 3 ? 'text-lg' : ''}`}>#{index + 1}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-semibold">
                              {entry.userName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{entry.userName || entry.userId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{entry.gameType?.replace('_', ' ') || 'quantum_quest'}</Badge></TableCell>
                        <TableCell><span className="font-bold text-primary">{entry.score?.toLocaleString()}</span></TableCell>
                        <TableCell><Badge variant="secondary">{entry.level}</Badge></TableCell>
                        <TableCell className="text-muted-foreground text-sm">{entry.achievedAt ? new Date(entry.achievedAt).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                            onClick={() => setDeletingScoreId(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Player performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingScoreId} onOpenChange={(open) => !open && setDeletingScoreId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this score?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this score from the leaderboard. This action is useful for removing cheating or invalid attempts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingScoreId && deleteScoreMutation.mutate(deletingScoreId)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteScoreMutation.isPending ? "Deleting..." : "Delete Score"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

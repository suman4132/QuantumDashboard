import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserPlus, Save, Play, MessageSquare, 
  Code2, CheckCircle2, Trophy, Clock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ResearchChat } from "@/components/teamwork/ResearchChat"; // Re-using existing chat
import { apiRequest } from "@/lib/queryClient";

interface Collaborator {
  id: string;
  userId: string;
  userName: string;
  role: 'owner' | 'editor' | 'viewer';
  status?: 'online' | 'offline' | 'busy'; // Simulated status
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  circuitCode: string;
  updatedAt: string;
}

interface ProjectCollaborationViewProps {
  projectId: string;
  workspaceId: string;
  currentUser: { id: string; name: string };
  onClose: () => void;
}

export function ProjectCollaborationView({ projectId, workspaceId, currentUser, onClose }: ProjectCollaborationViewProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [activeTab, setActiveTab] = useState("editor");

  // Fetch Project Details
  const { data: project, isLoading: isProjectLoading } = useQuery<ProjectData>({
    queryKey: [`project`, projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error("Failed to load project");
      return res.json();
    }
  });

  // Fetch Collaborators
  const { data: collaborators, isLoading: isCollabLoading } = useQuery<Collaborator[]>({
    queryKey: [`project-collaborators`, projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) throw new Error("Failed to load collaborators");
      const data = await res.json();
      // Add simulated status for "real" feel
      return data.map((c: any) => ({
        ...c,
        status: Math.random() > 0.3 ? 'online' : 'offline'
      }));
    },
    refetchInterval: 10000 // Poll for presence
  });

  // Update Code Effect
  useEffect(() => {
    if (project?.circuitCode) {
      setCode(project.circuitCode);
    } else if (project && !project.circuitCode) {
        setCode(`// Quantum Circuit: ${project.name}
// Solved by: ${currentUser.name} & Team

from qiskit import QuantumCircuit

# Initialize Circuit
qc = QuantumCircuit(4)

# Add Gates
qc.h(0)
qc.cx(0, 1)

# Measure
qc.measure_all()`);
    }
  }, [project]);

  // Mutations
  const updateProjectMutation = useMutation({
    mutationFn: async (newCode: string) => {
      await apiRequest("PATCH", `/api/projects/${projectId}`, {
        circuitCode: newCode,
        lastModified: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Project state saved to database." });
      queryClient.invalidateQueries({ queryKey: [`project`, projectId] });
    }
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (email: string) => {
        // Simulate finding user
        const mockUserId = `user_${Math.random().toString(36).substr(2, 6)}`;
        await apiRequest("POST", `/api/projects/${projectId}/collaborators`, {
            userId: mockUserId,
            userName: email.split('@')[0], 
            role: "editor"
        });
    },
    onSuccess: () => {
        toast({ title: "Invited", description: `Invitation sent to ${inviteEmail}` });
        setInviteEmail("");
        setIsInviteOpen(false);
        queryClient.invalidateQueries({ queryKey: [`project-collaborators`, projectId] });
    }
  });

  const handleSave = () => {
    updateProjectMutation.mutate(code);
  };

  const handleInvite = () => {
      if(inviteEmail) inviteMemberMutation.mutate(inviteEmail);
  };

  if (isProjectLoading || isCollabLoading) {
    return <div className="p-8 text-center">Loading collaborative environment...</div>;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Top Bar */}
      <div className="border-b px-6 py-3 flex justify-between items-center bg-card/50">
        <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={onClose}>← Back</Button>
             <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    {project?.name}
                    <Badge variant="outline" className="text-xs font-normal border-green-500 text-green-500 gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Session
                    </Badge>
                </h2>
                <p className="text-xs text-muted-foreground hidden sm:block">Workspace: {workspaceId} • Last saved: {new Date(project?.updatedAt || Date.now()).toLocaleTimeString()}</p>
             </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2 mr-4">
                {collaborators?.slice(0, 4).map((c, i) => (
                    <Avatar key={c.id} className={`border-2 border-background w-8 h-8 ${c.status === 'online' ? 'ring-2 ring-green-500' : ''}`}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.userName}`} />
                        <AvatarFallback>{c.userName[0]}</AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" className="gap-2">
                        <UserPlus className="w-4 h-4" /> Invite
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite to {project?.name}</DialogTitle>
                        <DialogDescription>Collaborate with others on this quantum problem.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@example.com" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleInvite}>Send Invite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button size="sm" onClick={handleSave} disabled={updateProjectMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> {updateProjectMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" /> Run on IBM Quantum
            </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor & Problem */}
        <div className="flex-1 flex flex-col border-r">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b px-4 bg-muted/20">
                    <TabsList className="bg-transparent h-12">
                        <TabsTrigger value="editor" className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                            <Code2 className="w-4 h-4 mr-2" /> Code Editor
                        </TabsTrigger>
                        <TabsTrigger value="results" className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                            <Zap className="w-4 h-4 mr-2" /> Simulation Results
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none">
                            <Trophy className="w-4 h-4 mr-2" /> Challenge Info
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="editor" className="flex-1 p-0 m-0 relative">
                    <Textarea 
                        className="w-full h-full resize-none rounded-none border-0 p-6 font-mono text-sm bg-slate-950 text-slate-50 focus-visible:ring-0 leading-6"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded">
                        Python (Qiskit) • {code.split('\n').length} lines
                    </div>
                </TabsContent>

                <TabsContent value="results" className="flex-1 p-6">
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <Play className="w-12 h-12 mb-4 opacity-20" />
                        <p>Run the circuit to see execution results and state vector visualization.</p>
                        <Button variant="outline" className="mt-4" onClick={() => setActiveTab('editor')}>Go back to Editor</Button>
                    </div>
                </TabsContent>
                
                 <TabsContent value="docs" className="flex-1 p-6 overflow-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Challenge: {project?.name}</CardTitle>
                            <CardDescription>Mastering Quantum States</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Objective</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-400">{project?.description}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-2">Rewards</h4>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="py-1 px-3 border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10"><Trophy className="w-3 h-3 mr-1"/> 500 XP</Badge>
                                    <Badge variant="outline" className="py-1 px-3"><CheckCircle2 className="w-3 h-3 mr-1"/> Algo Master Badge</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>

        {/* Right: Collaboration Panel */}
        <div className="w-80 border-l bg-muted/10 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Team Chat
                </h3>
                <Badge variant="secondary" className="text-xs">
                    {collaborators?.filter(c => c.status === 'online').length} Online
                </Badge>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                 {/* Reusing the ResearchChat component but constrained to this container */}
                 <ResearchChat 
                    projectId={projectId} 
                    workspaceId={workspaceId} 
                    currentUser={currentUser} 
                    className="h-full border-0 shadow-none bg-transparent"
                 />
            </div>

            {/* Active Users List (Mini) */}
            <div className="p-4 border-t bg-background/50">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Online Now</h4>
                <div className="space-y-3">
                    {collaborators?.filter(c => c.status === 'online').map(user => (
                        <div key={user.id} className="flex items-center gap-2">
                             <div className="relative">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userName}`} />
                                    <AvatarFallback>{user.userName[0]}</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-background"></span>
                             </div>
                             <span className="text-sm truncate">{user.userName}</span>
                             {user.role === 'owner' && <Badge variant="outline" className="text-[10px] h-4 px-1 ml-auto">Owner</Badge>}
                        </div>
                    ))}
                    {(!collaborators || collaborators.filter(c => c.status === 'online').length === 0) && (
                        <p className="text-xs text-muted-foreground italic">No other users online.</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

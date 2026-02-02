import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Puzzle, Users, Trophy, Clock, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ActiveChallengesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: "Expert" | "Advanced" | "Intermediate";
  participants: number;
  timeLeft: string;
  reward: number;
  progress: number;
  status: "available" | "in_progress" | "completed";
}

export function ActiveChallengesModal({ open, onOpenChange }: ActiveChallengesModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "vqe_opt",
      name: "VQE Optimization Challenge",
      description: "Optimize a VQE algorithm to achieve >95% accuracy with minimum circuit depth",
      difficulty: "Expert",
      participants: 156,
      timeLeft: "5 days",
      reward: 5000,
      progress: 65,
      status: "in_progress",
    },
    {
      id: "qec_code",
      name: "Quantum Error Correction",
      description: "Implement and test a surface code error correction scheme",
      difficulty: "Advanced",
      participants: 89,
      timeLeft: "12 days",
      reward: 3500,
      progress: 0,
      status: "available",
    },
    {
      id: "team_circuit",
      name: "Team Circuit Design",
      description: "Collaborate with 2+ members to design an efficient QAOA circuit",
      difficulty: "Intermediate",
      participants: 234,
      timeLeft: "8 days",
      reward: 2000,
      progress: 30,
      status: "in_progress",
    },
  ]);

  const handleJoin = (id: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, status: "in_progress", participants: c.participants + 1 } : c
    ));
    toast({
      title: "Challenge Joined",
      description: "You have successfully joined the challenge. Good luck!",
    });
  };

  const handleContinue = (id: string) => {
    onOpenChange(false);
    toast({
      title: "Resuming Challenge",
      description: "Redirecting to challenge workspace...",
    });
    // Simulate loading/redirection to the main dashboard as a workspace placeholder
    setTimeout(() => {
        navigate("/dashboard");
    }, 1000);
  };

  const handleViewDetails = (challenge: Challenge) => {
    toast({
        title: "Challenge Details",
        description: `Viewing details for ${challenge.name}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-red-500" />
            Active Quantum Challenges
          </DialogTitle>
          <DialogDescription>
            Compete in quantum computing challenges and advance your skills
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[700px] overflow-y-auto">
          {/* Challenge Categories */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Puzzle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold">Algorithm</div>
                <div className="text-sm text-gray-600">5 active</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold">Team</div>
                <div className="text-sm text-gray-600">2 active</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-semibold">Competition</div>
                <div className="text-sm text-gray-600">1 active</div>
              </CardContent>
            </Card>
          </div>

          {/* Active Challenges List */}
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {challenge.name}
                        </h3>
                        <Badge
                          variant={
                            challenge.difficulty === "Expert"
                              ? "destructive"
                              : challenge.difficulty === "Advanced"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                        {challenge.status === "in_progress" && (
                          <Badge
                            variant="outline"
                            className="text-blue-600 border-blue-600"
                          >
                            In Progress
                          </Badge>
                        )}
                         {challenge.status === "completed" && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {challenge.description}
                      </p>

                      {challenge.status === "in_progress" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Your Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress
                            value={challenge.progress}
                            className="h-2"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{challenge.timeLeft} left</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold">
                            {challenge.reward.toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                         {challenge.status === "available" ? (
                             <Button
                                onClick={() => handleJoin(challenge.id)}
                                data-testid={`button-join-challenge-${challenge.id}`}
                              >
                                Join Challenge
                              </Button>
                         ) : (
                              <Button
                                onClick={() => handleContinue(challenge.id)}
                                data-testid={`button-continue-challenge-${challenge.id}`}
                              >
                                Continue
                              </Button>
                         )}
                     
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewDetails(challenge)}
                        data-testid={`button-view-details-${challenge.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

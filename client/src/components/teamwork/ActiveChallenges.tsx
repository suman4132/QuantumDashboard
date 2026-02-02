import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Target, Plus, Info, Play, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  timeLeft: string;
  participants: number;
  maxParticipants: number;
  rewards: string[];
  progress: number;
  isJoined: boolean;
}

const initialChallenges: Challenge[] = [
  {
    id: "quantum_hackathon",
    name: "Quantum Hackathon 2025",
    description: "Build innovative quantum applications in teams",
    detailedDescription: "Join the biggest quantum hackathon of the year! Collaborate with researchers and developers to build groundbreaking quantum applications using the latest frameworks. Prizes include cloud credits and mentorship opportunities.",
    difficulty: "intermediate",
    timeLeft: "5 days",
    participants: 127,
    maxParticipants: 200,
    rewards: ["1000 pts", "Certificate", "Recognition"],
    progress: 0,
    isJoined: false,
  },
  {
    id: "vqe_challenge",
    name: "VQE Mastery Challenge",
    description: "Implement and optimize VQE for molecular systems",
    detailedDescription: "Dive deep into Variational Quantum Eigensolvers. Your task is to optimize the ansatz for a Lithium Hydride molecule simulation to achieve chemical accuracy with minimum circuit depth.",
    difficulty: "advanced",
    timeLeft: "12 days",
    participants: 67,
    maxParticipants: 100,
    rewards: ["500 pts", "VQE Expert Badge"],
    progress: 23,
    isJoined: true,
  },
  {
    id: "qerror_mitigation",
    name: "Error Mitigation Quest",
    description: "Apply Zero Noise Extrapolation to improve results",
    detailedDescription: "Real hardware is noisy. Master error mitigation techniques like ZNE and PEC to extract clean signals from noisy quantum processors.",
    difficulty: "expert",
    timeLeft: "3 days",
    participants: 42,
    maxParticipants: 50,
    rewards: ["800 pts", "Hardware Access"],
    progress: 0,
    isJoined: false,
  },
];

interface ChallengeItemProps {
  challenge: Challenge;
  onJoin: (id: string) => void;
  onContinue: (id: string) => void;
}

function ChallengeItem({ challenge, onJoin, onContinue }: ChallengeItemProps) {
  return (
    <div className="p-4 border rounded-lg space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-medium flex items-center gap-2">
            {challenge.name}
            <Badge
              variant={
                challenge.difficulty === "expert"
                  ? "destructive"
                  : challenge.difficulty === "advanced"
                    ? "default"
                    : "secondary"
              }
              className="text-xs capitalize"
            >
              {challenge.difficulty}
            </Badge>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {challenge.description}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-orange-600">
            {challenge.timeLeft} left
          </div>
          <div className="text-xs text-gray-500">
            {challenge.participants}/{challenge.maxParticipants} joined
          </div>
        </div>
      </div>

      {challenge.isJoined && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Your Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <Progress value={challenge.progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1 flex-wrap">
          {challenge.rewards.map((reward, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {reward}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {/* View Details Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4 mr-1" /> Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {challenge.name}
                </DialogTitle>
                <DialogDescription>
                  {challenge.difficulty.charAt(0).toUpperCase() +
                    challenge.difficulty.slice(1)}{" "}
                  Challenge • Ends in {challenge.timeLeft}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {challenge.detailedDescription}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Rewards</h4>
                  <div className="flex gap-2 flex-wrap">
                    {challenge.rewards.map((r, i) => (
                      <Badge key={i} variant="secondary">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted p-3 rounded-md">
                  <div>
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-sm font-medium">
                      {challenge.participants} / {challenge.maxParticipants}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="text-sm font-medium capitalize">
                      {challenge.difficulty}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {!challenge.isJoined ? (
                  <DialogClose asChild>
                    <Button
                      onClick={() => onJoin(challenge.id)}
                      className="w-full sm:w-auto"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Challenge
                    </Button>
                  </DialogClose>
                ) : (
                  <DialogClose asChild>
                    <Button
                      onClick={() => onContinue(challenge.id)}
                      className="w-full sm:w-auto"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {!challenge.isJoined ? (
            <Button
              size="sm"
              onClick={() => onJoin(challenge.id)}
              disabled={challenge.participants >= challenge.maxParticipants}
            >
              <UserPlus className="h-4 w-4 mr-1" /> Join
            </Button>
          ) : (
            <Button size="sm" onClick={() => onContinue(challenge.id)}>
              <Play className="h-4 w-4 mr-1" /> Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ActiveChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const { toast } = useToast();

  const handleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, isJoined: true, participants: c.participants + 1 }
          : c
      )
    );
    toast({
      title: "Challenge Joined!",
      description: "You have successfully joined the challenge. Good luck!",
    });
  };

  const handleContinue = (id: string) => {
    toast({
      title: "Resuming Challenge",
      description: "Redirecting to your challenge workspace...",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          Active Challenges
        </CardTitle>
        <CardDescription>
          Test your skills with quantum computing challenges
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <ChallengeItem
            key={challenge.id}
            challenge={challenge}
            onJoin={handleJoin}
            onContinue={handleContinue}
          />
        ))}

        <Button
          className="w-full"
          variant="outline"
          data-testid="button-browse-challenges"
        >
          <Plus className="h-4 w-4 mr-2" />
          Browse All Challenges
        </Button>
      </CardContent>
    </Card>
  );
}

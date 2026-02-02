import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquare,
  Settings,
  Search,
  Hash,
  Bookmark,
  Heart,
  BookmarkCheck,
  FileText,
  Download,
  X,
  Paperclip,
  Send,
  Mic,
  Users,
  MoreHorizontal,
  Video,
  Share2,
  Brain,
  Sparkles,
  Network,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResearchChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mockMessages: any[];
  liveMessages: any[];
  onSendMessage: (msg: string) => void;
}

export function ResearchChat({
  open,
  onOpenChange,
  mockMessages,
  liveMessages,
  onSendMessage,
}: ResearchChatProps) {
  const [currentChatMessage, setCurrentChatMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Research Chat - Quantum Collaboration Hub
                </div>
                <div className="flex items-center gap-2 mr-8">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    5 active
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid="button-chat-settings"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Advanced research collaboration with AI-powered insights, file
                sharing, and real-time quantum analysis
              </DialogDescription>
            </DialogHeader>

            <div className="flex h-[calc(100vh-200px)] gap-4">
              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 rounded-lg border">
                {/* Chat Header with Search */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search chat history, equations, or quantum circuits..."
                        className="pl-10 bg-white dark:bg-gray-900"
                        data-testid="input-search-chat"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-thread-view"
                    >
                      <Hash className="h-4 w-4 mr-1" />
                      Threads
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-testid="button-bookmark-message"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {mockMessages.map((msg, idx) => (
                    <div key={msg.id} className="group relative">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {msg.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {msg.user}
                            </span>
                            <Badge
                              variant={
                                msg.type === "algorithm"
                                  ? "default"
                                  : msg.type === "hardware"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs px-2 py-0.5"
                            >
                              {msg.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(msg.timestamp)} ago
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-auto">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-reply-${msg.id}`}
                              >
                                <MessageSquare className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-react-${msg.id}`}
                              >
                                <Heart className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                data-testid={`button-bookmark-${msg.id}`}
                              >
                                <BookmarkCheck className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {msg.message}
                            </p>
                            {msg.attachments && (
                              <div className="mt-3 space-y-2">
                                {msg.attachments.map((att, attIdx) => (
                                  <div
                                    key={attIdx}
                                    className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800"
                                  >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded">
                                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-blue-900 dark:text-blue-100">
                                        {att.name}
                                      </div>
                                      <div className="text-xs text-blue-600 dark:text-blue-400">
                                        Quantum Circuit • 2.3 KB
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      data-testid={`button-download-${attIdx}`}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Reaction Bar */}
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <span className="text-lg">👍</span>
                                <span className="text-xs text-gray-500">3</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-lg">🧠</span>
                                <span className="text-xs text-gray-500">2</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-lg">⚛️</span>
                                <span className="text-xs text-gray-500">1</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Live Chat Messages */}
                  {liveMessages.map((msg, idx) => (
                    <div key={`live-${idx}`} className="group relative">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-900">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                            {msg.userName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {msg.userName}
                            </span>
                            <Badge variant="secondary" className="text-xs px-2 py-0.5">
                              Team
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Just now
                            </span>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Typing Indicator */}
                  <div className="flex gap-4 opacity-70">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-400 text-white text-sm">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        John is typing...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Message Input */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Reply to: Alice Chen - "Just optimized the VQE
                        circuit..."
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5"
                        data-testid="button-clear-reply"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Share quantum insights, ask questions, or discuss algorithms..."
                          value={currentChatMessage}
                          onChange={(e) =>
                            setCurrentChatMessage(e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (currentChatMessage.trim()) {
                                onSendMessage(currentChatMessage);
                                setCurrentChatMessage("");
                              }
                            }
                          }}
                          className="min-h-[80px] resize-none pr-20"
                          data-testid="textarea-chat-message"
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            data-testid="button-emoji"
                          >
                            <span className="text-lg">😊</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            data-testid="button-attach-file"
                          >
                            <Paperclip className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="icon"
                          onClick={() => {
                            if (currentChatMessage.trim()) {
                              onSendMessage(currentChatMessage);
                              setCurrentChatMessage("");
                            }
                          }}
                          className="h-10 w-10"
                          data-testid="button-send-chat"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          data-testid="button-voice-message"
                        >
                          <Mic className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      <span>•</span>
                      <span>Format with *bold* _italic_ `code`</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="w-80 space-y-4 hidden xl:block">
                {/* Active Members */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Team Members (5)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Alice Chen",
                      "Bob Wilson",
                      "Dr. Sarah Kim",
                      "John Doe",
                      "Emma Davis",
                    ].map((user, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                                {user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{user}</div>
                            <div className="text-xs text-gray-500">
                              {idx === 0
                                ? "Working on VQE"
                                : idx === 1
                                  ? "Hardware testing"
                                  : "Available"}
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Direct Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Video className="h-4 w-4 mr-2" />
                                Start Call
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Screen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Research Assistant */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Research Assistant
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Beta
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-purple-900 dark:text-purple-100">
                            Optimization Suggestion
                          </div>
                          <div className="text-purple-700 dark:text-purple-300 mt-1">
                            Your VQE circuit can achieve 15% better fidelity by
                            adjusting the ansatz depth to 10 layers.
                          </div>
                          <Button
                            size="sm"
                            className="mt-2"
                            data-testid="button-apply-ai-suggestion"
                          >
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2">
                        <Network className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 dark:text-blue-100">
                            Hardware Alert
                          </div>
                          <div className="text-blue-700 dark:text-blue-300 mt-1">
                            IBM Cairo will be available for 2 hours starting at
                            3:00 PM today.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            data-testid="button-reserve-hardware"
                          >
                            Reserve Time
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      data-testid="button-ask-ai"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask AI Assistant
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Files */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Shared Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      {
                        name: "VQE_optimization_v2.qasm",
                        size: "2.3 KB",
                        user: "Alice",
                        time: "2m ago",
                      },
                      {
                        name: "QAOA_results.pdf",
                        size: "1.8 MB",
                        user: "Bob",
                        time: "15m ago",
                      },
                      {
                        name: "quantum_error_analysis.py",
                        size: "5.2 KB",
                        user: "Sarah",
                        time: "1h ago",
                      },
                    ].map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                      >
                        <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded">
                          <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {file.user} • {file.time}
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>    </Dialog>
  );
}

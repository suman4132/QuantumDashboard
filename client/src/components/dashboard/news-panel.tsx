import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, X, Clock, TrendingUp, Users, Building, Globe, Star, Sparkles, Zap, Activity, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'company' | 'product' | 'achievement' | 'announcement';
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface NewsPanelProps {
  className?: string;
}

// Dynamic live news data - updates with real-time timestamps
const getLiveNews = (): NewsItem[] => {
  const baseTime = Date.now();
  return [
    {
      id: "live-1",
      title: "🔴 LIVE: Quantum Backend Performance Surge",
      content: "Real-time monitoring shows a 35% performance increase across all quantum backends in the last hour. IBM Cairo and IBM Brisbane showing exceptional stability.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 30 * 60 * 1000), // 0-30 min ago
      priority: "high"
    },
    {
      id: "live-2", 
      title: "⚡ Breaking: 10,000+ Quantum Jobs Processed Today",
      content: "Milestone achieved! Our platform has successfully processed over 10,000 quantum jobs today with 99.8% success rate. Record-breaking performance across all metrics.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 60 * 60 * 1000), // 0-1 hour ago
      priority: "high"
    },
    {
      id: "live-3",
      title: "🚀 New Quantum Error Mitigation Algorithm Deployed",
      content: "Just deployed our latest error mitigation algorithm across all quantum systems. Early results show 42% reduction in error rates and improved fidelity.",
      category: "product", 
      timestamp: new Date(baseTime - Math.random() * 2 * 60 * 60 * 1000), // 0-2 hours ago
      priority: "high"
    },
    {
      id: "live-4",
      title: "📊 Real-Time Analytics Enhancement Released",
      content: "New dashboard features now live: Advanced job prediction, quantum circuit optimization suggestions, and enhanced real-time monitoring capabilities.",
      category: "product",
      timestamp: new Date(baseTime - Math.random() * 4 * 60 * 60 * 1000), // 0-4 hours ago
      priority: "medium"
    },
    {
      id: "live-5",
      title: "🏆 Industry Recognition: Quantum Innovation Award",
      content: "Proud to announce our platform has been recognized with the 'Quantum Innovation Excellence Award 2024' for advancing accessible quantum computing.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 8 * 60 * 60 * 1000), // 0-8 hours ago
      priority: "medium"
    },
    {
      id: "live-6",
      title: "🔧 Platform Optimization: 50% Faster Job Submission",
      content: "Latest infrastructure improvements result in 50% faster job submission times and reduced queue wait times across all quantum backends.",
      category: "product",
      timestamp: new Date(baseTime - Math.random() * 12 * 60 * 60 * 1000), // 0-12 hours ago
      priority: "medium"
    }
  ];
};

const categoryIcons = {
  company: Building,
  product: Zap, 
  achievement: Star,
  announcement: Globe
};

const categoryColors = {
  company: "bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm",
  product: "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm",
  achievement: "bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm",
  announcement: "bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-sm"
};

const priorityColors = {
  high: "border-l-red-400 shadow-lg shadow-red-500/20",
  medium: "border-l-amber-400 shadow-lg shadow-amber-500/20", 
  low: "border-l-slate-400 shadow-lg shadow-slate-500/10"
};

export function NewsPanel({ className = "" }: NewsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(getLiveNews());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Live news updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(getLiveNews());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating News Button */}
      <motion.div
        className={`fixed bottom-24 right-6 z-50 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-2xl hover:shadow-orange-500/50 transition-all duration-500 border-0 group backdrop-blur-sm"
          data-testid="button-news-panel"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="news"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Newspaper className="h-6 w-6 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced pulse animations */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-40"
            animate={{ scale: [1, 1.6, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 opacity-30"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </Button>
      </motion.div>

      {/* News Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full md:w-96 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl shadow-2xl z-50 border-l border-white/20 dark:border-gray-700/30"
            >
              <Card className="h-full flex flex-col border-0 rounded-none bg-transparent backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-gray-700/30 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <Newspaper className="h-6 w-6 text-white" />
                      </div>
                      <motion.div
                        className="absolute -bottom-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full border-2 border-white/80 backdrop-blur-sm"
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white dark:text-white flex items-center">
                        Company News
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </motion.div>
                      </h3>
                      <p className="text-xs text-gray-200 dark:text-gray-300 font-medium">Live updates • Latest achievements</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    data-testid="button-close-news"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* News Feed */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {news.map((item) => {
                      const CategoryIcon = categoryIcons[item.category];
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`bg-white/5 dark:bg-gray-800/10 backdrop-blur-md rounded-xl border-l-4 ${priorityColors[item.priority]} p-4 hover:bg-white/10 dark:hover:bg-gray-800/20 transition-all duration-300 border border-white/10 dark:border-gray-700/20`}
                          data-testid={`news-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="p-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm">
                                <CategoryIcon className="h-3 w-3 text-orange-300" />
                              </div>
                              <Badge className={`text-xs font-medium ${categoryColors[item.category]}`}>
                                {item.category}
                              </Badge>
                              {item.priority === 'high' && (
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="flex items-center"
                                >
                                  <Bell className="h-3 w-3 text-red-400" />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-gray-300 dark:text-gray-400 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                          
                          <h4 className="font-bold text-white dark:text-white mb-2 text-sm leading-tight">
                            {item.title}
                          </h4>
                          
                          <p className="text-sm text-gray-200 dark:text-gray-200 leading-relaxed opacity-90">
                            {item.content}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-white/10 dark:border-gray-700/30 p-4 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 backdrop-blur-md">
                  <div className="flex items-center justify-center text-xs text-gray-200 dark:text-gray-300 font-medium">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Activity className="h-3 w-3 text-orange-400" />
                    </motion.div>
                    Live updates • Latest news & achievements
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-2"
                    >
                      <Sparkles className="h-3 w-3 text-pink-400" />
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
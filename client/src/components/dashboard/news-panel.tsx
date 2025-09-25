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

// Professional company news data - updates with real-time timestamps
const getCompanyNews = (): NewsItem[] => {
  const baseTime = Date.now();
  return [
    {
      id: "news-1",
      title: "Quantum Backend Performance Optimization Complete",
      content: "Our engineering team has successfully completed performance optimization across all quantum backends, resulting in a 35% improvement in processing efficiency. IBM Cairo and IBM Brisbane systems showing enhanced stability and reduced queue times.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 30 * 60 * 1000), // 0-30 min ago
      priority: "high"
    },
    {
      id: "news-2", 
      title: "Daily Processing Milestone: 10,000+ Quantum Jobs Executed",
      content: "Today marks a significant milestone with over 10,000 quantum jobs successfully processed on our platform, achieving a 99.8% success rate. This represents record-breaking performance across all operational metrics.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 60 * 60 * 1000), // 0-1 hour ago
      priority: "high"
    },
    {
      id: "news-3",
      title: "Advanced Error Mitigation Algorithm Now Deployed",
      content: "Our latest quantum error mitigation algorithm has been successfully deployed across all quantum systems. Initial performance data indicates a 42% reduction in computational errors and significantly improved fidelity rates.",
      category: "product", 
      timestamp: new Date(baseTime - Math.random() * 2 * 60 * 60 * 1000), // 0-2 hours ago
      priority: "high"
    },
    {
      id: "news-4",
      title: "Enhanced Analytics Dashboard Features Released",
      content: "New dashboard capabilities are now available, including advanced job prediction algorithms, quantum circuit optimization recommendations, and comprehensive real-time monitoring tools for improved operational oversight.",
      category: "product",
      timestamp: new Date(baseTime - Math.random() * 4 * 60 * 60 * 1000), // 0-4 hours ago
      priority: "medium"
    },
    {
      id: "news-5",
      title: "Company Receives Quantum Innovation Excellence Award 2024",
      content: "We are proud to announce that our platform has been recognized with the prestigious Quantum Innovation Excellence Award 2024 for our contributions to advancing accessible quantum computing technology.",
      category: "achievement",
      timestamp: new Date(baseTime - Math.random() * 8 * 60 * 60 * 1000), // 0-8 hours ago
      priority: "medium"
    },
    {
      id: "news-6",
      title: "Infrastructure Improvements Reduce Job Submission Time by 50%",
      content: "Recent infrastructure enhancements have resulted in significantly faster job submission processing, with a 50% reduction in submission times and decreased queue wait periods across all quantum backend systems.",
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
  company: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  product: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  achievement: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
  announcement: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
};

const priorityColors = {
  high: "border-l-red-600",
  medium: "border-l-amber-600", 
  low: "border-l-slate-400"
};

export function NewsPanel({ className = "" }: NewsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(getCompanyNews());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Live news updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(getCompanyNews());
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
          className="h-12 w-12 rounded-lg bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white shadow-lg transition-all duration-200"
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
          
          {/* Simple unread indicator */}
          <motion.div
            className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
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
              className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800"
            >
              <Card className="h-full flex flex-col border-0 rounded-none bg-white dark:bg-gray-900">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-lg bg-slate-700 dark:bg-slate-600 flex items-center justify-center">
                        <Newspaper className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        Company News
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Latest updates and announcements</p>
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
                          className={`bg-white dark:bg-gray-900 rounded-lg border-l-4 ${priorityColors[item.priority]} p-4 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200`}
                          data-testid={`news-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <CategoryIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <Badge className={`text-xs ${categoryColors[item.category]}`}>
                                {item.category}
                              </Badge>
                              {item.priority === 'high' && (
                                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                  High Priority
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base leading-tight">
                            {item.title}
                          </h4>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.content}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <Activity className="h-3 w-3 mr-2" />
                    Updates refresh every 30 seconds
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
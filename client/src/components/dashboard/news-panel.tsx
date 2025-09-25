import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, X, Clock, TrendingUp, Users, Building, Globe, Star } from "lucide-react";
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

// Mock news data - in a real app this would come from an API
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "New Quantum Algorithm Breakthrough",
    content: "Our research team has successfully developed a groundbreaking quantum algorithm that improves error correction rates by 40%. This advancement brings us closer to fault-tolerant quantum computing.",
    category: "achievement",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    priority: "high"
  },
  {
    id: "2", 
    title: "Partnership with IBM Quantum Expanded",
    content: "We're excited to announce an expanded partnership with IBM Quantum, providing our users access to 10 additional quantum backends including the latest 1000+ qubit systems.",
    category: "company",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    priority: "high"
  },
  {
    id: "3",
    title: "Q3 Quantum Job Execution Milestone",
    content: "This quarter we successfully processed over 1 million quantum jobs with an average execution time improvement of 25% compared to last quarter.",
    category: "achievement", 
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    priority: "medium"
  },
  {
    id: "4",
    title: "New Dashboard Analytics Features",
    content: "Released advanced analytics dashboard with real-time job monitoring, predictive backend recommendations, and enhanced visualization tools.",
    category: "product",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    priority: "medium"
  },
  {
    id: "5",
    title: "Team Growth: 50+ New Quantum Engineers",
    content: "Our quantum engineering team has grown by 50+ talented individuals this quarter, strengthening our capabilities in quantum algorithm development and system optimization.",
    category: "company",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    priority: "low"
  },
  {
    id: "6",
    title: "Award: Best Quantum Cloud Platform 2024",
    content: "Honored to receive the 'Best Quantum Cloud Platform 2024' award from the International Quantum Computing Association for our innovative dashboard and user experience.",
    category: "achievement",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    priority: "medium"
  }
];

const categoryIcons = {
  company: Building,
  product: TrendingUp, 
  achievement: Star,
  announcement: Globe
};

const categoryColors = {
  company: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  product: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  achievement: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  announcement: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
};

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500", 
  low: "border-l-gray-400"
};

export function NewsPanel({ className = "" }: NewsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [news] = useState<NewsItem[]>(mockNews);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
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
          
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-400 opacity-75"
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
              className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-700"
            >
              <Card className="h-full flex flex-col border-0 rounded-none">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                        <Newspaper className="h-6 w-6 text-white" />
                      </div>
                      <motion.div
                        className="absolute -bottom-1 -right-1 h-4 w-4 bg-red-400 rounded-full border-2 border-white dark:border-gray-900"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Company News</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Latest updates & achievements</p>
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
                          className={`bg-white dark:bg-gray-800 rounded-lg border-l-4 ${priorityColors[item.priority]} p-4 shadow-sm hover:shadow-md transition-shadow`}
                          data-testid={`news-item-${item.id}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <CategoryIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              <Badge className={`text-xs ${categoryColors[item.category]}`}>
                                {item.category}
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                            </div>
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
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
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                    <Users className="h-3 w-3 mr-1" />
                    Stay updated with our latest company news and achievements
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
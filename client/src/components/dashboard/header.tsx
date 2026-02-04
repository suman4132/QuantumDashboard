import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Search,
  RefreshCw,
  Bell,
  CloudDownload,
  X,
  Users,
  Play,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@/hooks/use-theme";
import { useJobStats, useJobs } from "@/hooks/use-jobs";
import { motion } from "framer-motion";
import {
  Settings,
  Filter,
  Download,
  BarChart3,
  LogOut,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface HeaderProps {
  onSearch: (query: string) => void;
  onRefreshIntervalChange: (interval: number) => void;
  onManualRefresh: () => void;
  onViewChange?: (view: string) => void;
  onNotificationToggle?: () => void;
}

function LiveJobIndicator() {
  const { data: stats } = useJobStats();
  const runningJobs = stats?.runningJobs || 0;

  if (runningJobs === 0) return null;

  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-xs text-green-600 font-medium">
        {runningJobs} LIVE
      </span>
    </div>
  );
}

export function Header({
  onSearch,
  onRefreshIntervalChange,
  onManualRefresh,
  onViewChange,
  onNotificationToggle,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connected");
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Simulate connection status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate connection status changes for demo
      const statuses: Array<"connected" | "connecting" | "disconnected"> = [
        "connected",
        "connected",
        "connected",
        "connecting",
        "disconnected",
      ];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setSyncStatus("syncing");
    setConnectionStatus("connecting");
    try {
      const response = await fetch("/api/sync/ibm", { method: "POST" });
      if (response.ok) {
        setSyncStatus("success");
        setConnectionStatus("connected");
        setLastSync(new Date());
        setTimeout(() => setSyncStatus("idle"), 2000);
      } else {
        setSyncStatus("error");
        setConnectionStatus("disconnected");
        setTimeout(() => setSyncStatus("idle"), 2000);
      }
    } catch (error) {
      setSyncStatus("error");
      setConnectionStatus("disconnected");
      setTimeout(() => setSyncStatus("idle"), 2000);
    }
  };

  const { data: jobsData } = useJobs(1, 50);

  const jobs = jobsData?.jobs || [];

  // Get recent completed jobs (last 24 hours) and running jobs for notification count
  const recentCompletedJobs = jobs.filter(
    (job) =>
      (job.status === "done" || job.status === "failed") &&
      job.endTime &&
      new Date(job.endTime).getTime() > Date.now() - 24 * 60 * 60 * 1000,
  );

  const runningJobs = jobs.filter((job) => job.status === "running");
  const notificationCount = recentCompletedJobs.length + runningJobs.length;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRefreshIntervalChange = (value: string) => {
    setRefreshInterval(value);
    onRefreshIntervalChange(parseInt(value));
  };

  const handleIBMSync = async () => {
    setIsRefreshing(true); // Assuming setIsRefreshing is a typo and should be setIsSyncing
    try {
      const response = await fetch("/api/sync/ibm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onManualRefresh(); // Refresh the data after sync
        toast({
          title: "IBM Quantum Sync",
          description: "Successfully synced with IBM Quantum Cloud",
        });
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      toast({
        title: "Sync Error",
        description: "Failed to sync with IBM Quantum Cloud",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false); // Assuming setIsRefreshing is a typo and should be setIsSyncing
    }
  };

  // Search suggestions based on common keywords
  const searchSuggestions = [
    "running",
    "queued",
    "done",
    "failed",
    "cancelled",
    "ibm_cairo",
    "ibm_brisbane",
    "ibm_kyoto",
    "simulator",
    "VQE",
    "QAOA",
    "Grover",
    "Shor",
    "optimization",
    "error",
    "success",
    "timeout",
    "circuit",
    "backend",
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value); // Real-time search
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    setShowSuggestions(false);
  };

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-quantum-blue to-quantum-purple rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-7 h-7 text-white flex items-center justify-center">
                    ⚛️
                  </div>
                </motion.div>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  IBMQuantum
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-tight">
                  Jobs Dashboard
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Search and Controls */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder="Search jobs, backends, status, keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() =>
                    searchQuery.length > 0 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  className="pl-9 pr-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <Search className="h-3 w-3 mr-2 text-gray-400" />
                          <span className="capitalize">{suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Auto-refresh Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Auto-refresh:
              </span>
              <Select
                value={refreshInterval}
                onValueChange={handleRefreshIntervalChange}
              >
                <SelectTrigger
                  className="w-20 h-8"
                  data-testid="select-refresh-interval"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">1min</SelectItem>
                </SelectContent>
              </Select>
              {parseInt(refreshInterval) > 0 && (
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Center controls group */}
            <div className="flex items-center gap-4">
              {/* Connection Status Indicator */}
              <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className={cn("h-2 w-2 rounded-full", {
                    "bg-green-500 animate-pulse":
                      connectionStatus === "connected",
                    "bg-yellow-500 animate-pulse":
                      connectionStatus === "connecting",
                    "bg-red-500": connectionStatus === "disconnected",
                  })}
                />
                <span className="capitalize">{connectionStatus}</span>
                <span className="text-xs">
                  • Last sync: {lastSync.toLocaleTimeString()}
                </span>
              </div>

              <Button
                onClick={handleSync}
                disabled={syncStatus === "syncing"}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                data-testid="button-sync"
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    syncStatus === "syncing" && "animate-spin",
                  )}
                />
                <span className="hidden sm:inline">
                  {syncStatus === "syncing" && "Syncing..."}
                  {syncStatus === "success" && "Synced!"}
                  {syncStatus === "error" && "Error"}
                  {syncStatus === "idle" && "Sync IBM"}
                </span>
              </Button>
            </div>

            {/* Action buttons group */}
            <div className="flex items-center gap-2">
              {/* Teamwork Button */}
              <Link to="/teamwork">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                  data-testid="button-teamwork"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden lg:inline">Teamwork</span>
                </Button>
              </Link>

              {/* Play and Learn Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  data-testid="button-play-learn"
                  onClick={() => {
                    window.location.href = "/quantum-quest";
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                  </motion.div>
                  <span className="hidden sm:inline">Play and Learn</span>
                </Button>
              </motion.div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNotificationToggle}
                  className="relative"
                  data-testid="button-notifications"
                >
                  <Bell className="w-5 h-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </div>

              {/* User Menu */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      data-testid="button-user-menu"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4 mr-2" />
                      ) : (
                        <Moon className="w-4 h-4 mr-2" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <Link to="/my-jobs">
                      <DropdownMenuItem className="cursor-pointer">
                         <div className="flex items-center">
                           <Play className="w-4 h-4 mr-2" />
                           My Quantum Jobs
                         </div>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        toast({
                          title: "Signed Out",
                          description: "You have been successfully signed out.",
                        });
                        navigate("/");
                      }}
                      className="text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

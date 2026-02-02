import { useState, useEffect } from "react";
import { Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Users, DollarSign, FileText, 
  Newspaper, Trophy, History, Moon, Sun, Search,
  BarChart3, Settings, Menu, X, Clock, MapPin, RefreshCw,
  ChevronRight, Bell, LogOut, Home, User, Mail, Shield, Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AdminAnalytics from "@/components/admin/admin-analytics";
import AdminPricing from "@/components/admin/admin-pricing";
import AdminUsers from "@/components/admin/admin-users";
import AdminContent from "@/components/admin/admin-content";
import AdminNews from "@/components/admin/admin-news";
import AdminGameScores from "@/components/admin/admin-game-scores";
import AdminAuditLogs from "@/components/admin/admin-audit-logs";
import AdminSettings from "@/components/admin/admin-settings";
import AdminResources from "@/components/admin/admin-resources";


interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string;
  color?: string;
}

const navItems: NavItem[] = [
  { label: "Analytics", icon: LayoutDashboard, path: "/admin", color: "from-blue-500 to-cyan-500" },
  { label: "Resource List", icon: Server, path: "/admin/resources", color: "from-indigo-500 to-violet-500" },
  { label: "Registered user", icon: Shield, path: "/admin/users", color: "from-violet-500 to-purple-500" },
  { label: "Pricing Plans", icon: DollarSign, path: "/admin/pricing", color: "from-emerald-500 to-teal-500" },
  { label: "Content", icon: FileText, path: "/admin/content", color: "from-amber-500 to-orange-500" },
  { label: "News", icon: Newspaper, path: "/admin/news", color: "from-pink-500 to-rose-500" },
  { label: "Game Scores", icon: Trophy, path: "/admin/game-scores", color: "from-yellow-500 to-amber-500" },
  { label: "Audit Logs", icon: History, path: "/admin/audit-logs", color: "from-slate-500 to-gray-600" },
  { label: "Settings", icon: Settings, path: "/admin/settings", color: "from-indigo-500 to-blue-500" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<{ city: string; country: string; timezone: string } | null>(null);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
    navigate('/');
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    fetchUserLocation();

    return () => clearInterval(timer);
  }, []);

  const fetchUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setUserLocation({
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    } catch (error) {
      setUserLocation({
        city: 'Unknown',
        country: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    }
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentPageName = () => {
    const currentNav = navItems.find(item => item.path === location.pathname);
    return currentNav?.label || 'Dashboard';
  };

  const sidebarVariants = {
    open: { width: 256, transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: 80, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Sidebar */}
      <motion.aside
        initial={false}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen",
          "border-r border-border/40 bg-card/95 dark:bg-card/80 backdrop-blur-xl",
          "shadow-2xl shadow-primary/5"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-5 border-b border-border/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 relative z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
                  <BarChart3 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Admin
                  </span>
                  <p className="text-xs text-muted-foreground">Control Center</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative z-10 hover:bg-primary/10 transition-colors"
            data-testid="button-toggle-sidebar"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 mt-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                    "text-sm font-medium no-underline overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3 w-full">
                    <div className={cn(
                      "p-2 rounded-lg transition-all",
                      isActive 
                        ? "bg-white/20 dark:bg-black/20" 
                        : "bg-muted/50 group-hover:bg-primary/10"
                    )}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <AnimatePresence mode="wait">
                      {sidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center justify-between flex-1"
                        >
                          <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary-foreground font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {!isActive && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={cn("absolute inset-0 bg-gradient-to-r opacity-10 rounded-xl", item.color)} />
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border/40 p-4 space-y-2 bg-muted/20">
         
          
          <Button
            variant="ghost"
            size={sidebarOpen ? "default" : "icon"}
            onClick={handleLogout}
            className="w-full justify-start hover:bg-destructive/10 text-destructive hover:text-destructive rounded-xl transition-colors"
            data-testid="button-logout"
          >
            <div className="p-2 rounded-lg bg-destructive/10">
              <LogOut className="h-4 w-4" />
            </div>
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Enhanced Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-8 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <Home className="h-4 w-4 text-muted-foreground" />
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {getCurrentPageName()}
            </span>
          </div>

          <div className="flex-1 flex items-center gap-4 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anything... (⌘K)"
                className="pl-10 h-11 bg-muted/30 border-border/50 rounded-xl focus-visible:ring-primary/50"
                data-testid="button-global-search"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded-lg border border-border bg-muted px-2 font-mono text-xs font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time & Date Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-foreground" data-testid="text-current-time">{formatTime()}</div>
                <div className="text-muted-foreground" data-testid="text-current-date">{formatDate()}</div>
              </div>
            </motion.div>

            {/* Location Card */}
            {userLocation && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/10 border border-emerald-500/20"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-foreground" data-testid="text-user-location">
                    {userLocation.city}, {userLocation.country}
                  </div>
                  <div className="text-muted-foreground text-[10px]" data-testid="text-user-timezone">
                    {userLocation.timezone}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-10 w-10 rounded-xl hover:bg-primary/10"
                  data-testid="button-theme-toggle"
                  title="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-primary/10 relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.reload()}
                  className="h-10 w-10 rounded-xl hover:bg-primary/10"
                  data-testid="button-refresh"
                  title="Refresh Dashboard"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Admin Profile with Dropdown */}
            <div className="flex items-center gap-3 pl-4 border-l border-border/50">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 cursor-pointer focus:outline-none"
                    data-testid="button-admin-profile"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold" data-testid="text-admin-name">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-muted-foreground" data-testid="text-admin-role">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                      <span className="text-sm font-bold text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <DropdownMenuLabel className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-primary-foreground">
                          {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-muted-foreground w-40 truncate" title={user?.email}>
                          {user?.email || 'admin@quantumcloud.com'}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5" data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5" data-testid="menu-account">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5" data-testid="menu-security">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10" 
                    data-testid="menu-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content with Enhanced Background */}
        <div className="p-8 min-h-[calc(100vh-5rem)] relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <Routes>
              <Route index element={<AdminAnalytics />} />
              <Route path="resources" element={<AdminResources />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="game-scores" element={<AdminGameScores />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

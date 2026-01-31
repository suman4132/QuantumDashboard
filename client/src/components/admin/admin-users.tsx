import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreVertical, Users as UsersIcon, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/users/stats"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Users", 
      value: stats?.totalUsers || 0, 
      icon: UsersIcon,
      color: "bg-blue-500/10 text-blue-500",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      label: "Premium", 
      value: stats?.premiumUsers || 0, 
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-500",
      gradient: "from-emerald-500 to-emerald-600"
    },
    { 
      label: "Standard", 
      value: stats?.standardUsers || 0, 
      icon: UsersIcon,
      color: "bg-purple-500/10 text-purple-500",
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      label: "New (7d)", 
      value: stats?.newUsersLast7Days || 0, 
      icon: TrendingUp,
      color: "bg-amber-500/10 text-amber-500",
      gradient: "from-amber-500 to-amber-600"
    },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent" data-testid="text-users-title">
            User Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, subscriptions, and access controls
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button data-testid="button-create-user">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2" data-testid={`text-${stat.label.toLowerCase().replace(' ', '-')}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={item}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users by email or name..." 
                  className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                  data-testid="input-search-users" 
                />
              </div>
              <Button variant="outline" className="hover:bg-accent transition-colors">Filters</Button>
              <Button variant="outline" className="hover:bg-accent transition-colors">Export CSV</Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!users || users.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: any, index: number) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b hover:bg-accent/50 transition-colors"
                        data-testid={`row-user-${user.id}`}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                              {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-medium" data-testid={`text-user-name-${user.id}`}>{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.plan === 'premium' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className="capitalize"
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{user.jobsSubmitted || 0}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-accent"
                            data-testid={`button-user-menu-${user.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
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
    </motion.div>
  );
}

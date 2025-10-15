import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import {
  Settings, Cpu, Users, GraduationCap, Shield, Zap,
  Save, Activity, Atom, Trophy, Bell, Database, Key
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Platform Settings Schema
const platformSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  maintenanceMode: z.boolean(),
  allowRegistrations: z.boolean(),
});

// Quantum Backend Schema
const quantumBackendSchema = z.object({
  ibmApiToken: z.string().optional(),
  defaultBackend: z.string(),
  enableSimulator: z.boolean(),
  maxConcurrentJobs: z.coerce.number().min(1).max(100),
});

// Job Limits Schema
const jobLimitsSchema = z.object({
  freeMonthlyJobs: z.coerce.number().min(0),
  proMonthlyJobs: z.coerce.number().min(0),
  enterpriseMonthlyJobs: z.coerce.number().min(0),
  freeMaxQubits: z.coerce.number().min(1).max(30),
  proMaxQubits: z.coerce.number().min(1).max(30),
  enterpriseMaxQubits: z.coerce.number().min(1).max(30),
});

// Learning Settings Schema
const learningSchema = z.object({
  enableQuantumQuest: z.boolean(),
  enableQuizzes: z.boolean(),
  enableLeaderboards: z.boolean(),
  enableTutorials: z.boolean(),
  enableAchievements: z.boolean(),
  pointsPerChallenge: z.coerce.number().min(0),
});

// Security Schema
const securitySchema = z.object({
  require2FA: z.boolean(),
  sessionTimeout: z.coerce.number().min(5).max(120),
  maxLoginAttempts: z.coerce.number().min(1).max(10),
  passwordMinLength: z.coerce.number().min(6).max(32),
});

export default function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("platform");

  const { data: settings, isLoading, isError, error } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading settings",
        description: error instanceof Error ? error.message : "Failed to load settings. Using default values.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Platform Settings Form
  const platformForm = useForm<z.infer<typeof platformSchema>>({
    resolver: zodResolver(platformSchema),
    values: (settings as any)?.platform || {
      siteName: "QuantumCloud",
      tagline: "Cloud Quantum Computing Platform",
      maintenanceMode: false,
      allowRegistrations: true,
    },
  });

  // Quantum Backend Form
  const quantumForm = useForm<z.infer<typeof quantumBackendSchema>>({
    resolver: zodResolver(quantumBackendSchema),
    values: (settings as any)?.quantumBackend || {
      ibmApiToken: "",
      defaultBackend: "ibm_simulator",
      enableSimulator: true,
      maxConcurrentJobs: 10,
    },
  });

  // Job Limits Form
  const jobLimitsForm = useForm<z.infer<typeof jobLimitsSchema>>({
    resolver: zodResolver(jobLimitsSchema),
    values: (settings as any)?.jobLimits || {
      freeMonthlyJobs: 5,
      proMonthlyJobs: 100,
      enterpriseMonthlyJobs: 1000,
      freeMaxQubits: 5,
      proMaxQubits: 15,
      enterpriseMaxQubits: 30,
    },
  });

  // Learning Settings Form
  const learningForm = useForm<z.infer<typeof learningSchema>>({
    resolver: zodResolver(learningSchema),
    values: (settings as any)?.learning || {
      enableQuantumQuest: true,
      enableQuizzes: true,
      enableLeaderboards: true,
      enableTutorials: true,
      enableAchievements: true,
      pointsPerChallenge: 100,
    },
  });

  // Security Form
  const securityForm = useForm<z.infer<typeof securitySchema>>({
    resolver: zodResolver(securitySchema),
    values: (settings as any)?.security || {
      require2FA: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
    },
  });

  // Update Settings Mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: any }) => {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onPlatformSubmit = (data: z.infer<typeof platformSchema>) => {
    updateSettingsMutation.mutate({ section: "platform", data });
  };

  const onQuantumSubmit = (data: z.infer<typeof quantumBackendSchema>) => {
    updateSettingsMutation.mutate({ section: "quantumBackend", data });
  };

  const onJobLimitsSubmit = (data: z.infer<typeof jobLimitsSchema>) => {
    updateSettingsMutation.mutate({ section: "jobLimits", data });
  };

  const onLearningSubmit = (data: z.infer<typeof learningSchema>) => {
    updateSettingsMutation.mutate({ section: "learning", data });
  };

  const onSecuritySubmit = (data: z.infer<typeof securitySchema>) => {
    updateSettingsMutation.mutate({ section: "security", data });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent" data-testid="text-settings-title">
            Platform Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure your QuantumCloud platform settings
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3" />
          All Systems Operational
        </Badge>
      </motion.div>

      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1 bg-muted/30">
            <TabsTrigger value="platform" className="gap-2" data-testid="tab-platform">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Platform</span>
            </TabsTrigger>
            <TabsTrigger value="quantum" className="gap-2" data-testid="tab-quantum">
              <Atom className="h-4 w-4" />
              <span className="hidden sm:inline">Quantum</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2" data-testid="tab-jobs">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">Job Limits</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-2" data-testid="tab-learning">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Learning</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2" data-testid="tab-security">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Platform Settings */}
          <TabsContent value="platform" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Configuration
                </CardTitle>
                <CardDescription>Basic platform information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...platformForm}>
                  <form onSubmit={platformForm.handleSubmit(onPlatformSubmit)} className="space-y-4">
                    <FormField
                      control={platformForm.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-site-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={platformForm.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-tagline" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <FormField
                      control={platformForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Maintenance Mode</FormLabel>
                            <FormDescription>
                              Temporarily disable site access for maintenance
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-maintenance"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={platformForm.control}
                      name="allowRegistrations"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Allow New Registrations</FormLabel>
                            <FormDescription>
                              Enable or disable new user sign-ups
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-registrations"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-platform">
                        <Save className="mr-2 h-4 w-4" />
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Platform Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quantum Backend Settings */}
          <TabsContent value="quantum" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5" />
                  Quantum Backend Configuration
                </CardTitle>
                <CardDescription>Configure quantum computing backends and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...quantumForm}>
                  <form onSubmit={quantumForm.handleSubmit(onQuantumSubmit)} className="space-y-4">
                    <FormField
                      control={quantumForm.control}
                      name="ibmApiToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IBM Quantum API Token</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Enter IBM Quantum API token" data-testid="input-ibm-token" />
                          </FormControl>
                          <FormDescription>
                            API token for accessing IBM Quantum systems
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={quantumForm.control}
                      name="defaultBackend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Backend</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-backend">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ibm_simulator">IBM Simulator</SelectItem>
                              <SelectItem value="ibm_quantum">IBM Quantum</SelectItem>
                              <SelectItem value="local_simulator">Local Simulator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={quantumForm.control}
                      name="maxConcurrentJobs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Concurrent Jobs</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-max-jobs" />
                          </FormControl>
                          <FormDescription>
                            Maximum number of jobs that can run simultaneously
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={quantumForm.control}
                      name="enableSimulator"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Quantum Simulator</FormLabel>
                            <FormDescription>
                              Allow users to use local quantum simulator
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-simulator"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-quantum">
                        <Save className="mr-2 h-4 w-4" />
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Quantum Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Limits */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Job Limits & Quotas
                </CardTitle>
                <CardDescription>Configure job limits for each subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...jobLimitsForm}>
                  <form onSubmit={jobLimitsForm.handleSubmit(onJobLimitsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Monthly Job Limits</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={jobLimitsForm.control}
                          name="freeMonthlyJobs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Free Tier</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-free-jobs" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={jobLimitsForm.control}
                          name="proMonthlyJobs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-pro-jobs" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={jobLimitsForm.control}
                          name="enterpriseMonthlyJobs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enterprise</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-enterprise-jobs" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold">Maximum Qubits</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={jobLimitsForm.control}
                          name="freeMaxQubits"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Free Tier</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-free-qubits" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={jobLimitsForm.control}
                          name="proMaxQubits"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-pro-qubits" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={jobLimitsForm.control}
                          name="enterpriseMaxQubits"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Enterprise</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" data-testid="input-enterprise-qubits" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-jobs">
                        <Save className="mr-2 h-4 w-4" />
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Job Limits"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning & Gamification */}
          <TabsContent value="learning" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Learning & Gamification
                </CardTitle>
                <CardDescription>Configure educational features and game elements</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...learningForm}>
                  <form onSubmit={learningForm.handleSubmit(onLearningSubmit)} className="space-y-4">
                    <FormField
                      control={learningForm.control}
                      name="enableQuantumQuest"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              Enable Quantum Quest
                            </FormLabel>
                            <FormDescription>
                              Interactive quantum computing challenges and levels
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-quantum-quest"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={learningForm.control}
                      name="enableQuizzes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Quizzes</FormLabel>
                            <FormDescription>
                              Knowledge testing and assessment features
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-quizzes"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={learningForm.control}
                      name="enableLeaderboards"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Leaderboards</FormLabel>
                            <FormDescription>
                              Global and challenge-specific rankings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-leaderboards"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={learningForm.control}
                      name="enableTutorials"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Tutorials</FormLabel>
                            <FormDescription>
                              Interactive learning modules and guides
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-tutorials"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={learningForm.control}
                      name="enableAchievements"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Achievements</FormLabel>
                            <FormDescription>
                              Badges and rewards for completing challenges
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-achievements"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <FormField
                      control={learningForm.control}
                      name="pointsPerChallenge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Points per Challenge</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-points" />
                          </FormControl>
                          <FormDescription>
                            Base points awarded for completing a challenge
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-learning">
                        <Save className="mr-2 h-4 w-4" />
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Learning Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Authentication
                </CardTitle>
                <CardDescription>Configure security policies and authentication settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                    <FormField
                      control={securityForm.control}
                      name="require2FA"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Require Two-Factor Authentication</FormLabel>
                            <FormDescription>
                              Force all users to enable 2FA for enhanced security
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-2fa"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Separator />
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-session-timeout" />
                          </FormControl>
                          <FormDescription>
                            Automatically log out users after this period of inactivity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="maxLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Login Attempts</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-max-attempts" />
                          </FormControl>
                          <FormDescription>
                            Lock account after this many failed login attempts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="passwordMinLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Password Length</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" data-testid="input-password-length" />
                          </FormControl>
                          <FormDescription>
                            Minimum number of characters required for passwords
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={updateSettingsMutation.isPending} data-testid="button-save-security">
                        <Save className="mr-2 h-4 w-4" />
                        {updateSettingsMutation.isPending ? "Saving..." : "Save Security Settings"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

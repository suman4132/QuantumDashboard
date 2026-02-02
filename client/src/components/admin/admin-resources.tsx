import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Server, Database, Cpu, Plus, MoreVertical, 
  Power, RefreshCw, Trash2, Search, Filter,
  Box, Cloud, Shield, Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type ResourceStatus = "active" | "inactive" | "maintenance" | "provisioning";

interface Resource {
  id: string;
  name: string;
  type: "quantum-backend" | "simulator" | "storage" | "compute";
  region: string;
  status: ResourceStatus;
  created: string;
  owner: string;
}

const mockResources: Resource[] = [
  { id: "crn:v1:ibm_brisbane", name: "ibm_brisbane", type: "quantum-backend", region: "us-east", status: "active", created: "2023-11-15", owner: "System" },
  { id: "crn:v1:ibm_osaka", name: "ibm_osaka", type: "quantum-backend", region: "jp-osaka", status: "maintenance", created: "2024-01-20", owner: "System" },
  { id: "crn:v1:qasm_sim", name: "ibmq_qasm_simulator", type: "simulator", region: "global", status: "active", created: "2023-09-01", owner: "System" },
  { id: "crn:v1:obj_store_1", name: "research-results-bucket", type: "storage", region: "us-south", status: "active", created: "2024-02-10", owner: "Dr. Smith" },
  { id: "crn:v1:serverless_1", name: "hybrid-job-cluster", type: "compute", region: "eu-de", status: "provisioning", created: "2024-03-05", owner: "Research Team A" },
];

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

export default function AdminResources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const handleAction = (id: string, action: string) => {
    toast({
      title: "Resource Action",
      description: `Initiated ${action} for resource ${id}`,
    });
  };

  const getStatusColor = (status: ResourceStatus) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "inactive": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "maintenance": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "provisioning": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quantum-backend": return <Cpu className="h-4 w-4" />;
      case "simulator": return <Activity className="h-4 w-4" />;
      case "storage": return <Database className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || r.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Resource List
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your cloud resources, services, and infrastructure
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Provision Resource
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Resource Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="quantum-backend">Quantum Systems</SelectItem>
                    <SelectItem value="simulator">Simulators</SelectItem>
                    <SelectItem value="storage">Object Storage</SelectItem>
                    <SelectItem value="compute">Compute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border/50">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4 hidden md:table-cell">Type</th>
                    <th className="p-4 hidden sm:table-cell">Region</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 hidden lg:table-cell">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((resource) => (
                    <tr key={resource.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {getTypeIcon(resource.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{resource.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{resource.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="capitalize">{resource.type.replace('-', ' ')}</span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">{resource.region}</span>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`${getStatusColor(resource.status)} capitalize`}>
                          {resource.status}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground">
                        {resource.created}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction(resource.name, "Restart")}>
                              <RefreshCw className="mr-2 h-4 w-4" /> Restart
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(resource.name, "Stop")}>
                              <Power className="mr-2 h-4 w-4" /> Stop
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleAction(resource.name, "Delete")}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredResources.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <Box className="h-8 w-8 opacity-50" />
                          <p>No resources found matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

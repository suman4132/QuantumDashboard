import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Workspace, Project, InsertWorkspace, InsertProject, Backend } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useWorkspaces() {
    return useQuery<Workspace[]>({
        queryKey: ["/api/workspaces"],
    });
}

export function useWorkspace(id: string | null) {
    return useQuery<Workspace>({
        queryKey: [`/api/workspaces/${id}`],
        enabled: !!id,
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (workspace: InsertWorkspace) => {
            const res = await apiRequest("POST", "/api/workspaces", workspace);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
            toast({
                title: "Workspace created",
                description: "Your new workspace has been successfully created.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create workspace. Please try again.",
                variant: "destructive"
            });
        }
    });
}

export function useUpdateWorkspace() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Workspace> }) => {
            const res = await apiRequest("PATCH", `/api/workspaces/${id}`, data);
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
            queryClient.invalidateQueries({ queryKey: [`/api/workspaces/${variables.id}`] });
            toast({
                title: "Workspace updated",
                description: "Changes saved successfully.",
            });
        },
    });
}

export function useDeleteWorkspace() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiRequest("DELETE", `/api/workspaces/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] });
            toast({
                title: "Workspace deleted",
                description: "The workspace has been removed.",
            });
        },
    });
}

export function useWorkspaceProjects(workspaceId: string | null) {
    return useQuery<Project[]>({
        queryKey: [`/api/workspaces/${workspaceId}/projects`],
        enabled: !!workspaceId,
    });
}

export function useCreateProject() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async (project: InsertProject) => {
            const res = await apiRequest("POST", "/api/projects", project);
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`/api/workspaces/${variables.workspaceId}/projects`] });
            queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
            toast({
                title: "Project created",
                description: "New project added to the workspace.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create project.",
                variant: "destructive"
            });
        }
    });
}

export function useBackends() {
    return useQuery<Backend[]>({
        queryKey: ["/api/backends"],
    });
}

export function useWorkspaceMembers(workspaceId: string | null) {
    return useQuery({
        queryKey: [`/api/workspaces/${workspaceId}/members`],
        enabled: !!workspaceId,
    });
}

export function useAddWorkspaceMember() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: async ({ workspaceId, data }: { workspaceId: string; data: any }) => {
            const res = await apiRequest("POST", `/api/workspaces/${workspaceId}/members`, data);
            return res.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [`/api/workspaces/${variables.workspaceId}/members`] });
            queryClient.invalidateQueries({ queryKey: ["/api/workspaces"] }); // Update list view counts
            toast({
                title: "Member added",
                description: "Team member has been successfully added.",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add member.",
                variant: "destructive"
            });
        }
    });
}

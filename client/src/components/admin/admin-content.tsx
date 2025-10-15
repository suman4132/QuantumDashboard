import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminContent() {
  const { data: sections, isLoading } = useQuery({
    queryKey: ["/api/admin/content"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const sectionTypes = {
    hero: { label: "Hero", color: "bg-blue-500" },
    features: { label: "Features", color: "bg-emerald-500" },
    faq: { label: "FAQ", color: "bg-purple-500" },
    docs_page: { label: "Docs", color: "bg-amber-500" },
    footer: { label: "Footer", color: "bg-slate-500" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-content-title">Content Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage landing page sections and documentation
          </p>
        </div>
        <Button data-testid="button-create-content">
          <Plus className="mr-2 h-4 w-4" />
          New Section
        </Button>
      </div>

      <div className="space-y-4">
        {(!sections || sections.length === 0) ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No content sections yet. Create your first section to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section: any) => {
            const typeInfo = sectionTypes[section.type as keyof typeof sectionTypes] || { label: section.type, color: "bg-gray-500" };
            
            return (
              <Card key={section.id} data-testid={`card-section-${section.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2 h-2 rounded-full ${typeInfo.color}`} />
                        <h3 className="font-semibold" data-testid={`text-section-title-${section.id}`}>{section.title}</h3>
                        <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                        <Badge variant={section.status === 'published' ? 'default' : 'secondary'}>
                          {section.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {section.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Version {section.version || 1}</span>
                        {section.publishedAt && (
                          <span>Published {new Date(section.publishedAt).toLocaleDateString()}</span>
                        )}
                        {section.updatedBy && (
                          <span>By {section.updatedBy}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-edit-section-${section.id}`}>
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-preview-section-${section.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      {section.status === 'draft' && (
                        <Button variant="default" size="sm" data-testid={`button-publish-section-${section.id}`}>
                          <Globe className="mr-1 h-3 w-3" />
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

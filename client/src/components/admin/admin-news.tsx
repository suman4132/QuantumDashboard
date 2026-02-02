import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Pin, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminNews() {
  const { data: news, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/news"],
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-news-title">News Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage dashboard announcements
          </p>
        </div>
        <Button data-testid="button-create-news">
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {(!news || news.length === 0) ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No news announcements yet. Create your first announcement to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          news.map((item: any) => (
            <Card key={item.id} data-testid={`card-news-${item.id}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.isPinned && <Pin className="h-4 w-4 text-amber-500" />}
                      <h3 className="font-semibold" data-testid={`text-news-title-${item.id}`}>{item.title}</h3>
                      <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <Badge variant="outline">{item.visibility}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.body}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {item.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <span>{item.impressions || 0} views</span>
                      <span>{item.clicks || 0} clicks</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid={`button-edit-news-${item.id}`}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    {item.status === 'draft' && (
                      <Button variant="default" size="sm" data-testid={`button-publish-news-${item.id}`}>
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

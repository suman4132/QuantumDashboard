import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, CheckCircle, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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

export default function AdminPricing() {
  const { data: plans, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/pricing-plans"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent" data-testid="text-pricing-title">
            Pricing Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage pricing plans, features, and revenue tracking
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button data-testid="button-create-plan">
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(!plans || plans.length === 0) ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No pricing plans yet. Create your first plan to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          plans.map((plan: any) => (
            <motion.div
              key={plan.id}
              variants={item}
              whileHover={{ scale: 1.03, y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className={`relative overflow-hidden group hover:shadow-2xl transition-all duration-300 ${
                  plan.isPopular ? 'border-primary border-2' : ''
                }`}
                data-testid={`card-plan-${plan.id}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                      POPULAR
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={plan.status === 'published' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  <div className="border-t pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        ${plan.monthlyPrice / 100}
                      </span>
                      <span className="text-muted-foreground font-medium">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      or ${plan.yearlyPrice / 100}/year (save {Math.round((1 - (plan.yearlyPrice / (plan.monthlyPrice * 12))) * 100)}%)
                    </p>
                  </div>

                  {(plan.subscribers !== undefined || plan.revenue !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <Users className="h-3 w-3" />
                          <span>Subscribers</span>
                        </div>
                        <p className="text-xl font-bold">{plan.subscribers || 0}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Revenue</span>
                        </div>
                        <p className="text-xl font-bold">${((plan.revenue || 0) / 100).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 border-t pt-4">
                    <p className="text-sm font-semibold text-muted-foreground">Key Features:</p>
                    <ul className="space-y-2">
                      {plan.features?.slice(0, 4).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.features?.length > 4 && (
                        <li className="text-xs text-muted-foreground ml-6">
                          +{plan.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors" 
                      data-testid={`button-edit-${plan.id}`}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-accent transition-colors" 
                      data-testid={`button-preview-${plan.id}`}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-destructive hover:text-destructive-foreground transition-colors" 
                      data-testid={`button-delete-${plan.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}


import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  change?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  change,
  className,
}: StatCardProps) => {
  const isPositive = change && !change.startsWith("-");

  return (
    <Card className={cn("stats-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change) && (
          <div className="flex items-center pt-1">
            {change && (
              <span
                className={cn(
                  "mr-1 text-xs",
                  isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {change}
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

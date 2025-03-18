
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      case "active":
        return { label: "Active", variant: "success" };
      case "inactive":
        return { label: "Inactive", variant: "outline" };
      case "scheduled":
        return { label: "Scheduled", variant: "secondary" };
      case "ongoing":
        return { label: "Ongoing", variant: "default" };
      case "completed":
        return { label: "Completed", variant: "success" };
      case "cancelled":
        return { label: "Cancelled", variant: "destructive" };
      case "on leave":
        return { label: "On Leave", variant: "warning" };
      default:
        return { label: status, variant: "outline" };
    }
  };

  const config = getStatusConfig(status);
  
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "destructive":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "secondary":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      default:
        return "";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "capitalize font-medium", 
        getVariantStyles(config.variant), 
        className
      )}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;

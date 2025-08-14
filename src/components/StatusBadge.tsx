import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface StatusBadgeProps {
  status: "Active" | "Pending" | "Approved" | "Rejected" | "Suspended" | "Expired" | "Cancelled by User" | "Monthly" | "Yearly" | "Paid" | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "approved":  
      case "paid":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      
      case "rejected":
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700";
      
      case "cancelled by user":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      
      case "monthly":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      
      case "yearly":
        return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800";
      
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border",
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </Badge>
  );
}

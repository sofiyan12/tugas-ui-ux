interface StatusBadgeProps {
  status: "Completed" | "Pending Review" | "Pending" | "Draft" | "Archived" | "On Track" | string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "on track":
        return "bg-green-100 text-green-700";
      case "pending review":
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "draft":
        return "bg-blue-100 text-blue-700";
      case "archived":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span className={`rounded-full ${getStatusColor(status)} ${sizeClasses[size]} inline-flex items-center justify-center`}>
      {status}
    </span>
  );
}

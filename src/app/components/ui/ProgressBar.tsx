interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "primary" | "success" | "warning" | "danger";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  color = "primary",
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    primary: "bg-primary",
    success: "bg-green-500",
    warning: "bg-orange-500",
    danger: "bg-red-500",
  };

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      <div className={`bg-muted rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} h-full rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}

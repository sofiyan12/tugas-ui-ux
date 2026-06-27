import { ReactNode } from "react";

interface ResponsiveCardProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCard({ children, className = "" }: ResponsiveCardProps) {
  return (
    <div className={`bg-card rounded-lg md:rounded-xl border border-border ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCardHeader({ children, className = "" }: ResponsiveCardHeaderProps) {
  return (
    <div className={`p-4 md:p-6 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

interface ResponsiveCardContentProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveCardContent({ children, className = "" }: ResponsiveCardContentProps) {
  return (
    <div className={`p-4 md:p-6 ${className}`}>
      {children}
    </div>
  );
}

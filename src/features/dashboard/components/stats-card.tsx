
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon: LucideIcon;
  description?: string;
  iconClassName?: string;
  iconContainerClassName?: string;
  children?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName,
  iconContainerClassName,
  children,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm dark:bg-card/30 rounded-4xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-border/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={cn(
            "flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-[1.25rem] shadow-sm",
            iconContainerClassName
          )}
        >
          <Icon className={cn("h-6 w-6 md:h-7 md:w-7", iconClassName)} />
        </div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        {title}
      </h3>
      <div className="text-2xl md:text-3xl font-bold text-foreground">
        {value}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {children}
    </div>
  );
}

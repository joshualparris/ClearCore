import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'ghost' | 'glass';
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function StatusCard({ 
  title, 
  description, 
  icon: Icon, 
  variant = 'default',
  className,
  onClick,
  children
}: StatusCardProps) {
  const baseStyles = "rounded-2xl p-5 transition-all duration-200 relative overflow-hidden group";
  
  const variants = {
    default: "bg-card border border-border/50 shadow-sm hover:shadow-md",
    outline: "border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5",
    ghost: "hover:bg-muted/50",
    glass: "bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg"
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        baseStyles, 
        variants[variant], 
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground/90 font-display mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground/90 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

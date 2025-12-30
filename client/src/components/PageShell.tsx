import { ReactNode, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PageShellProps {
  title?: string;
  children: ReactNode;
  showBack?: boolean;
  className?: string;
  action?: ReactNode;
  onBack?: () => void;
  layout?: 'narrow' | 'wide' | 'responsive';
}

export function PageShell({ 
  title, 
  children, 
  showBack = false, 
  className,
  action,
  onBack,
  layout
}: PageShellProps) {
  const [, setLocation] = useLocation();
  const [layoutMode, setLayoutMode] = useState<'classic' | 'new'>(() => {
    if (typeof window === 'undefined') return 'classic';
    const saved = localStorage.getItem('layout-mode');
    return saved === 'new' ? 'new' : 'classic';
  });

  useEffect(() => {
    localStorage.setItem('layout-mode', layoutMode);
  }, [layoutMode]);

  const effectiveLayout = layout ?? (layoutMode === 'classic' ? 'narrow' : 'responsive');
  const isWide = effectiveLayout === 'wide';
  const isResponsive = effectiveLayout === 'responsive';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocation('/');
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col mx-auto shadow-2xl shadow-black/5 overflow-hidden",
      isWide && "max-w-5xl md:rounded-3xl md:border md:border-border/30 md:shadow-xl",
      !isWide && !isResponsive && "max-w-md border-x border-border/40",
      isResponsive && "w-full max-w-md md:max-w-4xl lg:max-w-5xl border-x border-border/40 md:border md:border-border/30 md:rounded-3xl"
    )}>
      <header className="px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/20">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold tracking-tight text-foreground/90 font-display">
              {title}
            </h1>
          )}
        </div>
        {action && <div>{action}</div>}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Layout</span>
          <div className="flex rounded-full border border-border/60 overflow-hidden bg-muted/60">
            <button
              onClick={() => setLayoutMode('classic')}
              className={cn(
                "px-3 py-1 text-xs font-semibold transition-colors",
                layoutMode === 'classic' 
                  ? "bg-background text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              Classic
            </button>
            <button
              onClick={() => setLayoutMode('new')}
              className={cn(
                "px-3 py-1 text-xs font-semibold transition-colors",
                layoutMode === 'new' 
                  ? "bg-background text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              New
            </button>
          </div>
        </div>
      </header>
      
      <main className={cn("flex-1 p-6 md:p-10 relative overflow-y-auto", className)}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full flex flex-col"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

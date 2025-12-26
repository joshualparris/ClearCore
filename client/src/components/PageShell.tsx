import { ReactNode } from 'react';
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
}

export function PageShell({ 
  title, 
  children, 
  showBack = false, 
  className,
  action,
  onBack
}: PageShellProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl shadow-black/5 overflow-hidden border-x border-border/40">
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border/20">
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
      </header>
      
      <main className={cn("flex-1 p-6 relative overflow-y-auto", className)}>
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

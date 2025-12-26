import { Link } from "wouter";
import { PageShell } from "@/components/PageShell";
import { StatusCard } from "@/components/StatusCard";
import { useAppState } from "@/state/AppStateProvider";
import { format, differenceInDays } from "date-fns";
import { 
  ShieldAlert, 
  Heart, 
  Activity, 
  ClipboardCheck,
  CalendarDays,
  Settings,
  Flame,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { state } = useAppState();
  
  const todayISO = format(new Date(), 'yyyy-MM-dd');
  const isDailyComplete = !!state.daily[todayISO]?.completed;
  
  // Streak Logic
  const lastSlip = state.lastSlipAtISO ? new Date(state.lastSlipAtISO) : null;
  // If no slip ever, calculate from first log or just generic "start"
  // For simplicity, if no slip, we count from first log or return 0
  const firstLog = state.logs.length > 0 
    ? new Date(state.logs[state.logs.length - 1].createdAtISO) 
    : new Date();
    
  const startDate = lastSlip || firstLog;
  const daysClean = differenceInDays(new Date(), startDate);

  return (
    <PageShell className="pb-24">
      {/* Header Greeting */}
      <div className="mb-8 mt-2">
        <h2 className="text-muted-foreground font-medium text-sm mb-1">
          {format(new Date(), 'EEEE, MMMM do')}
        </h2>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
          Welcome back.
        </h1>
      </div>

      <div className="space-y-6">
        {/* Main Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/daily" className="col-span-1">
            <div className={`
              h-full p-5 rounded-2xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between
              ${isDailyComplete 
                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' 
                : 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg hover:shadow-primary/5'}
            `}>
              <div className="flex justify-between items-start">
                <Heart className={`w-6 h-6 ${isDailyComplete ? 'text-green-600' : 'text-primary'}`} />
                {isDailyComplete && <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">DONE</div>}
              </div>
              <div>
                <h3 className="font-bold text-lg mt-3 font-display">Daily with Jesus</h3>
                <p className="text-xs text-muted-foreground mt-1">Start your day anchored</p>
              </div>
            </div>
          </Link>

          <Link href="/sos" className="col-span-1">
            <div className="h-full bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 p-5 rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between hover:shadow-lg hover:shadow-destructive/5">
              <ShieldAlert className="w-6 h-6 text-destructive" />
              <div>
                <h3 className="font-bold text-lg mt-3 font-display text-destructive-foreground dark:text-destructive">SOS</h3>
                <p className="text-xs text-muted-foreground mt-1">I'm tempted right now</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="space-y-3">
          <Link href="/log">
            <StatusCard 
              title="HALT Check-in" 
              description="Identify triggers before they become actions."
              icon={Activity}
              className="bg-card hover:bg-accent/5"
            />
          </Link>

          <Link href="/progress">
            <StatusCard 
              title="Your Journey" 
              description={`${daysClean} days walking in freedom. Grace upon grace.`}
              icon={Flame}
              className="bg-card hover:bg-orange-500/5"
            >
              <div className="w-full bg-secondary/50 h-1.5 rounded-full mt-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (daysClean / 30) * 100)}%` }}
                  className="bg-orange-400 h-full rounded-full"
                />
              </div>
            </StatusCard>
          </Link>
        </div>

        {/* Accountability & Review */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/review">
            <div className="bg-secondary/30 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-secondary/50 transition-colors cursor-pointer border border-transparent hover:border-border">
              <ClipboardCheck className="w-6 h-6 text-foreground/70" />
              <span className="text-sm font-medium">Weekly Review</span>
            </div>
          </Link>
          <Link href="/settings">
            <div className="bg-secondary/30 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:bg-secondary/50 transition-colors cursor-pointer border border-transparent hover:border-border">
              <Settings className="w-6 h-6 text-foreground/70" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

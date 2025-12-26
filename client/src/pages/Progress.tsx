import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { differenceInDays, format } from "date-fns";
import { Flame, Trophy, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const { state } = useAppState();

  const lastSlip = state.lastSlipAtISO ? new Date(state.lastSlipAtISO) : null;
  // If no slip ever, calculate from first log or just generic "start"
  const firstLog = state.logs.length > 0 
    ? new Date(state.logs[state.logs.length - 1].createdAtISO) 
    : new Date();
  
  const startDate = lastSlip || firstLog;
  const daysClean = differenceInDays(new Date(), startDate);
  
  const wins = state.logs.filter(l => l.outcome === 'win').length;
  const slips = state.logs.filter(l => l.outcome === 'slip').length;

  return (
    <PageShell showBack title="Your Journey">
      <div className="space-y-6">
        
        {/* Hero Streak Card */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white shadow-xl shadow-primary/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <span className="text-white/80 font-medium tracking-wide uppercase text-sm">Current Streak</span>
            <div className="text-8xl font-bold font-display my-2 tracking-tighter">
              {daysClean}
            </div>
            <span className="text-white/80 font-medium">Days of Freedom</span>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">{wins}</span>
            <span className="text-xs text-muted-foreground uppercase font-bold">Total Wins</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold">{slips}</span>
            <span className="text-xs text-muted-foreground uppercase font-bold">Learning Moments</span>
          </div>
        </div>

        {/* Recent History List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Recent History
          </h3>
          
          <div className="space-y-3">
            {state.logs.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No entries yet. Start by logging a check-in.</p>
            ) : (
              state.logs.slice(0, 5).map(log => (
                <div key={log.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        log.outcome === 'win' ? 'bg-green-500' : 
                        log.outcome === 'slip' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <span className="font-bold text-sm capitalize">{log.outcome}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAtISO), "MMM d, h:mm a")} • {log.chosenResponse.label}
                    </p>
                  </div>
                  <div className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">
                    Urge: {log.urgeStrength}/5
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

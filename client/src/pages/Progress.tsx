import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { differenceInDays, format } from "date-fns";
import { Flame, Trophy, Calendar, AlertCircle, Sparkles, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";

type Badge = {
  title: string;
  description: string;
  icon: typeof Flame;
  accent: string;
};

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
  const reviewCount = Object.keys(state.weeklyReviews).length;

  const badges = [
    daysClean >= 7 && {
      title: "Flamekeeper",
      description: "7+ day streak in motion",
      icon: Flame,
      accent: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-100"
    },
    wins >= 5 && {
      title: "Momentum Maker",
      description: "Five logged wins — stacking bricks",
      icon: Trophy,
      accent: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-100"
    },
    reviewCount > 0 && {
      title: "Reflector",
      description: "Completed a weekly review",
      icon: Calendar,
      accent: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-100"
    },
    state.logs.length >= 10 && {
      title: "Historian",
      description: "10+ HALT check-ins captured",
      icon: PartyPopper,
      accent: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-100"
    }
  ].filter(Boolean) as Badge[];

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

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Unlocked vibes</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.title}
                  className={`flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.accent}`}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{badge.title}</p>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

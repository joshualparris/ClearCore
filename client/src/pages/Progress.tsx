import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { differenceInDays, format } from "date-fns";
import { Flame, Trophy, Calendar, AlertCircle, Sparkles, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Badge = {
  title: string;
  description: string;
  icon: typeof Flame;
  accent: string;
};

type DailyMetrics = {
  screensOut: boolean;
  morningStack: boolean;
  exerciseBreath: boolean;
  eveningConnect: boolean;
  temptationsResisted: number;
  relapses: number;
  mood: number;
  prayerScripture: boolean;
};

const METRICS_STORAGE_KEY = "pure-heart-daily-metrics";

function useDailyMetrics(): [DailyMetrics, (next: DailyMetrics) => void] {
  const today = new Date().toISOString().slice(0, 10);
  const [metrics, setMetrics] = useState<DailyMetrics>({
    screensOut: false,
    morningStack: false,
    exerciseBreath: false,
    eveningConnect: false,
    temptationsResisted: 0,
    relapses: 0,
    mood: 3,
    prayerScripture: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(METRICS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[today]) {
          setMetrics(parsed[today]);
        }
      }
    } catch (err) {
      console.warn("Failed to load metrics", err);
    }
  }, [today]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(METRICS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[today] = metrics;
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.warn("Failed to save metrics", err);
    }
  }, [metrics, today]);

  return [metrics, setMetrics];
}

export default function Progress() {
  const { state } = useAppState();
  const [metrics, setMetrics] = useDailyMetrics();

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

        {/* Daily Metrics Checklist */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-[0.08em]">Today’s checklist</p>
              <p className="text-lg font-bold">Recovery hygiene</p>
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMM d")}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CheckboxRow
              label="Devices out of bedroom/bathroom"
              checked={metrics.screensOut}
              onChange={(v) => setMetrics({ ...metrics, screensOut: v })}
            />
            <CheckboxRow
              label="Morning stack done"
              checked={metrics.morningStack}
              onChange={(v) => setMetrics({ ...metrics, morningStack: v })}
            />
            <CheckboxRow
              label="Exercise/breathing done"
              checked={metrics.exerciseBreath}
              onChange={(v) => setMetrics({ ...metrics, exerciseBreath: v })}
            />
            <CheckboxRow
              label="Evening connect with spouse"
              checked={metrics.eveningConnect}
              onChange={(v) => setMetrics({ ...metrics, eveningConnect: v })}
            />
            <CheckboxRow
              label="Prayer/Scripture today"
              checked={metrics.prayerScripture}
              onChange={(v) => setMetrics({ ...metrics, prayerScripture: v })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <NumberRow
              label="Temptations resisted"
              value={metrics.temptationsResisted}
              onChange={(v) => setMetrics({ ...metrics, temptationsResisted: v })}
            />
            <NumberRow
              label="Relapses"
              value={metrics.relapses}
              onChange={(v) => setMetrics({ ...metrics, relapses: v })}
            />
            <MoodRow
              label="Mood (1–5)"
              value={metrics.mood}
              onChange={(v) => setMetrics({ ...metrics, mood: v })}
            />
          </div>
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

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 bg-muted/40 dark:bg-white/5 rounded-xl px-3 py-2 border border-border/50 cursor-pointer">
      <input
        type="checkbox"
        className="w-4 h-4 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function NumberRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 bg-muted/40 dark:bg-white/5 rounded-xl px-3 py-2 border border-border/50">
      <span className="text-sm">{label}</span>
      <input
        type="number"
        min={0}
        className="bg-background border border-border rounded-lg px-2 py-1 text-sm"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
      />
    </label>
  );
}

function MoodRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 bg-muted/40 dark:bg-white/5 rounded-xl px-3 py-2 border border-border/50">
      <span className="text-sm">{label}</span>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="text-xs text-muted-foreground">Current: {value}/5</div>
    </label>
  );
}

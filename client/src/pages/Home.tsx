import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { StatusCard } from "@/components/StatusCard";
import { useAppState } from "@/state/AppStateProvider";
import { format, differenceInDays } from "date-fns";
import { 
  ShieldAlert, 
  Heart, 
  Activity, 
  ClipboardCheck,
  Settings,
  Flame,
  Sparkles,
  Phone,
  ShieldCheck,
  BookOpen,
  SunMoon
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { state } = useAppState();
  
  const todayISO = format(new Date(), 'yyyy-MM-dd');
  const isDailyComplete = !!state.daily[todayISO]?.completed;
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Streak Logic
  const lastSlip = state.lastSlipAtISO ? new Date(state.lastSlipAtISO) : null;
  // If no slip ever, calculate from first log or just generic "start"
  // For simplicity, if no slip, we count from first log or return 0
  const firstLog = state.logs.length > 0 
    ? new Date(state.logs[state.logs.length - 1].createdAtISO) 
    : new Date();
    
  const startDate = lastSlip || firstLog;
  const daysClean = differenceInDays(new Date(), startDate);
  const dailyCount = Object.keys(state.daily).length;
  const reviewCount = Object.keys(state.weeklyReviews).length;
  const funPoints = daysClean * 2 + state.logs.length * 3 + dailyCount * 4 + reviewCount * 10;
  const level = Math.max(1, Math.floor(funPoints / 60) + 1);
  const currentLevelBase = (level - 1) * 60;
  const levelProgress = Math.min(100, ((funPoints - currentLevelBase) / 60) * 100);
  const activeGuardrails = state.settings.guardrails.filter(g => g.enabled).length;

  const quests = useMemo(() => [
    { title: "Micro-Celebration", detail: "Do a 20-second victory dance after you finish this session." },
    { title: "Gratitude Ping", detail: "Text someone thanks for being in your corner today." },
    { title: "Movement Break", detail: "One-minute stretch or 10 jumping jacks to reset your body." },
    { title: "Worship Burst", detail: "Play your favorite worship song and hum along for 60 seconds." },
    { title: "Nature Glance", detail: "Look out a window and name three things you notice." },
    { title: "Art Spark", detail: "Sketch a quick doodle of how freedom feels right now." },
  ], []);

  const dayOfMonth = new Date().getDate();
  const questOfDay = quests[(dayOfMonth - 1) % quests.length];

  useEffect(() => {
    if (isDailyComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [isDailyComplete]);

  const confettiPieces = useMemo(
    () => Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      rotation: Math.random() * 180 - 90,
      fallDistance: 140 + Math.random() * 60,
      color: ['#7dd3fc', '#fcd34d', '#a78bfa', '#34d399'][i % 4],
    })),
    []
  );

  return (
    <PageShell className="pb-24">
      {/* Header Greeting */}
      <div className="mb-6 mt-2">
        <h2 className="text-muted-foreground font-medium text-sm mb-1">
          {format(new Date(), 'EEEE, MMMM do')}
        </h2>
        <h1 className="text-3xl font-bold font-display text-foreground tracking-tight">
          Welcome back.
        </h1>
      </div>

      <div className="space-y-6">
        {/* Fun Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-400 to-amber-300 text-white p-6 shadow-xl shadow-primary/30 border border-white/10">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#fff,_transparent_40%)]" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/80 text-xs uppercase font-bold tracking-[0.08em]">
                <Sparkles className="w-4 h-4" /> Joy Meter
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-4xl font-black font-display leading-none drop-shadow">Level {level}</span>
                <span className="text-sm bg-white/15 px-2 py-1 rounded-full backdrop-blur">{funPoints} pts</span>
              </div>
              <p className="text-white/80 mt-1 text-sm max-w-sm">
                Your wins fuel this adventure. Keep stacking the little victories.
              </p>
            </div>
            <div className="text-5xl">🎉</div>
          </div>
          
          <div className="mt-4 h-3 rounded-full bg-white/20 overflow-hidden backdrop-blur">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="h-full bg-white/80"
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/80 mt-2">
            <span>Next level at {currentLevelBase + 60} pts</span>
            <span>{daysClean} day streak · {state.logs.length} logs · {reviewCount} reviews</span>
          </div>

          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none">
              {confettiPieces.map(piece => (
                <motion.span
                  key={piece.id}
                  className="absolute w-1.5 h-3 rounded-sm"
                  style={{ left: `${piece.left}%`, top: '-10px', backgroundColor: piece.color }}
                  initial={{ opacity: 0, y: 0, rotate: 0 }}
                  animate={{ opacity: 1, y: piece.fallDistance, rotate: piece.rotation }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, delay: piece.delay, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-[1.6fr,1fr]">
          <div className="space-y-6">
            {/* Quick Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/review">
                <div className="w-full h-full rounded-2xl border border-primary/30 bg-primary/5 p-4 flex flex-col gap-2 hover:shadow-lg hover:shadow-primary/10 transition-all">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ClipboardCheck className="w-4 h-4" /> Weekly review
                  </div>
                  <p className="text-sm text-muted-foreground">Name your wins and patterns this week.</p>
                  <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                    <span>Open</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>

              <Link href="/settings">
                <div className="w-full h-full rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    Add your ally’s phone
                  </div>
                  <p className="text-sm text-muted-foreground">Enable one-tap SOS texting.</p>
                  <div className="text-xs text-muted-foreground">
                    {state.settings.accountabilityPhone ? `Current: ${state.settings.accountabilityPhone}` : 'Not set'}
                  </div>
                </div>
              </Link>
            </div>

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

            {/* Daily Quest */}
            <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
                ✨
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-bold tracking-[0.08em]">
                  Mini Quest of the Day
                </div>
                <h3 className="text-lg font-display font-bold">{questOfDay.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{questOfDay.detail}</p>
              </div>
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

            {/* Grace note */}
            <div className="bg-secondary/40 border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Heart className="w-4 h-4 text-primary" />
                Grace note
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Progress is a path, not a verdict. Jesus walks it with you.
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                Current streak: <span className="font-bold text-foreground">{daysClean} days</span>
              </div>
            </div>

            {/* Accountability */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Accountability
              </div>
              <p className="text-sm text-muted-foreground">Set your partner’s name and phone for quick contact.</p>
              <div className="text-sm">
                <span className="font-semibold">{state.settings.accountabilityName || "Ally"}</span>
                {state.settings.accountabilityPhone ? ` • ${state.settings.accountabilityPhone}` : ' • Phone not set'}
              </div>
              <Link href="/settings" className="text-sm text-primary font-semibold">Update</Link>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-4">
            <div className="bg-secondary/40 border border-border/60 rounded-2xl p-4 space-y-3">
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-[0.08em]">Checkpoints</p>
              <Link href="/review">
                <div className="bg-background border border-border rounded-xl p-3 flex items-center justify-between hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-bold">Weekly Review</p>
                      <p className="text-xs text-muted-foreground">Reflect on wins + patterns</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link href="/settings">
                <div className="bg-background border border-border rounded-xl p-3 flex items-center justify-between hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-bold">Settings</p>
                      <p className="text-xs text-muted-foreground">Theme, guardrails, contacts</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Accountability & guardrails
              </div>
              <p className="text-xs text-muted-foreground">
                {activeGuardrails} guardrails active
              </p>
              <p className="text-xs text-muted-foreground">
                Contact: {state.settings.accountabilityName || 'Ally'} {state.settings.accountabilityPhone ? `• ${state.settings.accountabilityPhone}` : '• Not set'}
              </p>
              <Link href="/settings" className="text-sm text-primary font-semibold">Edit guardrails</Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                Resources
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Scripture + worship links</li>
                <li>Grace-based tools</li>
                <li>Marriage growth prompts</li>
              </ul>
              <Link href="/settings" className="text-sm text-primary font-semibold">Open resources</Link>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <SunMoon className="w-4 h-4 text-primary" />
                  Appearance & theme
                </div>
                <p className="text-xs text-muted-foreground">Light, dark, or follow system.</p>
              </div>
              <Link href="/settings" className="text-sm text-primary font-semibold">Change</Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

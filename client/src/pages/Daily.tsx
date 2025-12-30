import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { identityStatements } from "@/content/identityStatements";
import { verses } from "@/content/verses";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function Daily() {
  const { state, dispatch } = useAppState();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState("");
  
  const todayISO = format(new Date(), 'yyyy-MM-dd');
  const dayOfMonth = new Date().getDate();
  
  // Deterministic rotation based on day of month
  const identity = identityStatements[(dayOfMonth - 1) % identityStatements.length];
  const verse = verses[(dayOfMonth - 1) % verses.length];

  const handleComplete = () => {
    dispatch({
      type: 'COMPLETE_DAILY',
      payload: {
        dateISO: todayISO,
        completed: true,
        notes,
        verseId: verse.id,
        identityId: identity.id
      }
    });
    setLocation('/');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 }
  };

  return (
    <PageShell showBack title="Daily with Jesus">
      <div className="flex flex-col h-full justify-between py-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" {...fadeInUp} className="flex flex-col items-center text-center space-y-8 mt-10">
              <h2 className="text-2xl font-display font-medium text-foreground/80">
                Be still and know.
              </h2>
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 rounded-full bg-primary/20 blur-xl" />
              </div>
              <p className="text-muted-foreground max-w-xs">
                Take 3 deep breaths. Put aside the noise. You are entering the presence of the One who loves you most.
              </p>
              <button 
                onClick={() => setStep(1)}
                className="w-full max-w-xs bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:opacity-90 transition-opacity mt-auto"
              >
                I'm Ready
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" {...fadeInUp} className="space-y-8">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Check className="w-24 h-24" />
                </div>
                <span className="text-xs font-bold tracking-wider text-primary uppercase mb-2 block">Who I am</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                  {identity.text}
                </h2>
              </div>
              
              <div className="bg-secondary/30 rounded-2xl p-6 border border-transparent">
                <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-2 block">Truth for Today</span>
                <p className="text-lg font-serif italic text-foreground/80 mb-4">
                  "{verse.text}"
                </p>
                <p className="text-sm font-bold text-primary text-right">— {verse.reference}</p>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:bg-foreground/90 transition-colors"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...fadeInUp} className="flex flex-col h-full">
              <div className="space-y-4 mb-6">
                <h2 className="text-2xl font-display font-bold">What do you need from Jesus today?</h2>
                <p className="text-muted-foreground">
                  Strength? Patience? Wisdom? Just to be held? Ask Him now.
                </p>
              </div>
              
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Lord, today I need..."
                className="flex-1 w-full bg-card border border-border rounded-xl p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 mb-6"
              />
              
              <button 
                onClick={handleComplete}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:translate-y-[-2px] transition-all"
              >
                Amen. Let's go.
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.08em] font-bold text-muted-foreground mb-2">Habit stacks</p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="font-semibold text-foreground">Morning</p>
              <p>After alarm → Psalm/prayer (2 min) → water → 5–10 min movement.</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="font-semibold text-foreground">Lunch</p>
              <p>After eating → Scripture/devotional → 5 min deep breathing → reward with coffee/tea.</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="font-semibold text-foreground">Evening</p>
              <p>After kids in bed → connect with Kristy (talk/cuddle highs/lows) → gratitude journal → light reading. No screens in bed.</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="font-semibold text-foreground">Shower trigger</p>
              <p>Music/podcast on → phone stays outside → 30s cold finish.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

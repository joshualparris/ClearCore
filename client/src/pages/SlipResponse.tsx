import { useState } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { HeartHandshake, BookOpen, UserPlus, CheckCircle2 } from "lucide-react";

export default function SlipResponse() {
  const { dispatch, state } = useAppState();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  
  // Form State
  const [confession, setConfession] = useState("");
  const [receivedGrace, setReceivedGrace] = useState(false);
  const [lesson, setLesson] = useState("");
  const [repair, setRepair] = useState("");

  const handleFinish = () => {
    dispatch({
      type: 'SAVE_SLIP_RESPONSE',
      payload: {
        slipTimestampISO: state.lastSlipAtISO || new Date().toISOString(),
        confessionNote: confession,
        graceReceived: receivedGrace,
        lessonLearned: lesson,
        repairAction: repair,
        accountabilityContacted: false // Simplified for now
      }
    });
    setLocation('/');
  };

  const steps = [
    {
      title: "Pause & Breathe",
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
            <HeartHandshake className="w-10 h-10" />
          </div>
          <p className="text-lg font-medium">
            "There is now no condemnation for those who are in Christ Jesus."
            <br/><span className="text-sm text-muted-foreground font-normal">- Romans 8:1</span>
          </p>
          <p className="text-muted-foreground">
            Shame says "I am bad." God says "You are loved, let's fix this."
            <br/>Take a moment. You are safe here.
          </p>
        </div>
      )
    },
    {
      title: "Honest Confession",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">What happened? Bring it into the light.</p>
          <textarea
            value={confession}
            onChange={e => setConfession(e.target.value)}
            className="w-full h-40 bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Lord, I messed up..."
          />
        </div>
      )
    },
    {
      title: "Receive Grace",
      content: (
        <div className="space-y-6 text-center">
           <div className="p-6 bg-secondary/30 rounded-2xl italic font-serif">
            "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness."
            <div className="text-right text-sm font-bold not-italic mt-2 text-primary">- 1 John 1:9</div>
           </div>
           
           <button
             onClick={() => setReceivedGrace(!receivedGrace)}
             className={cn(
               "w-full p-4 rounded-xl border-2 flex items-center justify-center gap-3 transition-all",
               receivedGrace 
                 ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                 : "border-border hover:border-primary/50"
             )}
           >
             <CheckCircle2 className={cn("w-6 h-6", receivedGrace ? "opacity-100" : "opacity-30")} />
             <span className="font-bold">I accept God's forgiveness</span>
           </button>
        </div>
      )
    },
    {
      title: "Learn & Repair",
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">What triggered this?</label>
            <input 
              value={lesson}
              onChange={e => setLesson(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3" 
              placeholder="e.g. I was lonely and tired..."
            />
          </div>
          <div>
            <label className="text-sm font-bold text-muted-foreground block mb-2">One repair action for next time:</label>
            <input 
              value={repair}
              onChange={e => setRepair(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3" 
              placeholder="e.g. Put phone in kitchen at 9pm"
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <PageShell title="Recovery & Grace">
      <div className="flex flex-col h-full py-4">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-secondary")} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-2xl font-bold font-display mb-6">{steps[step].title}</h2>
            {steps[step].content}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-border flex gap-4">
          {step > 0 && (
            <button 
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1);
              else handleFinish();
            }}
            disabled={step === 2 && !receivedGrace}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {step === steps.length - 1 ? "Complete Recovery" : "Next Step"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

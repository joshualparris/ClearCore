import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PageShell } from "@/components/PageShell";
import { BreathingCircle } from "@/components/BreathingCircle";
import { useAppState } from "@/state/AppStateProvider";
import { responseActions } from "@/content/responseActions";
import { verses } from "@/content/verses";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SOS() {
  const { state, dispatch } = useAppState();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'initial' | 'breathing' | 'actions' | 'safe'>('initial');
  
  // Random encouraging verse
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  
  const handleSafe = (actionId?: string) => {
    dispatch({
      type: 'ADD_LOG_ENTRY',
      payload: {
        halt: { hungry: false, angry: false, lonely: false, tired: false }, // Default
        urgeStrength: 5,
        triggerNote: "SOS Activation",
        chosenResponse: actionId 
          ? responseActions.find(a => a.id === actionId)! 
          : responseActions[0],
        outcome: "win"
      }
    });
    setMode('safe');
    setTimeout(() => setLocation('/'), 2000);
  };

  const handleSlip = () => {
    dispatch({
      type: 'MARK_SLIP',
      payload: { timestampISO: new Date().toISOString() }
    });
    setLocation('/slip-response');
  };

  const accountabilityLink = state.settings.accountabilityPhone 
    ? `sms:${state.settings.accountabilityPhone}?body=Hey, I'm struggling right now. Can you pray for me?`
    : null;

  return (
    <PageShell 
      showBack={mode === 'initial'} 
      className={cn(
        "transition-colors duration-1000",
        mode !== 'initial' && "bg-slate-950 text-white"
      )}
    >
      <AnimatePresence mode="wait">
        {mode === 'initial' && (
          <motion.div 
            key="initial"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold font-display">It's okay.</h1>
              <p className="text-muted-foreground">You are not your urges. You have a choice.</p>
            </div>
            
            <button
              onClick={() => setMode('breathing')}
              className="w-48 h-48 rounded-full bg-destructive text-destructive-foreground text-2xl font-bold shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] hover:scale-105 transition-all duration-300 animate-pulse"
            >
              HELP ME
            </button>
            
            <p className="text-sm text-muted-foreground">Tap to activate SOS mode</p>
          </motion.div>
        )}

        {mode === 'breathing' && (
          <motion.div 
            key="breathing"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col h-full justify-between py-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-display font-medium text-white/90">Just breathe.</h2>
              <p className="text-white/60 mt-2">This urge will pass. Ride the wave.</p>
            </div>
            
            <BreathingCircle durationSeconds={60} />
            
            <div className="space-y-3">
              <p className="text-center text-white/80 italic font-serif px-6">
                "{randomVerse.text}"
              </p>
              <button 
                onClick={() => setMode('actions')}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold backdrop-blur-md border border-white/10 transition-colors"
              >
                I'm ready for next steps
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'actions' && (
          <motion.div 
            key="actions"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Do one thing.</h2>
              <p className="text-white/60">Don't fight the urge directly. Displace it.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[50vh]">
              {responseActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleSafe(action.id)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl text-left transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-white">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white" />
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
              {accountabilityLink && (
                <a 
                  href={accountabilityLink}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  <Phone className="w-4 h-4" /> Text {state.settings.accountabilityName || "Ally"}
                </a>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleSafe()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> I'm Safe
                </button>
                <button 
                  onClick={handleSlip}
                  className="px-6 bg-transparent hover:bg-white/5 text-white/40 hover:text-white/60 py-3 rounded-xl font-medium transition-colors text-sm"
                >
                  I Slipped
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'safe' && (
          <motion.div 
            key="safe"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white">Victory!</h2>
            <p className="text-white/70">You fought for your freedom today.<br/>God is proud of you.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}

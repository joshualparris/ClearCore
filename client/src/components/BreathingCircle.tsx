import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function BreathingCircle({ durationSeconds = 60 }: { durationSeconds?: number }) {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simple 4-4-4 breathing rhythm
    const cycle = setInterval(() => {
      setPhase(p => {
        if (p === 'Inhale') return 'Hold';
        if (p === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: phase === 'Inhale' ? 1.2 : 0.8,
          opacity: phase === 'Inhale' ? 0.6 : 0.2,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      />
      
      {/* Breathing Circle */}
      <motion.div
        className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center backdrop-blur-sm shadow-xl shadow-primary/10 relative z-10"
        animate={{
          scale: phase === 'Inhale' ? 1.3 : 1,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        <div className="text-center">
          <motion.div 
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-2xl font-bold text-primary font-display"
          >
            {phase}
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground mt-1 font-mono">
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

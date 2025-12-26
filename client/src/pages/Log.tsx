import { useState } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { responseActions } from "@/content/responseActions";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

export default function Log() {
  const { dispatch } = useAppState();
  const [, setLocation] = useLocation();

  const [halt, setHalt] = useState({
    hungry: false,
    angry: false,
    lonely: false,
    tired: false
  });
  const [urge, setUrge] = useState([3]);
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState(responseActions[0].id);
  const [outcome, setOutcome] = useState<"win" | "slip" | "neutral">("win");

  const handleSubmit = () => {
    const chosenAction = responseActions.find(a => a.id === actionId)!;
    
    dispatch({
      type: 'ADD_LOG_ENTRY',
      payload: {
        halt,
        urgeStrength: urge[0],
        triggerNote: note,
        chosenResponse: chosenAction,
        outcome
      }
    });

    if (outcome === 'slip') {
      dispatch({
        type: 'MARK_SLIP',
        payload: { timestampISO: new Date().toISOString() }
      });
      setLocation('/slip-response');
    } else {
      setLocation('/');
    }
  };

  const toggleHalt = (key: keyof typeof halt) => {
    setHalt(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageShell showBack title="HALT Check-in">
      <div className="space-y-8 py-2">
        {/* HALT Grid */}
        <section>
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
            What's going on inside?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(halt).map(([key, value]) => (
              <button
                key={key}
                onClick={() => toggleHalt(key as any)}
                className={cn(
                  "p-4 rounded-xl border font-medium transition-all capitalize",
                  value 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25" 
                    : "bg-card border-border hover:border-primary/50 text-foreground"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </section>

        {/* Urge Strength */}
        <section>
          <div className="flex justify-between mb-4">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Urge Intensity
            </label>
            <span className="text-lg font-bold text-primary">{urge[0]}/5</span>
          </div>
          <Slider 
            value={urge} 
            onValueChange={setUrge} 
            max={5} 
            min={1} 
            step={1} 
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Just a thought</span>
            <span>Overwhelming</span>
          </div>
        </section>

        {/* Trigger Note */}
        <section>
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
            Trigger Context
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Scrolling social media late at night..."
            className="w-full bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </section>

        {/* Outcome */}
        <section>
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">
            Outcome
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setOutcome('win')}
              className={cn(
                "flex-1 py-3 rounded-xl border font-bold transition-all",
                outcome === 'win'
                  ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400"
                  : "bg-card border-border hover:bg-muted"
              )}
            >
              Win
            </button>
            <button
              onClick={() => setOutcome('neutral')}
              className={cn(
                "flex-1 py-3 rounded-xl border font-bold transition-all",
                outcome === 'neutral'
                  ? "bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                  : "bg-card border-border hover:bg-muted"
              )}
            >
              Neutral
            </button>
            <button
              onClick={() => setOutcome('slip')}
              className={cn(
                "flex-1 py-3 rounded-xl border font-bold transition-all",
                outcome === 'slip'
                  ? "bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400"
                  : "bg-card border-border hover:bg-muted"
              )}
            >
              Slip
            </button>
          </div>
        </section>

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
        >
          Save Entry
        </button>
      </div>
    </PageShell>
  );
}

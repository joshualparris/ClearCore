import { useState } from "react";
import { useLocation } from "wouter";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { format, startOfWeek } from "date-fns";

export default function Review() {
  const { dispatch } = useAppState();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  // Form State
  const [wins, setWins] = useState(["", "", ""]);
  const [patterns, setPatterns] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [focus, setFocus] = useState("");

  const weekISO = format(startOfWeek(new Date()), 'yyyy-\'W\'ww');

  const handleFinish = () => {
    dispatch({
      type: 'SAVE_REVIEW',
      payload: {
        weekISO,
        completedAtISO: new Date().toISOString(),
        wins: wins.filter(w => w.trim() !== ""),
        triggerPatterns: patterns,
        gratitude,
        nextWeekFocus: focus,
        guardrailsReviewed: true
      }
    });
    setLocation('/');
  };

  const steps = [
    {
      title: "Celebrate Wins",
      desc: "God is at work. Name 3 things that went well this week.",
      content: (
        <div className="space-y-4">
          {wins.map((w, i) => (
            <input
              key={i}
              value={w}
              onChange={e => {
                const newWins = [...wins];
                newWins[i] = e.target.value;
                setWins(newWins);
              }}
              className="w-full bg-card border border-border rounded-xl p-3"
              placeholder={`Win #${i + 1}`}
            />
          ))}
        </div>
      )
    },
    {
      title: "Notice Patterns",
      desc: "Without shame, look at the triggers. When were you most tempted?",
      content: (
        <textarea
          value={patterns}
          onChange={e => setPatterns(e.target.value)}
          className="w-full h-32 bg-card border border-border rounded-xl p-3"
          placeholder="I noticed that I struggled when..."
        />
      )
    },
    {
      title: "Gratitude",
      desc: "What are you thankful for? 'Give thanks in all circumstances.'",
      content: (
        <textarea
          value={gratitude}
          onChange={e => setGratitude(e.target.value)}
          className="w-full h-32 bg-card border border-border rounded-xl p-3"
          placeholder="I'm thankful for..."
        />
      )
    },
    {
      title: "Next Week's Focus",
      desc: "What is ONE thing you want to prioritize next week?",
      content: (
        <input
          value={focus}
          onChange={e => setFocus(e.target.value)}
          className="w-full bg-card border border-border rounded-xl p-3"
          placeholder="e.g. Morning prayer before phone"
        />
      )
    }
  ];

  return (
    <PageShell title="Weekly Review" showBack>
      <div className="flex flex-col h-full py-4 space-y-6">
        <div>
           <div className="text-sm font-bold text-primary mb-2">Step {step + 1} of {steps.length}</div>
           <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-300"
               style={{ width: `${((step + 1) / steps.length) * 100}%` }}
             />
           </div>
        </div>

        <div>
            <h2 className="text-2xl font-bold font-display mb-2">{steps[step].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[step].desc}</p>
            {steps[step].content}
        </div>

        <div className="mt-auto flex gap-4">
            <button
                onClick={() => {
                    if (step < steps.length - 1) setStep(s => s + 1);
                    else handleFinish();
                }}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:shadow-lg transition-all"
            >
                {step === steps.length - 1 ? "Finish Review" : "Next"}
            </button>
        </div>
      </div>
    </PageShell>
  );
}

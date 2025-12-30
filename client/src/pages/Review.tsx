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
  const [marriageNotesOpen, setMarriageNotesOpen] = useState(false);

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

        <div className="space-y-3">
          <button
            onClick={() => setMarriageNotesOpen(v => !v)}
            className="w-full bg-secondary/30 border border-border rounded-xl p-3 text-left flex justify-between items-center"
          >
            <div>
              <p className="font-bold">Marriage meeting &amp; affection plan</p>
              <p className="text-xs text-muted-foreground">10–20 min template + non-sexual affection baseline.</p>
            </div>
            <span className="text-xs text-muted-foreground">{marriageNotesOpen ? "Hide" : "Show"}</span>
          </button>
          {marriageNotesOpen && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Weekly 20-min meeting</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>1 min: Centering breath + short prayer.</li>
                  <li>4 min: Gratitudes (2 each).</li>
                  <li>4 min: Logistics (kids, chores, money, calendars).</li>
                  <li>4 min: Support lane (one need, one boundary each).</li>
                  <li>4 min: Recovery status (GREEN/AMBER/RED). No interrogation.</li>
                  <li>2 min: Appreciation + prayer.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground">Non-sexual affection baseline</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Morning: 15s hug, neutral zones only.</li>
                  <li>Midday: Hand squeeze or 10s eye contact.</li>
                  <li>Evening: 5-min side-by-side sit; no escalation.</li>
                  <li>One act of service daily (quietly).</li>
                  <li>One 20–30 min micro-date weekly (walk/tea/chat).</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground">Conflict guardrail</p>
                <p>“No sexual soothing after conflict” — repair first; 12h calm before intimacy.</p>
              </div>
            </div>
          )}
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

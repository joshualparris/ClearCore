import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppState } from "@/state/AppStateProvider";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Monitor, Save } from "lucide-react";

export default function Settings() {
  const { state, dispatch } = useAppState();
  
  // Local state for form fields
  const [displayName, setDisplayName] = useState(state.settings.displayName || "");
  const [accName, setAccName] = useState(state.settings.accountabilityName || "");
  const [accPhone, setAccPhone] = useState(state.settings.accountabilityPhone || "");

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        displayName,
        accountabilityName: accName,
        accountabilityPhone: accPhone
      }
    });
  };

  const toggleGuardrail = (id: string, enabled: boolean) => {
    const updated = state.settings.guardrails.map(g => 
      g.id === id ? { ...g, enabled } : g
    );
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { guardrails: updated }
    });
  };

  return (
    <PageShell showBack title="Settings">
      <div className="space-y-8 py-2">
        
        {/* Profile */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Profile</h3>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Display Name</label>
            <input 
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-card border border-border rounded-xl p-3"
              placeholder="Your Name"
            />
          </div>
        </section>

        {/* Accountability */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Accountability Partner</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Partner Name</label>
              <input 
                value={accName}
                onChange={e => setAccName(e.target.value)}
                className="w-full bg-card border border-border rounded-xl p-3"
                placeholder="e.g. John"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
              <input 
                value={accPhone}
                onChange={e => setAccPhone(e.target.value)}
                className="w-full bg-card border border-border rounded-xl p-3"
                placeholder="+1..."
              />
              <p className="text-xs text-muted-foreground mt-1">Used for SOS quick-text feature.</p>
            </div>
          </div>
        </section>

        {/* Guardrails */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Guardrails</h3>
          <div className="space-y-3">
            {state.settings.guardrails.map(g => (
              <div key={g.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                <span className="font-medium">{g.title}</span>
                <Switch 
                  checked={g.enabled}
                  onCheckedChange={(checked) => toggleGuardrail(g.id, checked)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Theme */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Appearance</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { theme: t.id as any } })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  state.settings.theme === t.id 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold hover:bg-foreground/90 transition-colors sticky bottom-4 shadow-xl"
        >
          <Save className="w-5 h-5" /> Save Changes
        </button>

        <div className="pt-8 text-center">
            <button 
                onClick={() => {
                    if(confirm("Are you sure? This will delete all logs and settings.")) {
                        dispatch({ type: 'RESET_STATE' });
                    }
                }}
                className="text-red-500 text-sm font-medium hover:underline"
            >
                Reset App Data
            </button>
        </div>

      </div>
    </PageShell>
  );
}

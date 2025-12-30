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
  const [screenCap, setScreenCap] = useState<number>(state.settings.screenTimeCapMinutes ?? 120);
  const [noBedroom, setNoBedroom] = useState<boolean>(state.settings.noScreensInBedroom ?? true);
  const [noMeals, setNoMeals] = useState<boolean>(state.settings.noScreensAtMeals ?? true);
  const [dockTime, setDockTime] = useState<string>(state.settings.dockReminderTime || "20:00");
  const [hspQuiet, setHspQuiet] = useState<boolean>(state.settings.hspQuietMode ?? false);
  const [hspRecharge, setHspRecharge] = useState<boolean>(state.settings.hspRechargeReminder ?? false);
  const [hspSmallGroup, setHspSmallGroup] = useState<boolean>(state.settings.hspSmallGroupMode ?? false);

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        displayName,
        accountabilityName: accName,
        accountabilityPhone: accPhone,
        screenTimeCapMinutes: screenCap,
        noScreensInBedroom: noBedroom,
        noScreensAtMeals: noMeals,
        dockReminderTime: dockTime,
        hspQuietMode: hspQuiet,
        hspRechargeReminder: hspRecharge,
        hspSmallGroupMode: hspSmallGroup
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

        {/* Screen Time & Boundaries */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Screen time &amp; boundaries</h3>
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Daily screen-time cap</p>
                <p className="text-xs text-muted-foreground">Applies as a personal reminder; set what’s realistic.</p>
              </div>
              <span className="text-sm font-semibold">{screenCap} min</span>
            </div>
            <input 
              type="range" 
              min={30} 
              max={300} 
              step={15} 
              value={screenCap} 
              onChange={e => setScreenCap(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Devices stay in common spaces</p>
                <p className="text-xs text-muted-foreground">No phone in bedroom/bathroom; keep a nightstand alarm clock instead.</p>
              </div>
              <Switch checked={noBedroom} onCheckedChange={setNoBedroom} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">No screens at meals</p>
                <p className="text-xs text-muted-foreground">Protect table fellowship and connection time.</p>
              </div>
              <Switch checked={noMeals} onCheckedChange={setNoMeals} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Dock devices by</p>
                <p className="text-xs text-muted-foreground">Suggests a gentle reminder to plug in and power down.</p>
              </div>
              <input 
                type="time" 
                value={dockTime} 
                onChange={e => setDockTime(e.target.value)} 
                className="bg-background border border-border rounded-lg px-2 py-1 text-sm"
              />
            </div>
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

        {/* HSP accommodations */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">HSP accommodations</h3>
          <div className="space-y-3 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Quiet mode</p>
                <p className="text-xs text-muted-foreground">Reduce notifications/sounds; plan calm environments.</p>
              </div>
              <Switch checked={hspQuiet} onCheckedChange={setHspQuiet} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Recharge reminder</p>
                <p className="text-xs text-muted-foreground">After big social events, schedule decompression time.</p>
              </div>
              <Switch checked={hspRecharge} onCheckedChange={setHspRecharge} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Small-group mode</p>
                <p className="text-xs text-muted-foreground">Prefer smaller circles over large crowds.</p>
              </div>
              <Switch checked={hspSmallGroup} onCheckedChange={setHspSmallGroup} />
            </div>
          </div>
        </section>

        {/* Digital fortress */}
        <section className="space-y-3 bg-card border border-border rounded-xl p-4">
          <div>
            <p className="text-sm font-bold">Digital fortress</p>
            <p className="text-xs text-muted-foreground">Make access inconvenient and close soft loopholes.</p>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Router DNS: CleanBrowsing Family / OpenDNS FamilyShield; unique admin password.</li>
            <li>Remove alternate browsers; disable incognito/private modes; lock app store and VPN.</li>
            <li>Use non-admin desktop accounts; Screen Time / Family Link on mobile; consider whitelist mode during resets.</li>
            <li>Filter smart TVs too; grayscale after 9:30pm to reduce lure.</li>
            <li>Soft-erotica ban: treat “almost” content as off-limits; exit within 3 seconds.</li>
            <li>After slip/near-miss: add friction (mute term, block domain, raise filter) immediately.</li>
          </ul>
        </section>

        {/* SLAA Tuesday protocol */}
        <section className="space-y-3 bg-card border border-border rounded-xl p-4">
          <div>
            <p className="text-sm font-bold">SLAA Tuesday protocol</p>
            <p className="text-xs text-muted-foreground">Home group commitment, bookends, and outreach rhythm.</p>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Set Old Church on the Hill as home group; attend 12 consecutive Tuesdays.</li>
            <li>Pre-meeting: early dinner, Focus Mode on, devices docked; bring paper Bible/notebook.</li>
            <li>Bookend texts: “Heading in, focus honesty + service” at 7:30; takeaway + next action at 9:20.</li>
            <li>Sponsor by week 2; 3 outreach calls per week; service commitment by week 4.</li>
            <li>Post-meeting: drive straight home, no detours/screens; bed by 9:30.</li>
          </ul>
        </section>

        {/* Therapy & exposures */}
        <section className="space-y-3 bg-card border border-border rounded-xl p-4">
          <div>
            <p className="text-sm font-bold">Therapy & ERP</p>
            <p className="text-xs text-muted-foreground">Target list + exposure/response prevention with scrupulosity guardrails.</p>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Create 5–8 targets with SUDS, worst image, negative belief, body spot.</li>
            <li>ERP bridge: planned exposures to pre-porn cues (lonely shower, late phone) with strict response prevention.</li>
            <li>Guardrails: no graphic sexual detail; avoid moral scoring; skills over shame.</li>
            <li>Modality: CBT/ACT + ERP; consider EMDR/IFS for trauma targets with resourcing.</li>
          </ul>
        </section>

        {/* Work & feed hygiene */}
        <section className="space-y-3 bg-card border border-border rounded-xl p-4">
          <div>
            <p className="text-sm font-bold">Work & feed hygiene</p>
            <p className="text-xs text-muted-foreground">Cut distractions; add meaning breaks.</p>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Time-box work sprints with blockers during focus blocks.</li>
            <li>Lunch prayer walk 3×/week to reset; no doom-scroll.</li>
            <li>Unsubscribe/mute trigger feeds; move social apps off home screen; grayscale after 9:30pm.</li>
            <li>Plan one family/friends screen-free joy block weekly.</li>
          </ul>
        </section>

        {/* Bedtime guidance */}
        <section className="space-y-3 bg-card border border-border rounded-xl p-4">
          <div>
            <p className="text-sm font-bold">Bedtime guidance</p>
            <p className="text-xs text-muted-foreground">Aim 9pm–midnight, keep a pre-bed routine, consistent wake time.</p>
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>No screens in the last hour; dock devices at {dockTime || "20:00"}.</li>
            <li>Warm shower/stretch/prayer/reading to wind down.</li>
            <li>Charge devices outside the bedroom; use an alarm clock.</li>
            <li>Reward: enjoy a sunrise or quiet morning as a win.</li>
          </ul>
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

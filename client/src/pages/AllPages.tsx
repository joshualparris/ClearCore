import { Link } from "wouter";
import { PageShell } from "@/components/PageShell";

const pages = [
  ["Home", "/", "Main dashboard and daily overview."],
  ["Daily", "/daily", "Daily check-in and grounding practice."],
  ["SOS", "/sos", "Immediate support tools."],
  ["HALT Log", "/log", "Log triggers and check-ins."],
  ["Progress", "/progress", "Review progress and patterns."],
  ["Weekly Review", "/review", "Reflect on wins and patterns."],
  ["Slip Response", "/slip-response", "A direct recovery/reset path after a slip."],
  ["Settings", "/settings", "Theme, guardrails, contacts and resources."],
] as const;

export default function AllPages() {
  return (
    <PageShell title="All Pages" showBack layout="responsive">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-5">
          Every user-facing ClearCore screen is listed here so no tool is hidden behind a deep URL.
        </p>
        {pages.map(([label, href, description]) => (
          <Link key={href} href={href}>
            <div className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5">
              <div className="font-bold text-foreground">{label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{description}</div>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Recent Changes" };

const changeTypeConfig: Record<string, { label: string; icon: string; color: string }> = {
  LICENCE_GRANTED: { label: "Licence Granted", icon: "✅", color: "text-green-500" },
  LICENCE_SURRENDERED: { label: "Licence Surrendered", icon: "⛔", color: "text-slate-400" },
  LICENCE_REVOKED: { label: "Licence Revoked", icon: "🔴", color: "text-red-500" },
  LICENCE_SUSPENDED: { label: "Licence Suspended", icon: "⏸️", color: "text-orange-500" },
  ENFORCEMENT_ACTION: { label: "Enforcement Action", icon: "📋", color: "text-yellow-500" },
  REGULATION_UPDATE: { label: "Regulation Update", icon: "📜", color: "text-blue-400" },
};

const mockChanges = [
  { id: 1, type: "ENFORCEMENT_ACTION", regulator: "UKGC", flag: "🇬🇧", operator: "Stake.com", description: "Ordered to exit UK market", date: "Mar 2025" },
  { id: 2, type: "REGULATION_UPDATE", regulator: "CGA", flag: "🇨🇼", operator: null, description: "New LOK ordinance in force — master licences abolished", date: "Dec 2024" },
  { id: 3, type: "LICENCE_GRANTED", regulator: "TGC", flag: "🇨🇦", operator: "New Applicant", description: "New licence granted by Tobique Gaming Commission", date: "Dec 2024" },
  { id: 4, type: "REGULATION_UPDATE", regulator: "GSC", flag: "🇮🇲", operator: null, description: "National Risk Appetite Statement published", date: "May 2025" },
  { id: 5, type: "ENFORCEMENT_ACTION", regulator: "UKGC", flag: "🇬🇧", operator: "Multiple operators", description: "13 operators subject to regulatory action for compliance failings", date: "Dec 2025" },
];

export default function ChangesPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Recent Changes</h1>
        <p className="text-muted-foreground max-w-2xl">
          Live feed of licence grants, surrenders, revocations, suspensions, enforcement actions, and regulatory updates across all tracked jurisdictions.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(changeTypeConfig).map(([key, val]) => (
          <button key={key} className="inline-flex items-center gap-1.5 text-xs rounded-full border border-border px-3 py-1.5 hover:bg-muted transition-colors">
            {val.icon} {val.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {mockChanges.map((change) => {
          const config = changeTypeConfig[change.type];
          return (
            <Card key={change.id} className="border-border/60">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <span className="text-xl w-8 text-center shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{change.flag} {change.regulator}</span>
                      {change.operator && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs font-medium">{change.operator}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{change.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{change.date}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="font-semibold mb-2">Live change detection launching soon</h3>
        <p className="text-sm text-muted-foreground">Automated nightly scraping with real-time alerts via email, webhook, and RSS.</p>
      </div>
    </div>
  );
}

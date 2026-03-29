import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Enforcement Tracker" };

const mockActions = [
  { id: 1, regulator: "UKGC", operator: "Stake.com", type: "Exit Order", description: "Ordered to exit UK market following probe into advertising and compliance practices.", penalty: "—", date: "March 2025", breach: ["advertising", "compliance"], flag: "🇬🇧" },
  { id: 2, regulator: "UKGC", operator: "Multiple Operators (×13)", type: "Regulatory Action", description: "13 operators subject to regulatory action for compliance failings between May–December 2025.", penalty: "Various", date: "Dec 2025", breach: ["AML", "social-responsibility"], flag: "🇬🇧" },
  { id: 3, regulator: "Connecticut DCP", operator: "Sweepstakes Operator", type: "Settlement", description: "Settlement reached for unlicensed sweepstakes casino games.", penalty: "$1.5m", date: "May 2025", breach: ["unlicensed"], flag: "🇺🇸" },
  { id: 4, regulator: "FinCEN", operator: "10 Mexican Establishments", type: "Designation", description: "Designated as primary money laundering concern.", penalty: "—", date: "Nov 2025", breach: ["AML"], flag: "🇺🇸" },
];

const breachColors: Record<string, string> = {
  "AML": "bg-red-500/10 text-red-400 border-red-500/20",
  "social-responsibility": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "advertising": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "compliance": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "unlicensed": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function EnforcementPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Enforcement Tracker</h1>
          <p className="text-muted-foreground max-w-2xl">
            Every fine, revocation, suspension, and regulatory warning across all major jurisdictions. Aggregated from official regulator sources.
          </p>
        </div>
        <Badge variant="secondary" className="mt-1">Live data coming soon</Badge>
      </div>

      <div className="space-y-4">
        {mockActions.map((action) => (
          <Card key={action.id} className="border-border/60">
            <CardContent className="pt-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-lg">{action.flag}</span>
                    <span className="font-semibold">{action.operator}</span>
                    <Badge variant="outline" className="text-xs">{action.regulator}</Badge>
                    <Badge variant="secondary" className="text-xs">{action.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {action.breach.map((b) => (
                      <span key={b} className={`text-xs px-2 py-0.5 rounded-full border ${breachColors[b] || "bg-muted text-muted-foreground"}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold">{action.penalty}</div>
                  <div className="text-xs text-muted-foreground">{action.date}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="font-semibold mb-2">Full enforcement database launching soon</h3>
        <p className="text-sm text-muted-foreground">Live scraping from UKGC, MGA, GSC, GRA, AGCC, and CGA enforcement registers.</p>
      </div>
    </div>
  );
}

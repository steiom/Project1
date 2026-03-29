import { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { jurisdictions } from "@/lib/data/jurisdictions";
import { AlertTriangle, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Jurisdictions",
  description: "All online gambling licensing jurisdictions — Tier 1 through Tier 3, with costs, requirements, and live data.",
};

const tierInfo = {
  1: {
    label: "Tier 1 — Premium / EU-Aligned",
    description: "The world's most respected gambling regulators. Highest compliance cost, highest market credibility.",
    color: "text-amber-500",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
  },
  2: {
    label: "Tier 2 — Established / Mid-Market",
    description: "Long-established regulators offering a balance between cost and credibility.",
    color: "text-blue-500",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
  },
  3: {
    label: "Tier 3 — Emerging / Cost-Efficient",
    description: "Newer or lower-cost jurisdictions. Variable credibility — review status badges carefully.",
    color: "text-slate-400",
    borderColor: "border-slate-500/20",
    bgColor: "bg-slate-500/5",
  },
};

export default function JurisdictionsPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Jurisdictions</h1>
        <p className="text-muted-foreground max-w-2xl">
          All major online gambling licensing jurisdictions, tiered by regulatory prestige and market recognition. Data updated nightly from official regulator sources.
        </p>
      </div>

      {([1, 2, 3] as const).map((tier) => {
        const info = tierInfo[tier];
        const items = jurisdictions.filter((j) => j.tier === tier);
        return (
          <div key={tier} className="mb-14">
            <div className={`rounded-lg border ${info.borderColor} ${info.bgColor} p-4 mb-6`}>
              <h2 className={`text-lg font-semibold ${info.color} mb-1`}>{info.label}</h2>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((j) => (
                <Link key={j.slug} href={`/jurisdictions/${j.slug}`}>
                  <Card className="border-border/60 hover:border-primary/40 hover:bg-muted/20 transition-all h-full">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{j.flagEmoji}</span>
                          <div>
                            <div className="font-semibold">{j.name}</div>
                            <div className="text-xs text-muted-foreground">{j.regulator}</div>
                          </div>
                        </div>
                        {j.status === "contested" && (
                          <Badge variant="destructive" className="text-xs shrink-0">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Contested
                          </Badge>
                        )}
                        {j.status === "monitoring" && (
                          <Badge variant="secondary" className="text-xs shrink-0">Monitoring</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{j.description}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Annual fee</span>
                          <div className="font-medium text-foreground">{j.annualFee}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processing</span>
                          <div className="font-medium text-foreground">{j.processingTime}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Validity</span>
                          <div className="font-medium text-foreground">{j.licenceValidity}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-xs text-primary">
                        View full profile <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

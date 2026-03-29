import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jurisdictions, getJurisdictionsByTier } from "@/lib/data/jurisdictions";
import { Shield, TrendingUp, Bell, Search, ChevronRight, AlertTriangle } from "lucide-react";

const tierLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Tier 1 — Premium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  2: { label: "Tier 2 — Established", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  3: { label: "Tier 3 — Emerging", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
};

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Active", variant: "outline" },
  monitoring: { label: "Monitoring", variant: "secondary" },
  contested: { label: "Contested", variant: "destructive" },
};

export default function HomePage() {
  const tier1 = getJurisdictionsByTier(1);
  const tier2 = getJurisdictionsByTier(2);
  const tier3 = getJurisdictionsByTier(3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-border/40 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-screen-xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-4 text-xs">
              Built by Dootech · Isle of Man Licensing Specialists
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              iGaming Regulatory
              <span className="text-primary"> Intelligence Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Live licence registers, enforcement tracker, AI-powered compliance helper, and PEP/sanctions screening — across every major gambling jurisdiction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/jurisdictions"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Explore Jurisdictions <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                Compliance Helper
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
            <span><strong className="text-foreground">{jurisdictions.length}</strong> jurisdictions tracked</span>
            <span><strong className="text-foreground">3</strong> regulatory tiers</span>
            <span><strong className="text-foreground">Live</strong> enforcement data</span>
            <span><strong className="text-foreground">AI-powered</strong> compliance Q&A</span>
            <span><strong className="text-foreground">PEP / Sanctions</strong> screening</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-screen-xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Live Licence Registers</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Scraped nightly from official regulator sources. Search any operator across all jurisdictions.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Enforcement Tracker</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Every fine, revocation, suspension, and warning across all regulators in one searchable feed.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <Bell className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Real-time alerts when licences are granted, surrendered, revoked, or suspended. Global or per-jurisdiction.
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Compliance Helper</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ask plain-English questions about any jurisdiction&apos;s regulations. Cited answers from primary legislation.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Jurisdictions */}
      <section className="container max-w-screen-xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Jurisdictions</h2>
          <Link href="/jurisdictions" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {[{ tier: 1, items: tier1 }, { tier: 2, items: tier2 }, { tier: 3, items: tier3 }].map(({ tier, items }) => (
          <div key={tier} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${tierLabels[tier].color}`}>
                {tierLabels[tier].label}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((j) => (
                <Link key={j.slug} href={`/jurisdictions/${j.slug}`}>
                  <Card className="border-border/60 hover:border-primary/40 hover:bg-muted/30 transition-all cursor-pointer h-full">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{j.flagEmoji}</span>
                          <div>
                            <div className="font-medium text-sm">{j.name}</div>
                            <div className="text-xs text-muted-foreground">{j.regulatorAbbr}</div>
                          </div>
                        </div>
                        {j.status !== "active" && (
                          <Badge variant={statusBadge[j.status].variant} className="text-xs shrink-0">
                            {j.status === "contested" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {statusBadge[j.status].label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{j.tagline}</p>
                      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        <span>{j.annualFee}</span>
                        <span>·</span>
                        <span>{j.processingTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

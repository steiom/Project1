import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getJurisdictionBySlug, jurisdictions } from "@/lib/data/jurisdictions";
import { AlertTriangle, CheckCircle, XCircle, ExternalLink, ChevronLeft } from "lucide-react";

export async function generateStaticParams() {
  return jurisdictions.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = getJurisdictionBySlug(slug);
  if (!j) return {};
  return {
    title: `${j.name} — ${j.regulatorAbbr}`,
    description: j.description,
  };
}

export default async function JurisdictionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = getJurisdictionBySlug(slug);
  if (!j) notFound();

  const tierLabel = { 1: "Tier 1 — Premium", 2: "Tier 2 — Established", 3: "Tier 3 — Emerging" }[j.tier];
  const tierColor = { 1: "text-amber-500", 2: "text-blue-500", 3: "text-slate-400" }[j.tier];

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-10">
      <Link href="/jurisdictions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> All Jurisdictions
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{j.flagEmoji}</span>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{j.name}</h1>
              {j.status === "contested" && (
                <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" /> Contested</Badge>
              )}
              {j.status === "monitoring" && (
                <Badge variant="secondary">Monitoring</Badge>
              )}
            </div>
            <div className="text-muted-foreground">{j.regulator} · <span className={`font-medium ${tierColor}`}>{tierLabel}</span></div>
          </div>
        </div>
        <div className="flex gap-3">
          {j.regulatorUrl && (
            <a href={j.regulatorUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors">
              Regulator Website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {j.licenceRegisterUrl && (
            <a href={j.licenceRegisterUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm bg-primary text-primary-foreground rounded-md px-3 py-2 hover:bg-primary/90 transition-colors">
              Licence Register <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {j.status === "contested" && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-destructive">Contested Jurisdiction:</strong> The legitimacy of licences issued by this jurisdiction is widely disputed within the industry. This profile is provided for informational purposes only. We strongly advise seeking independent legal advice before considering this jurisdiction.
          </div>
        </div>
      )}

      <p className="text-muted-foreground text-lg mb-8 max-w-3xl leading-relaxed">{j.description}</p>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Application Fee", value: j.applicationFee },
          { label: "Annual Fee", value: j.annualFee },
          { label: "Processing Time", value: j.processingTime },
          { label: "Licence Validity", value: j.licenceValidity },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="font-semibold text-sm">{stat.value || "—"}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Key Facts */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Key Facts</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {j.keyFacts.map((fact, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{fact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pros */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Pros</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {j.pros.map((pro, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{pro}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cons */}
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Cons</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {j.cons.map((con, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{con}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Restricted Markets */}
      {j.restrictedMarkets.length > 0 && (
        <Card className="border-border/60 mt-6">
          <CardHeader><CardTitle className="text-base">Restricted / Excluded Markets</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {j.restrictedMarkets.map((market, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{market}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-10" />

      {/* CTA */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold mb-1">Need expert guidance on {j.name} licensing?</h3>
          <p className="text-sm text-muted-foreground">Dootech specialises in Isle of Man licensing and advises on all major jurisdictions.</p>
        </div>
        <a href="https://dootech.im" target="_blank" rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Talk to Dootech <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

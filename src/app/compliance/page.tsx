import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search, Shield, FileText } from "lucide-react";

export const metadata: Metadata = { title: "Compliance Helper" };

export default function CompliancePage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold">Compliance Helper</h1>
          <Badge variant="secondary">Coming Soon</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Ask plain-English questions about any jurisdiction&apos;s regulations. Get cited answers from primary legislation — plus PEP, sanctions, and EDD screening.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
        <Card className="border-border/60">
          <CardHeader>
            <MessageSquare className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Regulatory Q&amp;A</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Ask any compliance question in plain English. The AI searches primary legislation, secondary regulations, codes of practice, and regulator guidance notes.</p>
            <p>Every answer includes direct citations — section numbers, document names, and links to source material.</p>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-foreground">Example queries:</p>
              {[
                "What are the AML record-keeping requirements under IoM GSC?",
                "Does the MGA require segregated player funds?",
                "What triggers a fit and proper assessment under UKGC rules?",
              ].map((q) => (
                <div key={q} className="text-xs bg-muted rounded-md px-3 py-2 text-muted-foreground">&quot;{q}&quot;</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <Search className="h-8 w-8 text-primary mb-2" />
            <CardTitle>PEP &amp; Sanctions Screening</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Instant checks against 75+ sanctions lists and 1M+ PEP profiles. Powered by ComplyAdvantage and Dow Jones Risk &amp; Compliance.</p>
            <div className="space-y-2 mt-2">
              {["Single entity check", "Batch upload (CSV)", "Adverse media scan", "Ongoing monitoring & alerts"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs">
                  <span className="text-green-500">✓</span> {f}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Enhanced Due Diligence</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Full EDD reports combining PEP/sanctions data, corporate registry information, adverse media summaries, and ultimate beneficial owner mapping. Suitable for regulatory submission.</p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Jurisdiction Comparison</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Tell us your business type, target markets, and budget. Get an AI-generated jurisdiction recommendation with side-by-side cost and compliance comparison.</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-3">Get Early Access</h3>
        <p className="text-muted-foreground mb-6">The Compliance Helper is in development. Register your interest and be first to know when it launches.</p>
        <a href="https://dootech.im/contact" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Register Interest →
        </a>
      </div>
    </div>
  );
}

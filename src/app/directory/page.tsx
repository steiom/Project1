import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Provider Directory" };

const categories = [
  { slug: "law-firm", label: "Law Firms", icon: "⚖️" },
  { slug: "compliance", label: "Compliance Consultants", icon: "🛡️" },
  { slug: "testing-lab", label: "Testing Laboratories", icon: "🔬" },
  { slug: "kyc-aml", label: "KYC / AML Providers", icon: "🔍" },
  { slug: "corporate", label: "Corporate Services", icon: "🏢" },
  { slug: "platform", label: "Platform / Tech Providers", icon: "💻" },
];

const featured = {
  name: "Dootech",
  category: "Compliance Consultants",
  description: "Isle of Man licensing specialists. Expert guidance on GSC applications, compliance programmes, and all major jurisdictions.",
  jurisdictions: ["Isle of Man", "Malta", "Gibraltar", "Alderney"],
  website: "https://dootech.im",
  featured: true,
};

export default function DirectoryPage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Provider Directory</h1>
        <p className="text-muted-foreground max-w-2xl">
          Find lawyers, compliance consultants, testing labs, KYC/AML providers, and corporate services specialists — searchable by jurisdiction and specialism.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {categories.map((cat) => (
          <button key={cat.slug} className="flex flex-col items-center gap-2 rounded-lg border border-border/60 p-4 hover:bg-muted/50 hover:border-primary/30 transition-all text-center">
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Featured: Dootech */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Featured</h2>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg">{featured.name}</span>
                  <Badge className="text-xs">Featured</Badge>
                  <Badge variant="outline" className="text-xs">{featured.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 max-w-xl">{featured.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {featured.jurisdictions.map((j) => (
                    <Badge key={j} variant="secondary" className="text-xs">{j}</Badge>
                  ))}
                </div>
              </div>
              <a href={featured.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shrink-0">
                Visit Dootech →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-border/60 p-8 text-center">
        <h3 className="font-semibold mb-2">List Your Business</h3>
        <p className="text-sm text-muted-foreground mb-4">Are you a law firm, compliance consultant, or service provider in the iGaming space? Get listed in the directory.</p>
        <a href="https://dootech.im/contact" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
          Request a Listing
        </a>
      </div>
    </div>
  );
}

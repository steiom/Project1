import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center mx-auto px-4">
        <div className="flex items-center gap-3 mr-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Dootech</span>
              <span className="text-muted-foreground font-light"> Licensing</span>
            </span>
          </Link>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">Beta</Badge>
        </div>
        <nav className="flex items-center gap-6 text-sm flex-1">
          <Link href="/jurisdictions" className="text-muted-foreground hover:text-foreground transition-colors">
            Jurisdictions
          </Link>
          <Link href="/enforcement" className="text-muted-foreground hover:text-foreground transition-colors">
            Enforcement
          </Link>
          <Link href="/changes" className="text-muted-foreground hover:text-foreground transition-colors">
            Recent Changes
          </Link>
          <Link href="/compliance" className="text-muted-foreground hover:text-foreground transition-colors">
            Compliance Helper
          </Link>
          <Link href="/directory" className="text-muted-foreground hover:text-foreground transition-colors">
            Directory
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/compliance"
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            PEP / Sanctions Check
          </Link>
        </div>
      </div>
    </header>
  );
}

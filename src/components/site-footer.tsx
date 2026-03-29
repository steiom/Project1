import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold mb-3">Dootech Licensing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Authoritative iGaming regulatory intelligence. Built by{" "}
              <a href="https://dootech.im" className="underline hover:text-foreground">Dootech</a>,
              Isle of Man licensing specialists.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Data</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/jurisdictions" className="hover:text-foreground">Jurisdictions</Link></li>
              <li><Link href="/enforcement" className="hover:text-foreground">Enforcement Tracker</Link></li>
              <li><Link href="/changes" className="hover:text-foreground">Recent Changes</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Tools</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/compliance" className="hover:text-foreground">Compliance Helper</Link></li>
              <li><Link href="/compliance/pep-check" className="hover:text-foreground">PEP / Sanctions Check</Link></li>
              <li><Link href="/directory" className="hover:text-foreground">Provider Directory</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Dootech</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="https://dootech.im" className="hover:text-foreground">Main Site</a></li>
              <li><a href="https://dootech.im/contact" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dootech. For informational purposes only. Not legal advice.
          </p>
          <p className="text-xs text-muted-foreground">
            Data updated nightly from official regulator sources.
          </p>
        </div>
      </div>
    </footer>
  );
}

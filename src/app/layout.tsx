import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dootech Licensing Hub | iGaming Regulatory Intelligence",
    template: "%s | Dootech Licensing Hub",
  },
  description:
    "The definitive resource for online gambling licensing — live regulator data, enforcement tracker, compliance helper, and AI-powered search across all major jurisdictions.",
  keywords: ["igaming license", "gambling license", "Isle of Man GSC", "MGA", "UKGC", "online gambling regulation", "compliance"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-root min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="font-bold text-lg">
          EditDeckPro
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">
            <Button size="sm">Login</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="px-6 py-6 border-t text-sm text-muted-foreground flex justify-between">
        <span>&copy; {new Date().getFullYear()} EditDeckPro</span>
        <div className="flex gap-4">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileNav from "./_components/MobileNav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-root min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/marketing/editdeck-logo.png"
              alt="EditDeckPro"
              width={160}
              height={59}
              quality={95}
              priority
              className="h-12 md:h-[59px] w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://app.editdeckpro.com/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Login
            </a>
            <a href="https://edp-git-signup-flow-redesign-editdeckpro-7522s-projects.vercel.app/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white border-0 font-semibold"
              >
                Start Free Trial
              </Button>
            </a>
          </div>
          <MobileNav />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-[#0a0a0a] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <Link
                href="/"
                className="[font-family:var(--font-display)] text-2xl tracking-wider block mb-4"
              >
                EDITDECKPRO
              </Link>
              <p className="text-sm text-white/60 max-w-xs">
                Pro-quality album covers for independent artists, producers, and
                labels.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pricing" className="text-white/70 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
                Contact
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <a
                    href="mailto:support@editdeckpro.com"
                    className="hover:text-white transition-colors"
                  >
                    support@editdeckpro.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+12162006496"
                    className="hover:text-white transition-colors"
                  >
                    (216) 200-6496
                  </a>
                </li>
                <li>Cleveland, Ohio</li>
              </ul>
              <div className="mt-6 flex gap-4 text-sm text-white/50">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">TikTok</a>
                <a href="#" className="hover:text-white transition-colors">X</a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-xs text-white/40">
            © {new Date().getFullYear()} EditDeckPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

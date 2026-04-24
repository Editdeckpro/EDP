"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/30 bg-white/10 text-white shadow-sm transition-colors hover:bg-white/15 active:bg-white/20"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        aria-hidden="true"
        onClick={close}
        className={`md:hidden fixed inset-0 z-[60] bg-black/60 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`md:hidden fixed top-0 right-0 z-[70] flex h-full w-[80%] max-w-sm flex-col bg-[#0a0a0a] border-l border-white/10 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 py-4 border-b border-white/10">
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-3 font-[family-name:var(--font-display)] text-xl tracking-wide text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-white/10 pt-2">
              <a
                href="https://app.editdeckpro.com/login"
                onClick={close}
                className="block rounded-lg px-3 py-3 text-base text-white/65 hover:text-white hover:bg-white/5 transition-colors"
              >
                Login
              </a>
            </li>
          </ul>
        </nav>

        <div className="border-t border-white/10 px-6 pb-6 pt-4">
          <a
            href="https://app.editdeckpro.com/signup"
            onClick={close}
            className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            Start Free Trial
          </a>
        </div>
      </aside>
    </>
  );
}

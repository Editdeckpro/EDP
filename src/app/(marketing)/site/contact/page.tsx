"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${form.name}%0D%0AEmail: ${form.email}%0D%0A%0D%0A${form.message}`;
    const subject = form.subject || "EditDeckPro contact form";
    const mailto = `mailto:support@editdeckpro.com?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
    window.location.href = mailto;
    setSent(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.10),transparent_60%)]"
      />

      {/* Header */}
      <section className="relative mx-auto max-w-5xl px-6 pt-20 pb-10 md:pt-28">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-7xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Real humans in Cleveland, Ohio. We&apos;ll get back to you fast.
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
                We&apos;re here to help
              </h2>
              <p className="mt-2 text-white/65">
                Questions, feedback, feature requests. We read everything.
              </p>
            </div>

            <div className="space-y-5">
              <ContactItem
                icon={<Phone className="h-5 w-5" />}
                label="Call"
                value="(216) 200-6496"
                href="tel:2162006496"
              />
              <ContactItem
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value="support@editdeckpro.com"
                href="mailto:support@editdeckpro.com"
              />
              <ContactItem
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value="Cleveland, Ohio"
              />
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-medium text-white/65">Follow along</p>
              <div className="mt-3 flex items-center gap-3">
                <SocialLink
                  href="https://www.facebook.com/profile.php?id=61574905387740"
                  label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </SocialLink>
                <SocialLink href="https://x.com/EditDeckPro" label="X (Twitter)">
                  <XIcon />
                </SocialLink>
                <SocialLink
                  href="https://www.tiktok.com/@editdeckpro"
                  label="TikTok"
                >
                  <TikTokIcon />
                </SocialLink>
                <SocialLink
                  href="https://www.instagram.com/editdeckpro/"
                  label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </SocialLink>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-white/65">
              This will open your email app with your message pre-filled.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field
                label="Full name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Field
                label="Subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
              />

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-white/80"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/50 focus:bg-white/[0.07]"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Send message
              </button>

              {sent && (
                <p className="text-center text-sm text-white/65">
                  Your email app should have opened. If it didn&apos;t, email us
                  directly at{" "}
                  <a
                    href="mailto:support@editdeckpro.com"
                    className="text-amber-400 underline-offset-4 hover:underline"
                  >
                    support@editdeckpro.com
                  </a>
                  .
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-400">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-white/50">
          {label}
        </p>
        <p className="mt-0.5 text-base text-white/90">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block transition hover:opacity-80">
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-white/80"
      >
        {label}
        {required && <span className="ml-1 text-amber-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/50 focus:bg-white/[0.07]"
      />
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

// X (Twitter) icon — lucide doesn't have the new X logo
function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// TikTok icon — lucide doesn't have a TikTok icon
function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
    </svg>
  );
}

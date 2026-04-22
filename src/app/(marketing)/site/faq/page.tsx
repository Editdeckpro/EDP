import Link from "next/link";
import { ChevronDown } from "lucide-react";

type FAQ = {
  q: string;
  a: React.ReactNode;
};

const faqs: FAQ[] = [
  {
    q: "What is EditDeckPro?",
    a: (
      <p>
        EditDeckPro is an AI-powered platform that helps creators design
        professional-quality graphics for album covers, social media, Shopify
        stores, and more. No design skills required — just upload, describe,
        and let AI do the rest.
      </p>
    ),
  },
  {
    q: "Who is this platform for?",
    a: (
      <p>
        Our platform is designed for emerging artists, small business owners,
        and creators who need stunning visuals quickly and affordably. Whether
        you&apos;re an independent musician, an entrepreneur, or an influencer,
        we&apos;ve got you covered.
      </p>
    ),
  },
  {
    q: "How does it work?",
    a: (
      <>
        <p>It&apos;s simple:</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/80">
          <li>Upload your reference image or inspiration.</li>
          <li>
            Describe your vision (e.g., &ldquo;edgy, black-and-white album
            cover with bold text&rdquo;).
          </li>
          <li>Generate and download.</li>
        </ol>
      </>
    ),
  },
  {
    q: "What are the available subscription plans?",
    a: (
      <>
        <p>We offer three plans:</p>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-white/80">
          <li>
            <strong className="text-white">Starter ($27/month):</strong>{" "}
            Generate up to 5 cover designs per month, standard-resolution
            outputs, basic customization tools, full ownership of designs,
            mobile access, and email support.
          </li>
          <li>
            <strong className="text-white">
              Next Level ($67/month) — Most Popular:
            </strong>{" "}
            Unlimited AI-generated cover designs, high-resolution outputs,
            custom text tools, and priority email support (24-hour response
            time).
          </li>
          <li>
            <strong className="text-white">Pro Studio ($119/month):</strong>{" "}
            Team plan with up to 5 users, a centralized dashboard for managing
            projects and downloads, faster generation priority, team folders,
            and early access to new features.
          </li>
        </ol>
        <p className="mt-4 text-sm text-white/65">
          Save ~32% with yearly billing.{" "}
          <Link
            href="/pricing"
            className="text-amber-400 underline-offset-4 hover:underline"
          >
            See all pricing &rarr;
          </Link>
        </p>
      </>
    ),
  },
  {
    q: "Can I try the platform for free?",
    a: (
      <p>
        Yes — we currently offer a <strong className="text-white">3-day free trial</strong>.
        No credit card required to start.
      </p>
    ),
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: (
      <p>
        Absolutely. You can cancel your subscription anytime from your account
        dashboard, and you won&apos;t be billed for the next billing cycle.
      </p>
    ),
  },
  {
    q: "What file formats do the designs come in?",
    a: (
      <p>
        All designs are available in industry-standard formats such as PNG,
        JPG, and PDF. Pro plan users can also export in high-resolution formats
        ideal for print.
      </p>
    ),
  },
  {
    q: "What happens to my designs after my subscription ends?",
    a: (
      <p>
        You&apos;ll still have access to any designs you&apos;ve already
        downloaded. However, creating or editing new designs will require an
        active subscription.
      </p>
    ),
  },
  {
    q: "What if I need help using the platform?",
    a: (
      <p>
        Our support team is here for you. Reach out to us via email at{" "}
        <a
          href="mailto:support@editdeckpro.com"
          className="text-amber-400 underline-offset-4 hover:underline"
        >
          support@editdeckpro.com
        </a>
        . Pro plan users also get access to priority support.
      </p>
    ),
  },
  {
    q: "Can I request custom features or improvements?",
    a: (
      <p>
        Absolutely. We love hearing from our users. Send your suggestions to{" "}
        <a
          href="mailto:support@editdeckpro.com"
          className="text-amber-400 underline-offset-4 hover:underline"
        >
          support@editdeckpro.com
        </a>
        .
      </p>
    ),
  },
  {
    q: "Is my data secure?",
    a: (
      <p>
        Yes — we prioritize your privacy and security. All data is encrypted
        and stored securely. For more details, please review our{" "}
        <Link
          href="/privacy"
          className="text-amber-400 underline-offset-4 hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    q: "Who owns the rights to the designs I create?",
    a: (
      <p>
        You do. All designs generated on our platform are yours to use however
        you like.
      </p>
    ),
  },
];

export default function FAQPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.10),transparent_60%)]"
      />

      <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-10 md:pt-28">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-7xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Everything you need to know before you start. Can&apos;t find what
            you&apos;re looking for?{" "}
            <Link
              href="/contact"
              className="text-amber-400 underline-offset-4 hover:underline"
            >
              Ask us directly.
            </Link>
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-3xl px-6 pb-16">
        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="text-base font-medium text-white md:text-lg">
                  {item.q}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-white/50 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 text-white/80 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
          Still have questions?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          We&apos;re real humans in Cleveland, Ohio. Reach out and we&apos;ll
          get back fast.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            Contact us
          </Link>
          <a
            href="mailto:support@editdeckpro.com"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Email support
          </a>
        </div>
      </section>
    </main>
  );
}

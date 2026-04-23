import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — EditDeckPro",
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)]"
      />

      <section className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 md:pt-28">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Last updated: April 23, 2026
          </p>
        </div>

        <div className="mt-10 space-y-10 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              1. Overview
            </h2>
            <p className="mt-3">
              EditDeckPro (&ldquo;we,&rdquo; &ldquo;our,&rdquo;) respects your
              privacy. This policy explains what information we collect when
              you use our Services, how we use it, and your rights regarding
              that information. EditDeckPro is operated from Cleveland, Ohio,
              United States.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              2. Information We Collect
            </h2>
            <p className="mt-3 font-medium text-white">Information you provide:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Account information: name, email address, username, password (stored encrypted).</li>
              <li>Payment information: billing address and payment method details are collected and processed directly by Stripe — we do not store your full card number on our servers.</li>
              <li>Content you upload or generate, including prompts, reference images, and generated outputs.</li>
              <li>Communications you send to our support team.</li>
            </ul>

            <p className="mt-5 font-medium text-white">Information we collect automatically:</p>
            <ul className="mt-2 list-disc space-y-2 pl-6">
              <li>Device and connection information: IP address, browser type, operating system.</li>
              <li>Usage data: features used, pages visited, time spent, actions taken within the Services.</li>
              <li>Cookies and similar technologies (see Section 6).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              3. How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide, maintain, and improve the Services.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Send transactional emails (receipts, password resets, trial-ending notifications).</li>
              <li>Respond to support requests.</li>
              <li>Detect and prevent abuse, fraud, or violations of our Terms.</li>
              <li>Send occasional product updates or promotional emails (you can opt out at any time).</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              4. Third-Party Services
            </h2>
            <p className="mt-3">
              To deliver the Services, we share limited information with
              trusted third-party providers:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li><span className="font-medium text-white">Stripe</span> — payment processing.</li>
              <li><span className="font-medium text-white">SendGrid</span> — transactional email delivery.</li>
              <li><span className="font-medium text-white">AWS</span> — backend hosting and storage.</li>
              <li><span className="font-medium text-white">Vercel</span> — frontend hosting.</li>
              <li>
                <span className="font-medium text-white">OpenAI, Ideogram, Google Gemini</span>{" "}
                — AI image generation providers. When you generate content, your prompt and reference images may be sent to these providers. Where commercially possible, we do not permit them to use your content for their own model training.
              </li>
            </ul>
            <p className="mt-3">
              Each provider has their own privacy policy. We recommend
              reviewing them if you have concerns about how your data is
              handled downstream.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              5. Your Content and AI Generation
            </h2>
            <p className="mt-3">
              Content you upload (reference images, prompts) and content you
              generate is stored in our systems for the purpose of delivering
              the Services to you. We do not use your content to train our own
              AI models, and we do not share it publicly.
            </p>
            <p className="mt-3">
              Downloaded designs are yours to keep even after your
              subscription ends. Undownloaded designs may be deleted from our
              servers after a reasonable retention period following account
              closure.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              6. Cookies
            </h2>
            <p className="mt-3">
              We use cookies and similar technologies to keep you signed in,
              remember your preferences, and understand how the Services are
              used. You can control cookies through your browser settings —
              disabling them may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              7. Data Retention
            </h2>
            <p className="mt-3">
              We keep your account information as long as your account is
              active. After account closure, we retain limited information as
              required for legal, accounting, or dispute-resolution purposes.
              You may request deletion of your data at any time (see Section 9).
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              8. Security
            </h2>
            <p className="mt-3">
              We use industry-standard safeguards — encryption in transit
              (HTTPS), encrypted password storage, and access controls — to
              protect your information. No system is perfectly secure, however,
              and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              9. Your Rights
            </h2>
            <p className="mt-3">
              Depending on your location, you may have the right to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Access the personal information we hold about you.</li>
              <li>Correct inaccurate information.</li>
              <li>Request deletion of your information.</li>
              <li>Export your information in a portable format.</li>
              <li>Object to certain uses of your information.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a
                href="mailto:support@editdeckpro.com"
                className="text-amber-400 underline-offset-4 hover:underline"
              >
                support@editdeckpro.com
              </a>
              . California residents and users in the EU/EEA, UK, and similar
              jurisdictions have additional rights under applicable law
              (CCPA, GDPR).
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              10. Children
            </h2>
            <p className="mt-3">
              The Services are not intended for anyone under 18. We do not
              knowingly collect information from children. If you believe a
              child has provided us with information, contact us and we will
              delete it.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              11. International Users
            </h2>
            <p className="mt-3">
              EditDeckPro is based in the United States. By using the
              Services from outside the U.S., you consent to your information
              being transferred to and processed in the United States, which
              may have different data-protection laws than your country.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              12. Changes to This Policy
            </h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you via email or by posting a
              notice on the Services.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              13. Contact
            </h2>
            <p className="mt-3">
              Questions about this Privacy Policy or your data? Contact us at{" "}
              <a
                href="mailto:support@editdeckpro.com"
                className="text-amber-400 underline-offset-4 hover:underline"
              >
                support@editdeckpro.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50">
          <Link
            href="/terms"
            className="text-amber-400 underline-offset-4 hover:underline"
          >
            View our Terms of Service &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Terms of Service — EditDeckPro",
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)]"
      />

      <section className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 md:pt-28">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Last updated: April 23, 2026
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/75 leading-relaxed">
          Welcome to EditDeckPro. These Terms of Service (&ldquo;Terms&rdquo;)
          outline your rights and responsibilities when using EditDeckPro and
          its associated services. By accessing or using EditDeckPro, you agree
          to these Terms. If you do not agree, you may not use our services.
        </div>

        <div className="mt-10 space-y-10 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              1. Agreement Overview
            </h2>
            <p className="mt-3">
              These Terms form a binding agreement between you (&ldquo;User,&rdquo;
              &ldquo;Customer,&rdquo; &ldquo;You,&rdquo; or &ldquo;Your&rdquo;)
              and EditDeckPro (&ldquo;Company,&rdquo; &ldquo;We,&rdquo;
              &ldquo;Us,&rdquo; or &ldquo;Our&rdquo;). This agreement governs
              your use of our website, tools, templates, and all related
              services provided by EditDeckPro (collectively, the
              &ldquo;Services&rdquo;). EditDeckPro is operated from Cleveland,
              Ohio, United States.
            </p>
            <p className="mt-3">
              If you are entering into this agreement on behalf of an
              organization, you represent and warrant that you have the
              authority to bind the organization to these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              2. Eligibility
            </h2>
            <p className="mt-3">To use EditDeckPro, you must:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Be at least 18 years old, or the age of majority in your jurisdiction.</li>
              <li>Have the legal capacity to enter into binding agreements.</li>
              <li>Provide accurate and complete account information during registration.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              3. Account Registration and Security
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>You must create an account to access our Services.</li>
              <li>You are responsible for maintaining the security of your account and password.</li>
              <li>Notify us immediately of any unauthorized access to your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              4. Services Provided
            </h2>
            <p className="mt-3">
              <span className="font-medium text-white">Access.</span> We provide
              AI-powered tools to generate album covers, lyric videos, and
              related creative visuals, plus associated editing and
              customization features.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">License.</span> Subject
              to these Terms and your payment of applicable fees, we grant you
              a limited, non-exclusive, non-transferable license to use the
              Services for personal or commercial purposes.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Restrictions.</span> You
              may not sublicense, resell, or redistribute access to the
              Services without our prior written authorization.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              5. Free Trial and Billing
            </h2>
            <p className="mt-3">
              We offer a <span className="font-medium text-white">3-day free trial</span> on
              all paid plans. A valid payment method is required at signup. At
              the end of the 3-day trial period, your selected plan will be
              automatically charged to your payment method on file at the rate
              displayed at signup, and will continue to renew on a recurring
              basis (monthly or yearly, as selected) until cancelled.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Cancellation.</span> You
              may cancel your subscription at any time from your account
              dashboard. Cancellation takes effect at the end of your current
              billing period — you will not receive a prorated refund for
              unused time. Cancelling during the 3-day trial will prevent any
              charge.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Refunds.</span> All fees
              are <span className="font-medium text-white">non-refundable</span>
              {" "}except where required by law. The 3-day free trial is
              provided as your opportunity to evaluate the Service before being
              charged.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Payment processing.</span>
              {" "}Payments are processed by Stripe. By providing a payment
              method, you authorize us to charge that method for the fees
              associated with your plan.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Taxes.</span> You are
              responsible for any applicable taxes associated with your use of
              the Services.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Failure to pay.</span> We
              reserve the right to suspend or terminate access to paid Services
              if fees are not paid on time or a payment method fails.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              6. Acceptable Use
            </h2>
            <p className="mt-3">You agree not to use the Services to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Generate content that is illegal, infringes intellectual property, defames, harasses, or sexualizes minors.</li>
              <li>Impersonate any real person without authorization, including celebrities, public figures, or other artists.</li>
              <li>Reverse-engineer, decompile, scrape, or attempt to extract source code from our software.</li>
              <li>Share your account credentials with others or sell access to your account.</li>
              <li>Abuse, overload, or attempt to disrupt the Services or their underlying infrastructure.</li>
              <li>Use the Services to train competing AI models or datasets.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that
              violate these terms without refund.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              7. Ownership of Generated Content
            </h2>
            <p className="mt-3">
              <span className="font-medium text-white">Your content.</span> You
              retain ownership of content you generate using the Services
              (&ldquo;User Content&rdquo;), including album covers, lyric
              videos, and other visuals, to the fullest extent permitted by
              applicable law. You are free to use your generated content for
              any lawful purpose, commercial or non-commercial.
            </p>
            <p className="mt-3">
              You acknowledge that AI-generated content may not always be
              eligible for traditional copyright protection in all
              jurisdictions, and that similar outputs may be generated for
              other users using similar prompts. You are solely responsible for
              ensuring your use of generated content does not infringe the
              rights of others.
            </p>
            <p className="mt-3">
              You grant us a limited, non-exclusive license to store, process,
              and display your User Content solely for the purpose of
              providing the Services to you.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">Our content.</span> The
              Services themselves — including our interface, code, branding,
              templates, and non-user-generated assets — are the exclusive
              property of EditDeckPro and are protected by copyright and
              trademark law. You may not copy, modify, or create derivative
              works of the Services.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              8. Termination
            </h2>
            <p className="mt-3">
              <span className="font-medium text-white">By you.</span> You may
              terminate your account at any time through your account
              dashboard.
            </p>
            <p className="mt-3">
              <span className="font-medium text-white">By us.</span> We may
              suspend or terminate your account immediately, without notice,
              for violation of these Terms or applicable laws.
            </p>
            <p className="mt-3">
              Upon termination, your right to use the Services ends and any
              outstanding fees remain due. Content you have already downloaded
              remains yours to keep.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              9. Disclaimer of Warranties
            </h2>
            <p className="mt-3">
              The Services are provided &ldquo;as is&rdquo; and &ldquo;as
              available,&rdquo; without warranties of any kind, express or
              implied, including warranties of merchantability, fitness for a
              particular purpose, and non-infringement. We do not guarantee
              that the Services will be uninterrupted, error-free, or that
              generated content will meet your specific expectations.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              10. Limitation of Liability
            </h2>
            <p className="mt-3">
              To the fullest extent permitted by law, EditDeckPro and its
              owners, employees, and affiliates shall not be liable for any
              indirect, incidental, consequential, or punitive damages arising
              out of or related to your use of the Services. Our total
              liability to you for any claim shall not exceed the amount you
              paid us in the 12 months preceding the event giving rise to the
              claim.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              11. Indemnification
            </h2>
            <p className="mt-3">
              You agree to indemnify and hold harmless EditDeckPro, its
              affiliates, and employees from any claims, damages, and expenses
              (including reasonable attorneys&apos; fees) arising out of your
              use of the Services, your User Content, your violation of these
              Terms, or your infringement of the rights of others.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              12. Privacy
            </h2>
            <p className="mt-3">
              Your use of the Services is subject to our{" "}
              <Link
                href="/privacy"
                className="text-amber-400 underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              13. Changes to These Terms
            </h2>
            <p className="mt-3">
              We may update these Terms from time to time. If we make material
              changes, we will notify you via email or by posting a notice on
              the Services. Continued use of the Services after such notice
              constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              14. Governing Law
            </h2>
            <p className="mt-3">
              These Terms are governed by the laws of the State of Ohio, United
              States, without regard to its conflict of law provisions. Any
              dispute arising from these Terms shall be resolved exclusively in
              the state or federal courts located in Cuyahoga County, Ohio.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
              15. Contact
            </h2>
            <p className="mt-3">
              For questions or concerns regarding these Terms, contact us at{" "}
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
            href="/privacy"
            className="text-amber-400 underline-offset-4 hover:underline"
          >
            View our Privacy Policy &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}

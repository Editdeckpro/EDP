import SignupForm from "@/components/pages/auth/signup/signup-form";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 py-12 text-center text-white/60">
          Loading…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

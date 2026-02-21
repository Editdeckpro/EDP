import SignupForm from "@/components/pages/auth/signup/signup-form";
import Link from "next/link";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="text-muted-foreground">
          Enter your details and payment. We&apos;ll email you a link to set your password.
        </p>
      </div>
      <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
        <SignupForm />
      </Suspense>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}

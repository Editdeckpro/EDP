import SocialLogin from "@/components/auth/social-login";
import LoginForm from "@/components/pages/auth/login/login-form";
import Link from "next/link";

export default function Page() {
  return (
    <>
      {/* Login Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">
          Log in to Editdeck!
        </h2>
        <p className="text-muted-foreground">Login. Create. Inspire.</p>
      </div>

      {/* Login Form */}
      <LoginForm />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLogin />

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium hover:underline"
          >
            Register Now
          </Link>
        </p>
      </div>
    </>
  );
}

import SocialLogin from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
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
      <form className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-foreground"
          >
            Username
          </label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Enter email or username"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter Your Password"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
              aria-label="Toggle password visibility"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>
          <div className="flex justify-end">
            <Link
              href="/forget"
              className="text-sm text-destructive hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" size={"full"}>
          Log In
        </Button>
      </form>

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

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
          Register to Editdeck!
        </h2>
        <p className="text-muted-foreground">Awaken your creative power.</p>
      </div>

      {/* Login Form */}
      <form className="space-y-6">
        <div className="flex gap-2 justify-between">
          <div className="space-y-2 w-full">
            <label
              htmlFor="fname"
              className="block text-sm font-medium text-foreground"
            >
              First Name
            </label>
            <Input
              id="fname"
              name="fname"
              type="text"
              placeholder="Enter First Name"
            />
          </div>
          <div className="space-y-2 w-full">
            <label
              htmlFor="lname"
              className="block text-sm font-medium text-foreground"
            >
              Last Name
            </label>
            <Input
              id="lname"
              name="lname"
              type="text"
              placeholder="Enter Last Name"
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
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
            placeholder="Enter Username"
          />
        </div>

        <div className="space-y-2 w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="text"
            placeholder="Enter Your Email"
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
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Confirm Your Password"
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
        </div>

        <Button type="submit" size={"full"}>
          Register
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
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </>
  );
}

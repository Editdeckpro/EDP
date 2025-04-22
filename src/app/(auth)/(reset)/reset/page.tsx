import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";

export default function pages() {
  return (
    <>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
        <p className="text-muted-foreground">Create your new password.</p>
      </div>

      {/* Login Form */}
      <form className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              New Password
            </label>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter New Password"
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
              htmlFor="confirm-password"
              className="block text-sm font-medium text-foreground"
            >
              Confirm Password
            </label>
          </div>
          <div className="relative">
            <Input
              id="confirm-password"
              name="confirm-password"
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
          Submit
        </Button>
      </form>
    </>
  );
}

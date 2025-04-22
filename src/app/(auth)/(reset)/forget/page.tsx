import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function pages() {
  return (
    <>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
        <p className="text-muted-foreground">
          We have sent an OTP to your registered email ID.
        </p>
      </div>

      {/* Login Form */}
      <form className="space-y-6">
        <div className="space-y-2">
          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-foreground"
            >
              Enter OTP
            </label>
            <Input
              id="otp"
              name="otp"
              type="number"
              placeholder="Enter OTP Here"
            />
          </div>
          <div className="flex justify-end items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Link href="#" className="text-sm text-destructive hover:underline">
              Resend OTP
            </Link>{" "}
            in 30 Seconds.
          </div>
        </div>

        <Button type="submit" size={"full"}>
          Submit
        </Button>
      </form>
    </>
  );
}

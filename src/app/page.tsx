import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Background Image Section */}
      <div className="hidden md:block md:w-2/3 relative">
        <Image
          src="/images/auth/login-bg.jpg"
          alt="Cybernetic tiger in a field of red flowers"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="bg-black px-3 py-1">
              <h1 className="text-white text-2xl font-bold tracking-wider">
                EDITDECK
              </h1>
            </div>
          </div>

          {/* Login Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#1b1c1e]">
              Log in to Editdeck!
            </h2>
            <p className="text-[#7c7e90]">Login. Create. Inspire.</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#344054]"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter email or username"
                className="w-full px-3 py-2 border border-[#dcdde3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e4eba]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#344054]"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                  className="w-full px-3 py-2 border border-[#dcdde3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3e4eba] pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7c7e90]"
                  aria-label="Toggle password visibility"
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-[#ff8a3d] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#3e4eba] text-white rounded-md hover:bg-[#3e4eba]/90 focus:outline-none focus:ring-2 focus:ring-[#3e4eba] focus:ring-offset-2"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#dcdde3]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#7c7e90]">Or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-[#dcdde3] rounded-md hover:bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Use Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center py-2 px-4 border border-[#dcdde3] rounded-md hover:bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17.5764 12.3275C17.5574 10.3461 18.4429 8.85232 20.2287 7.76147C19.2707 6.33763 17.8039 5.55938 15.8876 5.44346C14.0714 5.32755 12.0784 6.45624 11.3926 6.45624C10.6599 6.45624 8.86512 5.48317 7.45769 5.48317C4.85471 5.52288 2.05078 7.60671 2.05078 11.8602C2.05078 13.1048 2.27709 14.3892 2.72971 15.7135C3.34355 17.4993 5.60168 22.0005 7.95001 21.9211C9.13899 21.8814 9.98555 21.0634 11.5519 21.0634C13.0714 21.0634 13.8497 21.9211 15.1738 21.9211C17.5422 21.8814 19.5749 17.8326 20.1489 16.0468C17.0841 14.5273 17.5764 12.4151 17.5764 12.3275ZM14.8502 3.73C16.3299 1.98386 16.1944 0.396484 16.1547 0C14.8502 0.0794968 13.3307 0.897748 12.4444 1.90111C11.4864 2.98 10.9338 4.26428 11.0497 5.40493C12.4444 5.52084 13.7886 4.82232 14.8502 3.73Z"
                  fill="black"
                />
              </svg>
              Use Apple
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-[#7c7e90]">
              Don't have an account?{" "}
              <Link
                href="#"
                className="text-[#3e4eba] font-medium hover:underline"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

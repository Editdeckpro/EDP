import React from "react";
import GoogleLoginBtn from "./google-login-btn";
import AppleLoginBtn from "./apple-login-btn";
import Link from "next/link";

export default function SocialLogin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link
        href={`${process.env.NEXT_PUBLIC_BE_URL}/auth/google`}
        className="cursor-pointer flex items-center justify-center py-2 px-4 border border-[#dcdde3] rounded-md hover:bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#4285f4] focus:ring-offset-2 w-full"
        prefetch={false}
      >
        <GoogleLoginBtn />
      </Link>
      <Link
        href={`${process.env.NEXT_PUBLIC_BE_URL}/auth/apple`}
        className="cursor-pointer flex items-center justify-center py-2 px-4 border border-[#dcdde3] rounded-md hover:bg-[#f8f8f8] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 w-full"
        prefetch={false}
      >
        <AppleLoginBtn />
      </Link>
    </div>
  );
}

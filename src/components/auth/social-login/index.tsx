import React from "react";
import GoogleLoginBtn from "./google-login-btn";
import AppleLoginBtn from "./apple-login-btn";
import Link from "next/link";

export default function SocialLogin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Link href={`${process.env.NEXT_PUBLIC_BE_URL}/auth/google`}>
        <GoogleLoginBtn />
      </Link>
      <Link href={`${process.env.NEXT_PUBLIC_BE_URL}/auth/apple`}>
        <AppleLoginBtn />
      </Link>
    </div>
  );
}

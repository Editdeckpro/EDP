import React from "react";
import GoogleLoginBtn from "./google-login-btn";
import AppleLoginBtn from "./apple-login-btn";

export default function SocialLogin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <GoogleLoginBtn />
      <AppleLoginBtn />
    </div>
  );
}

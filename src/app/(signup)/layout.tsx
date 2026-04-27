import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const SignupLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="EditDeckPro"
              width={40}
              height={40}
              className="rounded"
              priority
            />
            <span className="text-lg font-semibold tracking-tight">EditDeckPro</span>
          </Link>
          <Link
            href="/login"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Already a member? <span className="font-medium underline">Log in</span>
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
};

export default SignupLayout;

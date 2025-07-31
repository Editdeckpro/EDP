import AuthGuard from "@/auth-guard";
import { TourProvider } from "@/context/OnboardingTourContext";
import Providers from "@/lib/providers";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <Providers>
        <TourProvider>
          <main className="relative min-h-screen flex flex-col">
            <div className="block bg-[#3E4EBA]/30 top-0 left-0 md:bg-[#3E4EBA]/70 absolute md:top-10 md:left-1/12 w-52 h-52 rounded-full blur-3xl -z-10" />
            <div className="block  bg-[#FF8A3D]/30 bottom-0 left-0 md:bg-[#FF8A3D]/70 absolute md:bottom-0 md:left-0 w-52 h-52 rounded-full blur-3xl -z-10" />
            <div className="flex-1">{children}</div>
          </main>
        </TourProvider>
      </Providers>
    </AuthGuard>
  );
};
export default Layout;

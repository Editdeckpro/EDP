import AuthGuard from "@/auth-guard";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <main className="relative">
        <div className="block bg-[#3E4EBA]/30 absolute top-0 left-0 w-52 h-52 rounded-full blur-3xl -z-10" />
        <div className="block bg-[#FF8A3D]/30 absolute bottom-0 left-0 w-52 h-52 rounded-full blur-3xl -z-10" />
        {children}
      </main>
    </AuthGuard>
  );
};
export default Layout;

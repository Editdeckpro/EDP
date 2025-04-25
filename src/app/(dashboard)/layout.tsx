import DashboardHeader from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <main className="flex relative flex-col lg:flex-row">
      <div className="hidden lg:block bg-[#3E4EBA]/30 absolute top-0 left-0 w-52 h-52 rounded-full blur-3xl -z-10" />
      <div className="hidden lg:block bg-[#FF8A3D]/30 absolute bottom-0 left-0 w-52 h-52 rounded-full blur-3xl -z-10" />
      <section className="p-5 lg:pr-0 min-w-1/4 ">
        <Sidebar />
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader />
        {children}
      </section>
    </main>
  );
};
export default Layout;

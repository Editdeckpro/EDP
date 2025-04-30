import DashboardHeader from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <Sidebar />
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader />
        {children}
      </section>
    </section>
  );
};
export default Layout;

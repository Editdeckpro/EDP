import DashboardHeader from "@/components/layout/header";
import OnboardingTour from "@/components/layout/onboarding-tour";
import Sidebar from "@/components/layout/sidebar";
import OnboardingGuard from "@/components/pages/onboarding/onboarding-guard";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <OnboardingGuard>
      <OnboardingTour>
        <section className="flex flex-col lg:flex-row">
          <section className="hidden lg:block p-5 lg:pr-0 min-w-[22%] ">
            <Sidebar />
          </section>
          <section className="p-5 space-y-5  w-full">
            <DashboardHeader />
            {children}
          </section>
        </section>
      </OnboardingTour>
    </OnboardingGuard>
  );
};
export default Layout;

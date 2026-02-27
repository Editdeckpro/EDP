"use client";
import DashboardHeader from "@/components/layout/header";
import { SidebarWrapper } from "@/components/layout/sidebar";
import { CustomGeneratedImage, GeneratedImageRes } from "@type/api/generate.type";
import { Dispatch, SetStateAction, useState } from "react";
import GeneratePage from "./generate-page";
import GenerateSidebarContent from "./sidebar-content";
import { NoActiveSubscriptionModal } from "./modals/no-active-subscription-modal";
import { useSession } from "@/lib/auth-client";

export type GenerateResType = CustomGeneratedImage | GeneratedImageRes | null | "loading";
export type SetGenerateResType = Dispatch<SetStateAction<GenerateResType | null>>;

export default function Generate() {
  const { data: authData } = useSession();
  const [data, setData] = useState<GenerateResType>(null);

  return (
    <section className="flex flex-col lg:flex-row">
      {authData?.user && (
        <NoActiveSubscriptionModal
          generationsUsedThisMonth={authData.user.generationsUsedThisMonth}
          monthlyLimit={authData.user.monthlyLimit}
        />
      )}
      <div className="hidden lg:block lg:pr-0 min-w-1/4 p-5 pb-0">
        <SidebarWrapper>
          <GenerateSidebarContent setData={setData} />
        </SidebarWrapper>
      </div>
      <section className="p-5 pt-3 pb-4 space-y-4 w-full max-w-full">
        <DashboardHeader />
        <div className="w-full">
          <GeneratePage data={data} />
        </div>
        <section className="max-w-2xl block lg:hidden">
          <GenerateSidebarContent setData={setData} />
        </section>
      </section>
    </section>
  );
}

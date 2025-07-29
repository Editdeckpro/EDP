"use client";
import DashboardHeader from "@/components/layout/header";
import { RemixImage } from "@type/api/generate.type";
import { useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import RemixPage from "./remix-page";
import RemixSidebarContent from "./sidebar-content";
import { SidebarWrapper } from "@/components/layout/sidebar";
import { useSession } from "next-auth/react";
import { NoActiveSubscriptionModal } from "../generate/modals/no-active-subscription-modal";

export type RemixResType = RemixImage | null | "loading";
export type SetRemixResType = Dispatch<SetStateAction<RemixResType | null>>;

export default function Remix() {
  const [remixData, setRemixData] = useState<RemixResType>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const url = searchParams.get("imageUrl");
  let validUrl: string | null = null;
  const [base64, setBase64] = useState<string | null>(null);
  const { data: authData } = useSession();
  const credits = authData?.user.credits;

  if (typeof url === "string" && url.trim() !== "") {
    try {
      // Throws if not a valid URL
      new URL(url);
      validUrl = url;
    } catch {
      validUrl = null;
    }
  }

  return (
    <section className="flex flex-col lg:flex-row">
      {authData?.user && <NoActiveSubscriptionModal credits={credits} />}
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <SidebarWrapper>
          <RemixSidebarContent
            setPageBase64={setBase64}
            setData={setRemixData}
            imageUrl={validUrl}
            setPrompt={setPrompt}
          />
        </SidebarWrapper>
      </section>

      <section className="p-5 space-y-5  w-full">
        <DashboardHeader />
        <RemixPage data={remixData} imageSrc={validUrl || base64} prompt={prompt} />
        <section className="max-w-2xl block lg:hidden space-y-5">
          <RemixSidebarContent
            setPageBase64={setBase64}
            setData={setRemixData}
            imageUrl={validUrl}
            setPrompt={setPrompt}
          />
        </section>
      </section>
    </section>
  );
}

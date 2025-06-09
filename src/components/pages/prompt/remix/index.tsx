"use client";
import DashboardHeader from "@/components/layout/header";
import { Dispatch, SetStateAction, useState } from "react";
import PromptMobileHeader from "../mobile-header";
import PromptSidebar from "../sidebar";
import RemixSidebarContent from "./sidebar-content";
import { RemixImage } from "@type/api/generate.type";
import RemixPage from "./remix-page";
import { useSearchParams } from "next/navigation";

export type RemixResType = RemixImage | null | "loading";
export type SetRemixResType = Dispatch<SetStateAction<RemixResType | null>>;

export default function Remix() {
  const [prompt, setPrompt] = useState<RemixResType>(null);
  const searchParams = useSearchParams();
  const url = searchParams.get("imageUrl");
  let validUrl: string | null = null;
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
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <PromptSidebar>
          <RemixSidebarContent setData={setPrompt} imageUrl={validUrl} />
        </PromptSidebar>
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader type="prompt" />
        <PromptMobileHeader
          SidebarContent={
            <RemixSidebarContent setData={setPrompt} imageUrl={validUrl} />
          }
        />
        <RemixPage data={prompt} />
      </section>
    </section>
  );
}

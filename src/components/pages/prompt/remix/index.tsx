"use client";
import DashboardHeader from "@/components/layout/header";
import { Dispatch, SetStateAction, useState } from "react";
import PromptMobileHeader from "../mobile-header";
import PromptSidebar from "../sidebar";
import RemixSidebarContent from "./sidebar-content";
import { RemixImage } from "@type/api/generate.type";
import RemixPage from "./remix-page";

export type RemixResType = RemixImage | null | "loading";
export type SetRemixResType = Dispatch<SetStateAction<RemixResType | null>>;

export default function Remix({ url }: { url?: string }) {
  const [prompt, setPrompt] = useState<RemixResType>(null);

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <PromptSidebar>
          <RemixSidebarContent setData={setPrompt} imageUrl={url} />
        </PromptSidebar>
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader type="prompt" />
        <PromptMobileHeader
          SidebarContent={<RemixSidebarContent setData={setPrompt} />}
        />
        <RemixPage data={prompt} />
      </section>
    </section>
  );
}

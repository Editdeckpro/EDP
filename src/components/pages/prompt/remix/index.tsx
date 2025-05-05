"use client";
import DashboardHeader from "@/components/layout/header";
import { Dispatch, SetStateAction, useState } from "react";
import PromptMobileHeader from "../mobile-header";
import PromptSidebar from "../sidebar";
import RemixSidebarContent from "./sidebar-content";

export type RemixResType = null | "loading";
export type SetRemixResType = Dispatch<SetStateAction<RemixResType | null>>;

export default function Remix() {
  const [prompt, setPrompt] = useState<RemixResType>(null);

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <PromptSidebar>
          <RemixSidebarContent setData={setPrompt} />
        </PromptSidebar>
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader type="prompt" />
        <PromptMobileHeader
          SidebarContent={<RemixSidebarContent setData={setPrompt} />}
        />
        {/* <GeneratePage data={prompt} /> */}

        <p>Lorem, ipsum.</p>
        <p>Lorem, ipsum.</p>
        <p>Lorem, ipsum.</p>
      </section>
    </section>
  );
}

"use client";
import DashboardHeader from "@/components/layout/header";
import {
  CustomGeneratedImage,
  FilterGeneratedImage,
} from "@type/api/generate.type";
import { Dispatch, SetStateAction, useState } from "react";
import PromptMobileHeader from "../mobile-header";
import PromptSidebar from "../sidebar";
import GeneratePage from "./generate-page";
import GenerateSidebarContent from "./sidebar-content";

export type GenerateResType =
  | CustomGeneratedImage
  | FilterGeneratedImage
  | null
  | "loading";
export type SetGenerateResType = Dispatch<
  SetStateAction<GenerateResType | null>
>;

export default function Generate() {
  const [prompt, setPrompt] = useState<GenerateResType>(null);

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <PromptSidebar>
          <GenerateSidebarContent setData={setPrompt} />
        </PromptSidebar>
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader type="prompt" />
        <PromptMobileHeader
          SidebarContent={<GenerateSidebarContent setData={setPrompt} />}
        />
        <GeneratePage data={prompt} />
      </section>
    </section>
  );
}

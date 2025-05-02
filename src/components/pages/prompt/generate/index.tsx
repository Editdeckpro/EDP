"use client";
import DashboardHeader from "@/components/layout/header";
import GenerateSidebar from "./sidebar";
import { Dispatch, SetStateAction, useState } from "react";
import GenerateMobileHeader from "../mobile-header";
import GeneratePage from "./generate-page";
import { CustomGeneratedImage } from "@type/api/custom-generated.type";

export type GenerateResType = CustomGeneratedImage | null;
export type SetGenerateResType = Dispatch<
  SetStateAction<GenerateResType | null>
>;

export default function Generate() {
  const [prompt, setPrompt] = useState<GenerateResType>(null);

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <GenerateSidebar setData={setPrompt} />
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader type="prompt" />
        <GenerateMobileHeader setData={setPrompt} />
        <GeneratePage data={prompt} />
      </section>
    </section>
  );
}

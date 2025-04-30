"use client";
import DashboardHeader from "@/components/layout/header";
import GenerateSidebar from "./sidebar";
import { useState } from "react";

export default function Generate() {
  const [prompt, setPrompt] = useState("");

  return (
    <section className="flex flex-col lg:flex-row">
      <section className="hidden lg:block p-5 lg:pr-0 min-w-1/4 ">
        <GenerateSidebar setData={setPrompt} />
      </section>
      <section className="p-5 space-y-5  w-full">
        <DashboardHeader />
        <p>{prompt}</p>
      </section>
    </section>
  );
}

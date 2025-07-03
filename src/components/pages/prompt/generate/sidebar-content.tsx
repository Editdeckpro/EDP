"use client";
import { Separator } from "@/components/ui/separator";
import { FC } from "react";
import { SetGenerateResType } from ".";
import GenerateFilterForm from "./generation-form";

interface GenerateSidebarContent {
  setData: SetGenerateResType;
}

const GenerateSidebarContent: FC<GenerateSidebarContent> = ({ setData }) => {
  return (
    <>
      <h1 className="text-lg font-bold">Create Image</h1>
      <Separator />
      <GenerateFilterForm setData={setData} />
    </>
  );
};

export default GenerateSidebarContent;

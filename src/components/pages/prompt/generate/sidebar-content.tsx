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
      <div className="bg-gray-50/50 rounded-xl p-5 -mx-5 mt-4 mb-4">
        <GenerateFilterForm setData={setData} />
      </div>
    </>
  );
};

export default GenerateSidebarContent;

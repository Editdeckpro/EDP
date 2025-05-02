"use client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC, useState } from "react";
import { GenerateResType } from ".";
import CustomForm from "./custom-form";
import GenerateFilterForm from "./filter-form";

interface GenerateSidebarContent {
  setData: GenerateResType;
}

const GenerateSidebarContent: FC<GenerateSidebarContent> = ({ setData }) => {
  const [selectedTab, setSelectedTab] = useState<"custom" | "filter">("custom");

  return (
    <>
      <h1 className="text-lg font-bold">Create Image</h1>
      <Separator />

      <Tabs
        defaultValue="custom"
        onValueChange={(val) => setSelectedTab(val as "custom" | "filter")}
      >
        <div>
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none font-normal text-gray-700 data-[state=active]:text-primary data-[state=active]:font-bold"
              value="custom"
            >
              Custom
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none font-normal text-gray-700 data-[state=active]:text-primary data-[state=active]:font-bold"
              value="filter"
            >
              Filter
            </TabsTrigger>
          </TabsList>
          <div className="flex overflow-hidden">
            <Separator
              className={`!h-[2px] max-w-1/2 ${
                selectedTab == "custom" ? "bg-primary" : "bg-muted"
              }`}
            />
            <Separator
              className={`!h-[2px] max-w-1/2 ${
                selectedTab == "filter" ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </div>
        <TabsContent value="custom">
          <CustomForm setData={setData} />
        </TabsContent>
        <TabsContent value="filter">
          <GenerateFilterForm setData={setData} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default GenerateSidebarContent;

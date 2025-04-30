import React, { Dispatch, SetStateAction } from "react";
import GenerateSidebarContent from "./sidebar-content";

interface GenerateSidebar {
  setData: Dispatch<SetStateAction<string>>;
}

export default function GenerateSidebar({ setData }: GenerateSidebar) {
  return (
    <aside className="p-5 bg-white border w-full rounded-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium max-w-sm">
      <GenerateSidebarContent setData={setData} />
    </aside>
  );
}

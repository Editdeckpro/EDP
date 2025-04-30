import React from "react";
import GenerateSidebarContent from "./sidebar-content";

export default function GenerateSidebar() {
  return (
    <aside className="p-5 bg-white border w-full rounded-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium max-w-sm">
      <GenerateSidebarContent />
    </aside>
  );
}

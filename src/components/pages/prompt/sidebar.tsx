import React, { ReactNode } from "react";

interface PromptSidebarProps {
  children: ReactNode;
}

export default function PromptSidebar({ children }: PromptSidebarProps) {
  return (
    <aside className="p-5 bg-white border w-full rounded-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium max-w-sm">
      {children}
    </aside>
  );
}

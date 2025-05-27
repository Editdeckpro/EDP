import Remix from "@/components/pages/prompt/remix";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Remix />
    </Suspense>
  );
}

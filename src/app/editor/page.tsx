"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import DashboardHeader from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";
import Providers from "@/lib/providers";

function EditorContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");

  useEffect(() => {
    if (!imageUrl) {
      router.replace("/");
    }
  }, [imageUrl, router]);

  if (!imageUrl) return null;

  return (
    <Providers>
      <main className="min-w-screen min-h-screen flex flex-col">
        <div className="px-5 py-1 flex flex-col gap-2">
          <DashboardHeader />
        </div>
        <Separator />
        <iframe
          src={`https://editor.editdeckpro.com/?url=${encodeURIComponent(
            imageUrl
          )}`}
          className="flex-1 w-full h-full"
        ></iframe>
      </main>
    </Providers>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorContainer />
    </Suspense>
  );
}

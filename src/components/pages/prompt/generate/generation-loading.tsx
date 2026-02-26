"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useState } from "react";

const messages = [
  "🎨 Tuning the canvas to your vibe...",
  "🎵 Mixing melodies into visuals...",
  "🚀 Spinning up some sonic artwork...",
  "📀 Dropping the beat... onto the canvas.",
  "🌌 Aligning stars for your next hit cover...",
  "🎧 Turning sound into sight...",
  "🌀 Loading vibes. Please stay in tune...",
  "🖌️ Painting your rhythm in pixels...",
  "🔥 Building a visual anthem...",
  "✨ Warming up the stage for your album...",
];

const GenerationLoading = () => {
  const [currentMsgIndex, setCurrentMsgIndex] = useState<number>(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setFade(false);
      timeoutId = setTimeout(() => {
        setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="w-sm h-6" />
          <Skeleton className="w-xs h-4" />
        </div>
      </div>

      <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/20 border border-gray-100/50 min-h-[300px] flex items-center justify-center">
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="content">
            <div className="cube"></div>
          </div>
          {/* <div className="relative w-60 sm:w-80 md:w-[300px] lg:w-[450px] aspect-square">
            <Image src="/images/generation-loading.gif" fill alt="something" className="object-cover" />
          </div> */}
          <div className="relative -top-8 md:-top-6 min-h-[24px] text-center text-muted-foreground text-sm font-medium transition-all duration-500 ease-in-out">
            <p
              className={`tracking-wide transition-all duration-500 transform ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {messages[currentMsgIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationLoading;

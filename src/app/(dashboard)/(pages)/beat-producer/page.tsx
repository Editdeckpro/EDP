"use client";
import dynamic from "next/dynamic";

// Tone.js uses Web Audio API at module-init time — it must never run on the server.
// next/dynamic with ssr:false guarantees the entire component tree only loads in the browser.
const BeatProducerClient = dynamic(() => import("./_client"), { ssr: false });

export default function BeatProducerPage() {
  return <BeatProducerClient />;
}

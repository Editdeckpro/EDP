import React from "react";
import VideoCard from "./video-card";
import TutorialHeader from "./tutorial-header";

export default function Tutorial() {
  return (
    <section className="space-y-5">
      <TutorialHeader />
      <div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 ">
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
        <VideoCard
          duration={100}
          thumbUrl="/images/video-thumb.jpg"
          title="How to Remix Image?"
        />
      </div>
    </section>
  );
}

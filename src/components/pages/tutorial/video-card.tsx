import GIcon from "@/components/g-icon";
import { formatSecondsToMinutes } from "@/lib/utils";
import Image from "next/image";
import React, { FC } from "react";

interface VideoCardProps {
  thumbUrl: string;
  title: string;
  duration: number;
}

const VideoCard: FC<VideoCardProps> = ({ duration, thumbUrl, title }) => {
  return (
    <div className="flex flex-col h-fit aspect-video rounded-2xl border border-gray-300">
      <Image
        src={thumbUrl}
        width={600}
        height={500}
        alt={title}
        className="rounded-t-xl"
      />

      <div className="py-2 px-3 rounded-b-xl text-black flex gap-2 items-center">
        <div className="p-2 bg-secondary max-w-12 w-fit rounded-full aspect-square flex items-center justify-center">
          <GIcon>play_circle</GIcon>
        </div>
        <div className="-space-y-2">
          <h4 className="font-bold">{title}</h4>
          <span className="text-sm text-gray-500">
            Duration:{" "}
            <span className="text-primary font-semibold">
              {formatSecondsToMinutes(duration)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
export default VideoCard;

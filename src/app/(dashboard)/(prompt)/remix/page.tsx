import Remix from "@/components/pages/prompt/remix";
import React from "react";

interface PageProps {
  searchParams: {
    imageUrl?: string;
  };
}

const Page: React.FC<PageProps> = ({ searchParams }) => {
  const url =
    searchParams.imageUrl && searchParams.imageUrl !== ""
      ? searchParams.imageUrl
      : undefined;
  return <Remix url={url} />;
};

export default Page;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";
import React from "react";

const ImageGridHeader = ({}) => {
  return (
    <header>
      <section className="flex justify-between flex-col sm:flex-row gap-3">
        <div className="-space-y-2">
          <h1 className="text-xl sm:text-lg font-bold">
            Recently Generated Images
          </h1>
          <span className="text-sm text-gray-700">
            Browse, refine, or relive your recent image generations.
          </span>
        </div>
        {/* todo: make it a form */}
        <div className="flex gap-2">
          <Input placeholder="Search by prompt" type="text" name="search" />
          <Button>
            Sort By <ChevronDown />{" "}
          </Button>
        </div>
      </section>
    </header>
  );
};
export default ImageGridHeader;

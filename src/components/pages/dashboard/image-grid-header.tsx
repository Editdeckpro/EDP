"use client";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hook/use-debounce";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SortByDropdown from "./sort-by-dropdown";

const ImageGridHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("search")]);

  const debouncedSearch = useDebounce(search, 800);

  // Debounce search param update
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            icon={<Search />}
            placeholder="Search by prompt"
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SortByDropdown />
        </form>
      </section>
    </header>
  );
};

export default ImageGridHeader;

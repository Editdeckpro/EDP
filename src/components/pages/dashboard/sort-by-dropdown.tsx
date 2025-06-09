"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function SortByDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortByParam = searchParams.get("sortBy");
  const sortByArray = ["asc", "desc"];
  const value =
    sortByParam && sortByArray.includes(sortByParam) ? sortByParam : "desc";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (sortByArray.includes(value)) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleChange} value={value}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Oldest</SelectItem>
        <SelectItem value="desc">Newest</SelectItem>
      </SelectContent>
    </Select>
  );
}

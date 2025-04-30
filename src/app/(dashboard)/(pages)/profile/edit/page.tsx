import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-5 flex-col 2xs:flex-row">
        <Image
          src={"/images/pfp.jpg"}
          width={75}
          height={75}
          alt="User Profile Pic"
          className="rounded-xl aspect-square"
        />
        <Button variant={"outline"}>Upload Image</Button>
      </div>
      <form className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="captcha">Enter Text</Label>
            <Input type="text" id="captcha" placeholder="Enter Here" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="captcha">Enter Text</Label>
            <Input type="text" id="captcha" placeholder="Enter Here" />
          </div>
        </div>
        <Button className="w-full sm:w-auto">Save Changes</Button>
      </form>
    </section>
  );
}

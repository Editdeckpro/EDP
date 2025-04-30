import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <section className="space-y-10">
      <header className="py-8 md:py-16 flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill">
        <Image
          src={"/images/logo.jpg"}
          width={200}
          height={200}
          alt="edit deck pro logo.png"
        />
      </header>
      <form className="w-full space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Your Name</Label>
            <Input type="text" id="name" placeholder="Enter Name Here" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Your Email</Label>
            <Input type="email" id="email" placeholder="Enter Email Here" />
          </div>
          <div className="grid w-full items-center gap-1.5 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="number">Your Number</Label>
            <Input type="number" id="number" placeholder="Enter Number Here" />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="number">Your Message</Label>
          <Textarea id="number" placeholder="Enter Your Message Here" />
        </div>
        <Button className="w-full sm:w-auto">Submit</Button>
      </form>
    </section>
  );
}

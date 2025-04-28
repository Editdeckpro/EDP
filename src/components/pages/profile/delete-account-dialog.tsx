"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function DeleteAccountDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-2 rounded-lg bg-white flex justify-between items-center gap-3 w-full text-muted-foreground cursor-pointer">
          Delete Account
          <ChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent className="!max-w-[25rem]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-3xl">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-center">
            Kindly type below image text correctly to delete your account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center flex-col">
          <Image
            src={"/images/delete-acc-captcha.jpg"}
            width={120}
            height={50}
            alt="captcha"
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="captcha">Enter Text</Label>
            <Input type="text" id="captcha" placeholder="Enter Here" />
          </div>
        </div>

        <DialogFooter className="mt-5 grid grid-cols-1 sm:grid-cols-2">
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              type="button"
              variant={"outline"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button className="cursor-pointer" type="button">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

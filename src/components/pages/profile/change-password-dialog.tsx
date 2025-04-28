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
import { ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-2 rounded-lg bg-white flex justify-between items-center gap-3 w-full text-muted-foreground cursor-pointer">
          Change Password
          <ChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent className="!max-w-[25rem]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-3xl">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center">
            Create your new password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password-old"
                className="block text-sm font-medium text-foreground"
              >
                Old Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="password-old"
                name="password-old"
                type="password"
                placeholder="Enter Old Password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* --------- */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password-new"
                className="block text-sm font-medium text-foreground"
              >
                Enter New Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="password-new"
                name="password-new"
                type="password"
                placeholder="Enter New Password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>
          {/* ---------- */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password-confirm"
                className="block text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="password-confirm"
                name="password-confirm"
                type="password"
                placeholder="Confirm Your Password"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
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
        <Link href={"/forget"} className="text-center text-secondary underline">
          Forgot Password?
        </Link>
      </DialogContent>
    </Dialog>
  );
}

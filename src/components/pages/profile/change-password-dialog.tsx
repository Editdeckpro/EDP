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
import { Form } from "@/components/ui/form";
import { FormPasswordField } from "@/components/ui/password-input";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Old Password must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type ChnagePasswordSchemaType = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordDialog() {
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<ChnagePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ChnagePasswordSchemaType) {
    setLoading(true);
    try {
      const axios = await GetAxiosWithAuth();
      await axios.post("password/change", {
        oldPassword: values.oldPassword,
        newPassword: values.confirmPassword,
      });
      toast.success("Password chnage successful!");
      form.reset();
      setIsOpen(false);
    } catch (e) {
      const error = e as AxiosError<{ error?: string }>;
      // console.info("Error resetting password", e);
      toast.error("Something went wrong.", {
        description: error?.response?.data?.error,
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="p-2 rounded-lg bg-white flex justify-between items-center gap-3 w-full text-muted-foreground cursor-pointer">
          Change Password
          <ChevronRight />
        </div>
      </DialogTrigger>
      <DialogContent className="!max-w-[25rem]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg md:text-3xl">Change Password</DialogTitle>
          <DialogDescription className="text-center">Create your new password.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormPasswordField form={form} name="oldPassword" label="Old Password" placeholder="Enter Old Password" />
            <FormPasswordField form={form} name="password" label="New Password" placeholder="Enter New Password" />
            <FormPasswordField
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Your Password"
            />
            <DialogFooter className="mt-5 grid grid-cols-1 sm:grid-cols-2">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer hover:bg-transparent hover:text-primary"
                  type="button"
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button className="cursor-pointer" type="submit" isLoading={loading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <Link href={"/forget"} className="text-center text-secondary underline">
          Forgot Password?
        </Link>
      </DialogContent>
    </Dialog>
  );
}

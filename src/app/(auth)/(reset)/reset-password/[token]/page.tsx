"use client";
import { Button } from "@/components/ui/button";
import { FormPasswordField } from "@/components/ui/password-input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";

import React, { FC } from "react";
import { AxiosError } from "axios";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

const Page: FC<PageProps> = ({ params }) => {
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const [loading, setLoading] = React.useState(false);
  const { token } = React.use(params);

  async function onSubmit(values: ResetPasswordSchemaType) {
    setLoading(true);
    try {
      await axiosInstance.post("api/password/reset", {
        token: token,
        newPassword: values.password,
      });
      toast.success("Password reset successful!");
      form.reset();
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
    <>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
        <p className="text-muted-foreground">Create your new password.</p>
      </div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormPasswordField
            form={form}
            name="password"
            label="New Password"
            placeholder="Enter New Password"
          />
          <FormPasswordField
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Your Password"
          />
          <Button type="submit" size={"full"} isLoading={loading}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
export default Page;

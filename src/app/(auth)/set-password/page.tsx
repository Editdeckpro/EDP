"use client";

import { Button } from "@/components/ui/button";
import { FormPasswordField } from "@/components/ui/password-input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import React, { Suspense, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const setPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type SetPasswordSchemaType = z.infer<typeof setPasswordSchema>;

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  const form = useForm<SetPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    axiosInstance
      .get(`api/password/verify/${encodeURIComponent(token)}`)
      .then(() => setTokenValid(true))
      .catch(() => setTokenValid(false));
  }, [token]);

  async function onSubmit(values: SetPasswordSchemaType) {
    if (!token) return;
    setLoading(true);
    try {
      await axiosInstance.post("api/password/reset", {
        token,
        newPassword: values.password,
      });
      toast.success("Password set successfully! You can now sign in.");
      router.push("/login");
    } catch (e) {
      const err = e as AxiosError<{ error?: string; message?: string }>;
      const msg = err.response?.data?.message || err.response?.data?.error || "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    if (!resendEmail.trim()) {
      toast.error("Enter your email address.");
      return;
    }
    setResendLoading(true);
    try {
      await axiosInstance.post("api/password/resend-set-password", { email: resendEmail.trim() });
      toast.success("If an account is pending, a new link has been sent to your email.");
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  }

  if (tokenValid === null) {
    return (
      <div className="text-center text-muted-foreground">Checking link...</div>
    );
  }

  if (!token || tokenValid === false) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground">Invalid or expired link</h2>
        <p className="text-muted-foreground">
          This password setup link is invalid or has expired. Request a new one below.
        </p>
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          <Input
            type="email"
            placeholder="Your email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
          />
          <Button onClick={onResend} disabled={resendLoading}>
            {resendLoading ? "Sending…" : "Resend set-password email"}
          </Button>
        </div>
        <p className="text-sm">
          <Link href="/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Set your password</h2>
        <p className="text-muted-foreground">Choose a password to sign in to your account.</p>
      </div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormPasswordField
            form={form}
            name="password"
            label="Password"
            placeholder="Enter password"
          />
          <FormPasswordField
            form={form}
            name="confirmPassword"
            label="Confirm password"
            placeholder="Confirm password"
          />
          <Button type="submit" size="full" disabled={loading}>
            {loading ? "Setting password…" : "Set password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
      <SetPasswordContent />
    </Suspense>
  );
}

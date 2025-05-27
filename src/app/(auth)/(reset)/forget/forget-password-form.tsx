"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;

export default function ForgetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ForgetPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgetPasswordSchemaType) {
    setLoading(true);
    try {
      await axiosInstance.post("api/password/forgot", { email: values.email });
      toast.success("If this email exists, a reset link will be sent.");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      // console.info("Error sending reset password email", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
        <p className="text-muted-foreground">
          Enter your email address and we will send you a link to reset your
          password.
        </p>
      </div>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="full" isLoading={loading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}

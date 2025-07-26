"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormPasswordField } from "@/components/ui/password-input";
import { axiosInstance } from "@/lib/axios-instance";
import {
  signupFormSchema,
  SignupFormSchemaType,
} from "@/schemas/signup-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const topLoader = useTopLoader();
  const searchParams = useSearchParams();
  const promo = searchParams.get("promo") || "";
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      username: "",
    },
  });

  async function onSubmit(values: SignupFormSchemaType) {
    setLoading(true);
    topLoader.start();
    try {
      await axiosInstance.post(
        `auth/register${promo ? `?promo=${encodeURIComponent(promo)}` : ""}`,
        values,
      );

      toast.success("Registration successful!", {
        description: "You can now login",
        action: {
          label: "Login",
          onClick: () => {
            router.push("/login");
          },
        },
      });
    } catch (e) {
      const error = e as AxiosError;
      // console.log("Error while registering user", e);
      toast.error(error.response?.statusText || "Something went wrong!", {
        description: "Please try again after some time",
      });
    }
    setLoading(false);
    topLoader.done();
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-2 justify-between items-start">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormPasswordField<SignupFormSchemaType>
          form={form}
          name="password"
          label="Password"
          placeholder="Enter Your Password"
        />

        <FormPasswordField<SignupFormSchemaType>
          form={form}
          name="confirmPassword"
          label="Confirm"
          placeholder="Confirm Your Password"
        />

        <Button type="submit" size={"full"} isLoading={loading}>
          Register
        </Button>
      </form>
    </Form>
  );
}

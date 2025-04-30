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
import {
  loginFormSchema,
  loginFormSchemaType,
} from "@/schemas/login-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: loginFormSchemaType) {
    const res = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
      callbackUrl: "/",
    });

    if (res?.ok) {
      toast.success("Logged in!");
      router.push("/");
    } else {
      toast.error("Invalid username or password");
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter email or username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormPasswordField<loginFormSchemaType>
            form={form}
            name="password"
            label="Password"
            placeholder="Enter Your Password"
          />
          <div className="flex justify-end">
            <Link
              href="/forget"
              className="text-sm text-destructive hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" size={"full"}>
          Log In
        </Button>
      </form>
    </Form>
  );
}

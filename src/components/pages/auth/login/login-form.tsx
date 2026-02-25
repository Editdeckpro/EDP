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
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTopLoader } from "nextjs-toploader";
import { axiosInstance } from "@/lib/axios-instance";
import axios, { AxiosError } from "axios";
import { OAuthErrorModal } from "./oauth-error-modal";
import { getOnboardingStatus } from "@/components/pages/onboarding/request";
import { setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

interface CheckUserStatusResponse {
  exists: boolean;
  canLogin?: boolean;
  hasActiveSubscription?: boolean;
  error?: string;
  message?: string;
  subscription?: {
    planType: string;
    status: string;
    interval: string;
    currentPeriodEnd?: string;
    trialEndDate?: string | null;
    cancelAtPeriodEnd?: boolean;
  };
  subscriptionReason?: string;
  bypassSubscription?: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const topLoader = useTopLoader();

  // 1. Define your form.
  const form = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Helper function to determine if input is email or username
  const isEmail = (input: string): boolean => {
    return input.includes("@");
  };

  // 2. Check user status before attempting login
  async function checkUserStatus(usernameOrEmail: string): Promise<CheckUserStatusResponse | null> {
    try {
      const requestBody = isEmail(usernameOrEmail)
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail };

      const response = await axiosInstance.post<CheckUserStatusResponse>(
        "auth/check-user-status",
        requestBody
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<CheckUserStatusResponse>;
        if (axiosError.response?.data) {
          return axiosError.response.data;
        }
      }
      return null;
    }
  }

  // 3. Define a submit handler.
  async function onSubmit(data: loginFormSchemaType) {
    setLoading(true);
    topLoader.start();

    try {
      // First, check user status
      const statusResponse = await checkUserStatus(data.username);

      if (!statusResponse) {
        // Network or unexpected error
        toast.error("Unable to verify account. Please try again.");
        setLoading(false);
        topLoader.done();
        return;
      }

      // Handle user not found
      if (!statusResponse.exists || statusResponse.error === "user_not_found") {
        setErrorType("user_not_found");
        setErrorMessage(
          statusResponse.message || "Account not found. Please create an account first to continue."
        );
        setShowErrorModal(true);
        setLoading(false);
        topLoader.done();
        return;
      }

      // Handle subscription-related errors
      if (!statusResponse.canLogin && statusResponse.error) {
        setErrorType(statusResponse.error);
        setErrorMessage(statusResponse.message || null);
        setShowErrorModal(true);
        setLoading(false);
        topLoader.done();
        return;
      }

      // User can login, proceed with authentication
      if (statusResponse.canLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          username: data.username,
          password: data.password,
          callbackUrl: "/",
        });

        if (res?.ok) {
          try {
            const session = await getSession();
            const token = session?.accessToken as string | undefined;
            if (token) {
              const onboardingStatus = await getOnboardingStatus(token);
              setOnboardingCompleteInStorage(onboardingStatus.isComplete);
            }
          } catch {
            // Non-blocking: clear so guard will refetch
            setOnboardingCompleteInStorage(false);
          }
          toast.success("Logged in!");
          router.push("/");
        } else {
          toast.error("Invalid username or password");
          setLoading(false);
          topLoader.done();
        }
      } else {
        // Fallback: unexpected state
        toast.error("Unable to login. Please try again.");
        setLoading(false);
        topLoader.done();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
      topLoader.done();
    }
  }

  return (
    <>
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

          <Button type="submit" size={"full"} isLoading={loading}>
            Log In
          </Button>
        </form>
      </Form>

      <OAuthErrorModal
        open={showErrorModal}
        onOpenChange={setShowErrorModal}
        errorType={errorType}
        message={errorMessage}
      />
    </>
  );
}

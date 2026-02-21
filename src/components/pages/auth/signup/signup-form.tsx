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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios-instance";
import { signupFormSchema, SignupFormSchemaType } from "@/schemas/signup-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentStep({
  clientSecret,
  formValues,
  onSuccess,
  onBack,
}: {
  clientSecret: string;
  formValues: SignupFormSchemaType;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const topLoader = useTopLoader();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      const card = elements.getElement("card");
      if (!card) return;
      setLoading(true);
      topLoader.start();
      try {
        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
          payment_method: { card },
        });
        if (error) {
          toast.error(error.message || "Payment failed.");
          setLoading(false);
          topLoader.done();
          return;
        }
        const paymentMethodId = setupIntent?.payment_method;
        if (typeof paymentMethodId !== "string") {
          toast.error("Could not save payment method.");
          setLoading(false);
          topLoader.done();
          return;
        }
        const promo = formValues.promoCode?.trim() || undefined;
        const res = await axiosInstance.post(
          `auth/register${promo ? `?promo=${encodeURIComponent(promo)}` : ""}`,
          {
            username: formValues.username.trim(),
            email: formValues.email.trim().toLowerCase(),
            paymentMethodId,
            planType: formValues.planType,
            planInterval: formValues.planInterval,
            ...(promo ? { promoCode: promo } : {}),
          }
        );
        if (res.data?.success) {
          toast.success(res.data.message || "Check your email to set your password.");
          onSuccess();
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } catch (e) {
        const err = e as AxiosError<{ message?: string; error?: string }>;
        const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
        toast.error(msg);
      } finally {
        setLoading(false);
        topLoader.done();
      }
    },
    [stripe, elements, clientSecret, formValues, onSuccess, topLoader]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border border-border p-4">
        <p className="text-sm font-medium mb-2">Card details</p>
        <CardElement
          onChange={(e: { complete: boolean }) => setCardComplete(e.complete)}
          options={{
            style: {
              base: { fontSize: "16px" },
            },
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="submit" disabled={!stripe || !cardComplete || loading} className="flex-1">
          {loading ? "Completing…" : "Complete registration"}
        </Button>
      </div>
    </form>
  );
}

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<SignupFormSchemaType | null>(null);
  const [loading, setLoading] = useState(false);
  const topLoader = useTopLoader();
  const searchParams = useSearchParams();
  const promoFromUrl = searchParams.get("promo") || "";

  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      planType: undefined,
      planInterval: undefined,
      promoCode: promoFromUrl,
    },
  });

  async function onContinue(values: SignupFormSchemaType) {
    const email = values.email.trim().toLowerCase();
    const planType = values.planType;
    const planInterval = values.planInterval;
    if (!planType || !planInterval) {
      toast.error("Please select a plan and interval.");
      return;
    }
    setLoading(true);
    topLoader.start();
    try {
      const { data } = await axiosInstance.post<{ clientSecret: string }>("create-setup-intent", {
        customer_email: email,
        plan_type: planType,
        plan_interval: planInterval,
      });
      if (data?.clientSecret) {
        setFormValues(values);
        setClientSecret(data.clientSecret);
        setStep(2);
      } else {
        toast.error("Could not start payment setup.");
      }
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to continue. Try again.");
    } finally {
      setLoading(false);
      topLoader.done();
    }
  }

  if (step === 2 && clientSecret && formValues) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Payment method</h3>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <PaymentStep
            clientSecret={clientSecret}
            formValues={formValues}
            onSuccess={() => {
              setStep(1);
              setClientSecret(null);
              setFormValues(null);
              form.reset();
            }}
            onBack={() => {
              setStep(1);
              setClientSecret(null);
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onContinue)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="planType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STARTER">Starter</SelectItem>
                  <SelectItem value="NEXT_LEVEL">Next Level</SelectItem>
                  <SelectItem value="PRO_STUDIO">Pro Studio</SelectItem>
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="planInterval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Monthly or yearly" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="promoCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promo code (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Promo code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="full" isLoading={loading}>
          Continue to payment
        </Button>
      </form>
    </Form>
  );
}

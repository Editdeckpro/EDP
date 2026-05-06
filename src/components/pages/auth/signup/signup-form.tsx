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
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios-instance";
import { signupFormSchema, SignupFormSchemaType } from "@/schemas/signup-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  PLANS,
  PlanId,
  PlanInterval,
  getPlan,
  getYearlySavingsPercent,
} from "@/lib/plans";
import { BillingToggle } from "./_parts/BillingToggle";
import { PlanCard } from "./_parts/PlanCard";
import { OrderSummary } from "./_parts/OrderSummary";
import { SecurityIcons } from "./_parts/SecurityIcons";

const stripePromise =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    : null;

const VALID_PLAN_IDS: PlanId[] = ["STARTER", "NEXT_LEVEL", "PRO_STUDIO"];
const VALID_INTERVALS: PlanInterval[] = ["monthly", "yearly"];

function parsePlanFromUrl(value: string | null): PlanId | null {
  if (!value) return null;
  const normalized = value.toUpperCase().replace(/-/g, "_") as PlanId;
  return VALID_PLAN_IDS.includes(normalized) ? normalized : null;
}

function parseIntervalFromUrl(value: string | null): PlanInterval | null {
  if (!value) return null;
  const normalized = value.toLowerCase() as PlanInterval;
  return VALID_INTERVALS.includes(normalized) ? normalized : null;
}

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
  const [cardholderName, setCardholderName] = useState(formValues.fullName);
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
          payment_method: {
            card,
            billing_details: { name: cardholderName.trim() },
          },
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
            // existing backend payload key — sourced from the renamed `fullName` form field
            username: formValues.fullName.trim(),
            email: formValues.email.trim().toLowerCase(),
            paymentMethodId,
            planType: formValues.planType,
            planInterval: formValues.planInterval,
            // TODO(backend): persist these once API supports them
            phone: formValues.phone,
            company: formValues.company,
            zipCode: formValues.zipCode,
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
        const msg =
          err.response?.data?.message || err.response?.data?.error || "Registration failed.";
        toast.error(msg);
      } finally {
        setLoading(false);
        topLoader.done();
      }
    },
    [stripe, elements, clientSecret, formValues, cardholderName, onSuccess, topLoader]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <p className="mb-3 text-sm font-medium">Card details</p>
        <div className="mb-3 grid gap-2">
          <Label htmlFor="cardholderName">Cardholder name</Label>
          <Input
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Name on card"
          />
        </div>
        <div className="rounded-md border border-white/15 bg-white p-4">
          <CardElement
            onChange={(e: { complete: boolean }) => setCardComplete(e.complete)}
            options={{
              style: {
                base: { fontSize: "16px" },
              },
            }}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !cardComplete || loading || cardholderName.trim().length === 0}
          className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 text-white hover:opacity-90"
        >
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

  const planFromUrl = parsePlanFromUrl(searchParams.get("plan"));
  const intervalFromUrl = parseIntervalFromUrl(searchParams.get("interval"));
  const promoFromUrl = searchParams.get("promo") || "";

  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      zipCode: "",
      planType: planFromUrl ?? "NEXT_LEVEL",
      planInterval: intervalFromUrl ?? "monthly",
      promoCode: promoFromUrl,
    },
  });

  // Sync URL changes after mount (e.g. user navigates back with new params)
  useEffect(() => {
    if (planFromUrl) form.setValue("planType", planFromUrl);
    if (intervalFromUrl) form.setValue("planInterval", intervalFromUrl);
    if (promoFromUrl) form.setValue("promoCode", promoFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planFromUrl, intervalFromUrl, promoFromUrl]);

  const watchedPlanType = form.watch("planType");
  const watchedInterval = form.watch("planInterval");
  const watchedPromo = form.watch("promoCode");

  const selectedPlan = useMemo(
    () => (watchedPlanType ? getPlan(watchedPlanType) : getPlan("NEXT_LEVEL")),
    [watchedPlanType]
  );
  const popularPlan = useMemo(() => PLANS.find((p) => p.isPopular) ?? PLANS[0], []);
  const yearlySavings = useMemo(
    () => getYearlySavingsPercent(popularPlan),
    [popularPlan]
  );

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
      const { data } = await axiosInstance.post<{ clientSecret: string }>(
        "create-setup-intent",
        {
          customer_email: email,
          plan_type: planType,
          plan_interval: planInterval,
        }
      );
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
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Payment method</h1>
          <p className="mt-2 text-white/60">
            Enter your card to complete signup. We&apos;ll email you a link to set your
            password.
          </p>
        </div>
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
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Choose your plan and enter your details. We&apos;ll email you a link to set your
          password.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <BillingToggle
          value={watchedInterval ?? "monthly"}
          onChange={(interval) => form.setValue("planInterval", interval)}
          yearlySavingsPercent={yearlySavings}
        />
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            interval={watchedInterval ?? "monthly"}
            selected={watchedPlanType === plan.id}
            onSelect={(id) => form.setValue("planType", id)}
          />
        ))}
      </div>

      <Form {...form}>
        <form
          className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
          onSubmit={form.handleSubmit(onContinue)}
        >
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your details</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
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
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company / Artist name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your label or stage name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip code</FormLabel>
                    <FormControl>
                      <Input placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
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
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/70">
              Trusted by 1,000+ artists, managers &amp; labels
            </div>

            <Button
              type="submit"
              size="full"
              isLoading={loading}
              className="bg-gradient-to-r from-amber-500 to-red-500 text-white hover:opacity-90 h-12 text-base font-semibold"
            >
              Start your free trial
            </Button>

            <SecurityIcons />

            <p className="text-center text-sm text-white/60">
              Already have an account?{" "}
              <a href="/login" className="font-medium text-white underline hover:opacity-80">
                Log in
              </a>
            </p>
          </div>

          <OrderSummary
            plan={selectedPlan}
            interval={watchedInterval ?? "monthly"}
            promoCode={watchedPromo}
          />
        </form>
      </Form>
    </div>
  );
}

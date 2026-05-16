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
import { useEffect, useMemo, useState } from "react";
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

export default function SignupForm() {
  return (
    <Elements stripe={stripePromise}>
      <SignupFormInner />
    </Elements>
  );
}

function SignupFormInner() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
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

  useEffect(() => {
    if (planFromUrl) form.setValue("planType", planFromUrl);
    if (intervalFromUrl) form.setValue("planInterval", intervalFromUrl);
    if (promoFromUrl) form.setValue("promoCode", promoFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planFromUrl, intervalFromUrl, promoFromUrl]);

  const watchedPlanType = form.watch("planType");
  const watchedInterval = form.watch("planInterval");
  const watchedPromo = form.watch("promoCode");
  const watchedFullName = form.watch("fullName");

  useEffect(() => {
    if (!cardholderName && watchedFullName) {
      setCardholderName(watchedFullName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFullName]);

  const selectedPlan = useMemo(
    () => (watchedPlanType ? getPlan(watchedPlanType) : getPlan("NEXT_LEVEL")),
    [watchedPlanType]
  );
  const popularPlan = useMemo(() => PLANS.find((p) => p.isPopular) ?? PLANS[0], []);
  const yearlySavings = useMemo(
    () => getYearlySavingsPercent(popularPlan),
    [popularPlan]
  );

  async function onSubmit(values: SignupFormSchemaType) {
    if (!stripe || !elements) {
      toast.error("Payment is still loading. Please wait a moment.");
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      toast.error("Card details are required.");
      return;
    }
    if (!cardComplete) {
      toast.error("Please complete your card details.");
      return;
    }
    if (cardholderName.trim().length === 0) {
      toast.error("Please enter the cardholder name.");
      return;
    }

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
      if (!data?.clientSecret) {
        toast.error("Could not start payment setup.");
        return;
      }

      const { error, setupIntent } = await stripe.confirmCardSetup(data.clientSecret, {
        payment_method: {
          card,
          billing_details: { name: cardholderName.trim() },
        },
      });
      if (error) {
        toast.error(error.message || "Payment failed.");
        return;
      }
      const paymentMethodId = setupIntent?.payment_method;
      if (typeof paymentMethodId !== "string") {
        toast.error("Could not save payment method.");
        return;
      }

      const promo = values.promoCode?.trim() || undefined;
      const res = await axiosInstance.post(
        `auth/register${promo ? `?promo=${encodeURIComponent(promo)}` : ""}`,
        {
          fullName: values.fullName.trim(),
          email,
          paymentMethodId,
          planType,
          planInterval,
          // TODO(backend): persist these once API supports them
          phone: values.phone,
          company: values.company,
          zipCode: values.zipCode,
          ...(promo ? { promoCode: promo } : {}),
        }
      );
      if (res.data?.success) {
        toast.success(res.data.message || "Check your email to set your password.");
        form.reset();
        setCardholderName("");
        card.clear();
        setCardComplete(false);
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
          onSubmit={form.handleSubmit(onSubmit)}
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

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/70">
              Trusted by 1,000+ artists, managers &amp; labels
            </div>

            <Button
              type="submit"
              size="full"
              isLoading={loading}
              disabled={!stripe || loading}
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

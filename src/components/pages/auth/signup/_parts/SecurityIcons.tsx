import { Lock, ShieldCheck, CreditCard } from "lucide-react";

export function SecurityIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
      <span className="flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" />
        SSL encrypted
      </span>
      <span className="flex items-center gap-1.5">
        <CreditCard className="h-3.5 w-3.5" />
        Secured by Stripe
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />
        Cancel anytime
      </span>
    </div>
  );
}

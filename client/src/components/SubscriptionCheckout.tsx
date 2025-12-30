import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/const";

// Load Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface SubscriptionCheckoutProps {
  clientSecret: string;
  productName: string;
  priceInCents: number;
  founderTier: string;
  lifetimeDiscountPercent: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({
  productName,
  priceInCents,
  founderTier,
  lifetimeDiscountPercent,
  onSuccess,
  onCancel,
}: Omit<SubscriptionCheckoutProps, "clientSecret">) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/account/subscriptions?success=true`,
        },
        redirect: "if_required",
      });

      if (submitError) {
        setError(submitError.message || "An error occurred");
        setProcessing(false);
      } else {
        setSucceeded(true);
        setProcessing(false);
        // Wait a moment to show success message
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setProcessing(false);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "founders":
        return "bg-gradient-to-r from-[var(--optibio-ivory)]0 to-[var(--optibio-ivory)]0 text-white";
      case "early_adopter":
        return "bg-gradient-to-r from-[var(--optibio-ivory)]0 to-[var(--optibio-navy)] text-white";
      case "pre_launch":
        return "bg-gradient-to-r from-[var(--optibio-ivory)]0 to-[var(--optibio-ivory)]0 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case "founders":
        return "Founder's Circle";
      case "early_adopter":
        return "Early Believer";
      case "pre_launch":
        return "Pre-Launch";
      default:
        return "Regular";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Subscription Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Subscription Summary</CardTitle>
          <CardDescription>Review your subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Product</span>
            <span className="font-semibold text-slate-900">{productName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Founder Tier</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getTierBadgeColor(
                founderTier
              )}`}
            >
              {getTierName(founderTier)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600">Lifetime Discount</span>
            <span className="font-semibold text-[var(--optibio-gold-dark)]">
              {lifetimeDiscountPercent}% off forever
            </span>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-slate-900">Monthly Price</span>
              <span className="font-bold text-[var(--optibio-navy)]">
                {formatPrice(priceInCents)}/month
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Billed monthly • Cancel anytime
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Element */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Payment Method</CardTitle>
          <CardDescription>Enter your payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {succeeded && (
        <Alert className="border-[var(--optibio-gold)]/20 bg-[var(--optibio-ivory)]">
          <CheckCircle2 className="h-4 w-4 text-[var(--optibio-gold-dark)]" />
          <AlertDescription className="text-[var(--optibio-navy)]">
            Subscription created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={processing || succeeded}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing || succeeded}
          className="flex-1"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : succeeded ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Success!
            </>
          ) : (
            `Subscribe for ${formatPrice(priceInCents)}/month`
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-slate-500">
        By subscribing, you agree to our Terms of Service and Privacy Policy.
        Your subscription will renew automatically each month.
      </p>
    </form>
  );
}

export default function SubscriptionCheckout(props: SubscriptionCheckoutProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "var(--optibio-electric)",
        colorBackground: "var(--optibio-white)",
        colorText: "#1e293b",
        colorDanger: "#dc2626",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Complete Your Subscription
        </h1>
        <p className="text-lg text-slate-600">
          You're just one step away from your monthly wellness routine
        </p>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm {...props} />
      </Elements>
    </div>
  );
}

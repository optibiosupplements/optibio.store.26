import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Loader2, 
  CheckCircle2, 
  CreditCard, 
  Lock, 
  Truck,
  User,
  MapPin,
  Shield,
  ArrowLeft,
  ArrowRight,
  Gift,
} from "lucide-react";
import { formatPrice, SHIPPING_THRESHOLD_CENTS, STANDARD_SHIPPING_CENTS, TAX_RATE } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [useReferralCredits, setUseReferralCredits] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<{
    clientSecret: string;
    productName: string;
    priceInCents: number;
    founderTier: string;
    lifetimeDiscountPercent: number;
  } | null>(null);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const { data: cartItems, isLoading } = trpc.cart.get.useQuery();
  const { data: referralStats } = trpc.referral.getMyReferralStats.useQuery();
  const utils = trpc.useUtils();

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      utils.cart.get.invalidate();
      toast.success("Order placed successfully!");
      setLocation(`/order-confirmation/${data.orderId}`);
    },
    onError: () => {
      toast.error("Failed to place order");
    },
  });

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (item.priceInCents * item.quantity);
  }, 0) || 0;

  const shipping = subtotal >= SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
  const tax = Math.round(subtotal * TAX_RATE);
  const subtotalWithShippingAndTax = subtotal + shipping + tax;
  
  // Apply referral credits
  const availableCredits = Number(referralStats?.availableCredits || 0);
  const creditsToApply = useReferralCredits ? Math.min(availableCredits, subtotalWithShippingAndTax) : 0;
  const total = subtotalWithShippingAndTax - creditsToApply;

  const handleShippingChange = (field: string, value: string) => {
    setShippingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: string, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinueToPayment = () => {
    // Validate shipping form
    if (!shippingData.firstName || !shippingData.lastName || !shippingData.email ||
        !shippingData.address1 || !shippingData.city || !shippingData.state || !shippingData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
  };

  const createCheckoutMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error("Failed to create checkout session: " + error.message);
    },
  });

  const createSubscriptionMutation = trpc.stripe.createSubscription.useMutation({
    onSuccess: (data) => {
      if (data.clientSecret) {
        // Show Stripe Elements payment confirmation
        const subscriptionItem = cartItems?.find(item => item.isSubscription);
        if (subscriptionItem) {
          setSubscriptionData({
            clientSecret: data.clientSecret,
            productName: subscriptionItem.productName || "Optibio Ashwagandha KSM-66",
            priceInCents: subscriptionItem.priceInCents,
            founderTier: "founders", // Will be calculated based on cart total
            lifetimeDiscountPercent: 25, // Will be calculated
          });
        }
      }
    },
    onError: (error) => {
      toast.error("Failed to create subscription: " + error.message);
    },
  });

  const handlePlaceOrder = () => {
    // Check if this is a subscription order
    const hasSubscription = cartItems?.some(item => item.isSubscription);

    if (hasSubscription) {
      // Handle subscription checkout
      // Calculate founder tier based on cart total
      let founderTier: "founders" | "early_adopter" | "pre_launch" | "regular" = "regular";
      let lifetimeDiscountPercent = 0;

      if (subtotal >= 6900) { // $69+
        founderTier = "founders";
        lifetimeDiscountPercent = 25;
      } else if (subtotal >= 4900) { // $49-$68
        founderTier = "early_adopter";
        lifetimeDiscountPercent = 15;
      } else if (subtotal >= 1) { // Any purchase
        founderTier = "pre_launch";
        lifetimeDiscountPercent = 10;
      }

      // For now, handle single subscription item
      const subscriptionItem = cartItems?.find(item => item.isSubscription);
      if (!subscriptionItem) {
        toast.error("No subscription item found");
        return;
      }

      // Calculate subscription price with founder discount
      const basePrice = subscriptionItem.priceInCents;
      const discountedPrice = Math.round(basePrice * (1 - lifetimeDiscountPercent / 100));

      toast.info("Creating your subscription...");
      createSubscriptionMutation.mutate({
        productId: subscriptionItem.productId,
        variantId: subscriptionItem.variantId || undefined,
        planId: subscriptionItem.subscriptionPlanId || 1,
        priceInCents: discountedPrice,
        founderTier,
        lifetimeDiscountPercent,
      });
    } else {
      // Handle one-time purchase
      const orderItems = cartItems?.map(item => ({
        productId: item.productId,
        productName: item.productName || "Optibio Ashwagandha KSM-66",
        variantId: item.variantId || undefined,
        variantName: item.variantName || undefined,
        quantity: item.quantity,
        priceInCents: item.priceInCents,
      })) || [];

      toast.info("Redirecting to secure checkout...");
      createCheckoutMutation.mutate({
        items: orderItems,
        creditsToApply: creditsToApply,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient transition-colors duration-500 dark:bg-[#0B1120] dark:bg-[#0B1120]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  // Show Stripe Elements payment confirmation for subscriptions
  if (subscriptionData) {
    return (
      <div className="min-h-screen py-12 md:py-16 bg-hero-gradient transition-colors duration-500 dark:bg-[#0B1120]">
        <div className="container">
          <SubscriptionCheckout
            {...subscriptionData}
            onSuccess={() => {
              setLocation("/account/subscriptions?success=true");
            }}
            onCancel={() => {
              setSubscriptionData(null);
              toast.info("Subscription cancelled");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16 bg-hero-gradient transition-colors duration-500 dark:bg-[#0B1120]">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Secure Checkout</h1>
          <p className="text-lg text-muted-foreground">Complete your order in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            {[
              { num: 1, label: "Shipping", icon: Truck },
              { num: 2, label: "Payment", icon: CreditCard },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      step >= s.num
                        ? "bg-gradient-to-br from-[#1E3A5F] to-[#1E3A5F] border-[#1E3A5F] text-white shadow-lg"
                        : "bg-white dark:bg-[#1E3A5F] border-slate-300 text-slate-400"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <s.icon className="w-7 h-7" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-semibold ${
                      step >= s.num ? "text-[#1E3A5F]" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 1 && (
                  <div
                    className={`w-24 h-1 mx-4 transition-all duration-300 ${
                      step > s.num ? "bg-[#1E3A5F]" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <Card className="border-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center">
                      <Truck className="w-6 h-6 text-[#1E3A5F]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Shipping Information</h2>
                      <p className="text-slate-600 dark:text-slate-300">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700 dark:text-slate-200 font-semibold">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingData.firstName}
                        onChange={(e) => handleShippingChange("firstName", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700 dark:text-slate-200 font-semibold">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingData.lastName}
                        onChange={(e) => handleShippingChange("lastName", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-700 dark:text-slate-200 font-semibold">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => handleShippingChange("email", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-slate-700 dark:text-slate-200 font-semibold">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address1" className="text-slate-700 dark:text-slate-200 font-semibold">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      value={shippingData.address1}
                      onChange={(e) => handleShippingChange("address1", e.target.value)}
                      className="mt-1.5 border-2 h-12"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2" className="text-slate-700 dark:text-slate-200 font-semibold">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={shippingData.address2}
                      onChange={(e) => handleShippingChange("address2", e.target.value)}
                      className="mt-1.5 border-2 h-12"
                      placeholder="Apt, Suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-slate-700 dark:text-slate-200 font-semibold">City *</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-slate-700 dark:text-slate-200 font-semibold">State *</Label>
                      <Select value={shippingData.state} onValueChange={(value) => handleShippingChange("state", value)}>
                        <SelectTrigger className="mt-1.5 border-2 h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-slate-700 dark:text-slate-200 font-semibold">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingData.zipCode}
                        onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="10001"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setLocation("/cart")}
                      className="border-2"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back to Cart
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleContinueToPayment}
                      className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg"
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Billing Address */}
                <Card className="border-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-[#1E3A5F]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing Address</h2>
                        <p className="text-slate-600 dark:text-slate-300">Where should we send the invoice?</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 dark:border-[#2D4A77]">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="sameAsShipping" className="text-slate-900 dark:text-white font-medium cursor-pointer">
                        Same as shipping address
                      </Label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-700 dark:text-slate-200 font-semibold">First Name *</Label>
                            <Input
                              value={billingData.firstName}
                              onChange={(e) => handleBillingChange("firstName", e.target.value)}
                              className="mt-1.5 border-2 h-12"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-700 dark:text-slate-200 font-semibold">Last Name *</Label>
                            <Input
                              value={billingData.lastName}
                              onChange={(e) => handleBillingChange("lastName", e.target.value)}
                              className="mt-1.5 border-2 h-12"
                            />
                          </div>
                        </div>
                        {/* Add more billing fields as needed */}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-[#1E3A5F]" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Method</h2>
                        <p className="text-slate-600 dark:text-slate-300">Your payment information is secure</p>
                      </div>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30 text-center space-y-3">
                      <Lock className="w-12 h-12 mx-auto text-[#1E3A5F]" />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Payment with Stripe</h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        Click "Proceed to Payment" to complete your purchase securely through Stripe.
                        <br />
                        You'll be redirected to our secure payment page.
                      </p>
                      <div className="flex items-center justify-center gap-4 pt-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F4EF] border-2 border-[#C9A961]/20">
                      <Shield className="w-6 h-6 text-[#C9A961] flex-shrink-0" />
                      <div className="text-sm text-[#1E3A5F]">
                        <strong>Secure Checkout:</strong> Your payment information is encrypted with 256-bit SSL security
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(1)}
                        className="border-2"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Shipping
                      </Button>
                      <Button
                        size="lg"
                        onClick={handlePlaceOrder}
                        disabled={createCheckoutMutation.isPending}
                        className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg"
                      >
                        {createCheckoutMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-5 w-5" />
                            Proceed to Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Summary</h3>

                  {/* Cart Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] flex-shrink-0">
                          <img
                            src={item.productImage || "/bottlemockbluegold_beigebg.png"}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{item.productName}</h4>
                          {item.variantName && (
                            <p className="text-xs text-slate-600 dark:text-slate-300">{item.variantName}</p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-600 dark:text-slate-300">Qty: {item.quantity}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(item.priceInCents * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] pt-4 space-y-3">
                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-[#C9A961]">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Tax</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>

                    {/* Referral Credits Toggle */}
                    {availableCredits > 0 && (
                      <div className="pt-3 border-t border-slate-200 dark:border-[#2D4A77]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="use-credits"
                              checked={useReferralCredits}
                              onCheckedChange={(checked) => setUseReferralCredits(checked as boolean)}
                            />
                            <Label
                              htmlFor="use-credits"
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <Gift className="w-4 h-4 text-[#C9A961]" />
                              Use Referral Credits
                            </Label>
                          </div>
                        </div>
                        <div className="ml-6 text-xs text-slate-600 dark:text-slate-300">
                          {formatPrice(availableCredits)} available
                        </div>
                      </div>
                    )}

                    {/* Credits Applied */}
                    {creditsToApply > 0 && (
                      <div className="flex justify-between text-[#C9A961] font-semibold">
                        <span>Credits Applied</span>
                        <span>-{formatPrice(creditsToApply)}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t-2 border-slate-200 dark:border-[#2D4A77]">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
                        <div className="text-3xl font-bold bg-gradient-to-r from-[#1E3A5F] to-[#B89651] bg-clip-text text-transparent">
                          {formatPrice(total)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 dark:border-[#2D4A77] dark:border-[#2D4A77] space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Shield className="w-4 h-4 text-[#1E3A5F]" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#1E3A5F]" />
                      <span>60-day money-back guarantee</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

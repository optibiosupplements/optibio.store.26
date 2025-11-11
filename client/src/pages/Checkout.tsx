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
} from "lucide-react";
import { formatPrice, SHIPPING_THRESHOLD_CENTS, STANDARD_SHIPPING_CENTS, TAX_RATE } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
  const total = subtotal + shipping + tax;

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

  const handlePlaceOrder = () => {
    // Create Stripe checkout session
    const orderItems = cartItems?.map(item => ({
      productId: item.productId,
      productName: item.productName || "OptiBio Ashwagandha KSM-66",
      variantId: item.variantId || undefined,
      variantName: item.variantName || undefined,
      quantity: item.quantity,
      priceInCents: item.priceInCents,
    })) || [];

    toast.info("Redirecting to secure checkout...");
    createCheckoutMutation.mutate({
      items: orderItems,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-700" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12 md:py-16">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Secure Checkout</h1>
          <p className="text-lg text-slate-600">Complete your order in just a few steps</p>
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
                        ? "bg-gradient-to-br from-blue-700 to-blue-600 border-blue-700 text-white shadow-lg"
                        : "bg-white border-slate-300 text-slate-400"
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
                      step >= s.num ? "text-blue-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < 1 && (
                  <div
                    className={`w-24 h-1 mx-4 transition-all duration-300 ${
                      step > s.num ? "bg-blue-700" : "bg-slate-300"
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
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Shipping Information</h2>
                      <p className="text-slate-600">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-slate-700 font-semibold">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingData.firstName}
                        onChange={(e) => handleShippingChange("firstName", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-slate-700 font-semibold">Last Name *</Label>
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
                      <Label htmlFor="email" className="text-slate-700 font-semibold">Email *</Label>
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
                      <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone</Label>
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
                    <Label htmlFor="address1" className="text-slate-700 font-semibold">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      value={shippingData.address1}
                      onChange={(e) => handleShippingChange("address1", e.target.value)}
                      className="mt-1.5 border-2 h-12"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2" className="text-slate-700 font-semibold">Address Line 2</Label>
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
                      <Label htmlFor="city" className="text-slate-700 font-semibold">City *</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) => handleShippingChange("city", e.target.value)}
                        className="mt-1.5 border-2 h-12"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-slate-700 font-semibold">State *</Label>
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
                      <Label htmlFor="zipCode" className="text-slate-700 font-semibold">ZIP Code *</Label>
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
                      className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg"
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
                <Card className="border-2 border-slate-200 shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Billing Address</h2>
                        <p className="text-slate-600">Where should we send the invoice?</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                      <Checkbox
                        id="sameAsShipping"
                        checked={sameAsShipping}
                        onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                      />
                      <Label htmlFor="sameAsShipping" className="text-slate-900 font-medium cursor-pointer">
                        Same as shipping address
                      </Label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-4 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-700 font-semibold">First Name *</Label>
                            <Input
                              value={billingData.firstName}
                              onChange={(e) => handleBillingChange("firstName", e.target.value)}
                              className="mt-1.5 border-2 h-12"
                            />
                          </div>
                          <div>
                            <Label className="text-slate-700 font-semibold">Last Name *</Label>
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
                <Card className="border-2 border-slate-200 shadow-xl">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
                        <p className="text-slate-600">Your payment information is secure</p>
                      </div>
                    </div>

                    <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 text-center space-y-3">
                      <Lock className="w-12 h-12 mx-auto text-blue-700" />
                      <h3 className="text-xl font-bold text-slate-900">Secure Payment with Stripe</h3>
                      <p className="text-slate-600">
                        Click "Proceed to Payment" to complete your purchase securely through Stripe.
                        <br />
                        You'll be redirected to our secure payment page.
                      </p>
                      <div className="flex items-center justify-center gap-4 pt-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <Shield className="w-6 h-6 text-green-700 flex-shrink-0" />
                      <div className="text-sm text-green-900">
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
                        className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg"
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
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>

                  {/* Cart Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200 flex-shrink-0">
                          <img
                            src={item.productImage || "/products/optibio-90cap-bottle-front.jpg"}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-slate-900">{item.productName}</h4>
                          {item.variantName && (
                            <p className="text-xs text-slate-600">{item.variantName}</p>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-slate-600">Qty: {item.quantity}</span>
                            <span className="font-semibold text-slate-900">{formatPrice(item.priceInCents * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-slate-200 pt-4 space-y-3">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-700">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Tax</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>
                    <div className="pt-3 border-t-2 border-slate-200">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                          {formatPrice(total)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
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

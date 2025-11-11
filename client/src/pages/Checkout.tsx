import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, CheckCircle2, CreditCard, Lock } from "lucide-react";
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

  const handlePlaceOrder = () => {
    // In a real app, this would process payment first
    const orderItems = cartItems?.map(item => ({
      productId: item.productId,
      variantId: item.variantId || undefined,
      productName: item.productName || "OptiBio Ashwagandha KSM-66",
      variantName: item.variantName || undefined,
      quantity: item.quantity,
      priceInCents: item.priceInCents,
    })) || [];

    createOrderMutation.mutate({
      shippingAddress: shippingData,
      billingAddress: sameAsShipping ? shippingData : billingData,
      items: orderItems,
      subtotalInCents: subtotal,
      shippingInCents: shipping,
      taxInCents: tax,
      discountInCents: 0,
      totalInCents: total,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Page Header */}
      <section className="bg-background border-b">
        <div className="container py-8">
          <h1 className="text-3xl md:text-4xl font-bold">Secure Checkout</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className="h-px flex-1 bg-border max-w-[100px]" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={shippingData.firstName}
                          onChange={(e) => handleShippingChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={shippingData.lastName}
                          onChange={(e) => handleShippingChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => handleShippingChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address1">Address *</Label>
                      <Input
                        id="address1"
                        value={shippingData.address1}
                        onChange={(e) => handleShippingChange("address1", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="address2"
                        value={shippingData.address2}
                        onChange={(e) => handleShippingChange("address2", e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => handleShippingChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select value={shippingData.state} onValueChange={(value) => handleShippingChange("state", value)}>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingData.zipCode}
                          onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button size="lg" className="w-full" onClick={handleContinueToPayment}>
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsShipping"
                          checked={sameAsShipping}
                          onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                        />
                        <Label htmlFor="sameAsShipping" className="cursor-pointer">
                          Same as shipping address
                        </Label>
                      </div>

                      {!sameAsShipping && (
                        <div className="space-y-4 pt-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>First Name *</Label>
                              <Input
                                value={billingData.firstName}
                                onChange={(e) => handleBillingChange("firstName", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Last Name *</Label>
                              <Input
                                value={billingData.lastName}
                                onChange={(e) => handleBillingChange("lastName", e.target.value)}
                              />
                            </div>
                          </div>
                          {/* Add similar fields as shipping */}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 border border-dashed rounded-lg p-8 text-center">
                        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="font-semibold mb-2">Payment Integration Placeholder</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect Stripe, Authorize.net, or your preferred payment gateway
                        </p>
                        <p className="text-xs text-muted-foreground">
                          For demo purposes, clicking "Place Order" will create the order without payment processing
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                          Back to Shipping
                        </Button>
                        <Button
                          size="lg"
                          className="flex-1"
                          onClick={handlePlaceOrder}
                          disabled={createOrderMutation.isPending}
                        >
                          {createOrderMutation.isPending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="h-5 w-5 mr-2" />
                              Place Order
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded bg-muted flex-shrink-0">
                          <img
                            src="/products/ashwagandha-bottle.jpg"
                            alt="Product"
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">OptiBio Ashwagandha</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatPrice(item.priceInCents * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3 text-center space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3" />
                      Secure 256-bit SSL encryption
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      60-day money-back guarantee
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

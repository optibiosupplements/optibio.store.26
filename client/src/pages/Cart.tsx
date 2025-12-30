import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { formatPrice, SHIPPING_THRESHOLD_CENTS, STANDARD_SHIPPING_CENTS, TAX_RATE } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Cart() {
  const [, setLocation] = useLocation();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);

  const { data: cartItems, isLoading } = trpc.cart.get.useQuery();
  const utils = trpc.useUtils();

  const updateCartMutation = trpc.cart.update.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
    },
  });

  const removeCartMutation = trpc.cart.remove.useMutation({
    onSuccess: () => {
      utils.cart.get.invalidate();
      toast.success("Item removed from cart");
    },
  });

  const { data: discountValidation } = trpc.discounts.validate.useQuery(
    { code: discountCode },
    { enabled: discountCode.length > 0 }
  );

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeCartMutation.mutate({ id: itemId });
  };

  const handleApplyDiscount = () => {
    if (discountValidation?.valid && discountValidation.code) {
      setAppliedDiscount(discountValidation.code);
      toast.success("Discount code applied!");
    } else {
      toast.error(discountValidation?.message || "Invalid discount code");
    }
  };

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => {
    return sum + (item.priceInCents * item.quantity);
  }, 0) || 0;

  const shipping = subtotal >= SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS;
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.discountType === "percentage") {
      discountAmount = Math.round(subtotal * (appliedDiscount.discountValue / 100));
    } else {
      discountAmount = appliedDiscount.discountValue;
    }
  }

  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = Math.round(subtotalAfterDiscount * TAX_RATE);
  const total = subtotalAfterDiscount + shipping + tax;

  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD_CENTS) * 100, 100);
  const amountToFreeShipping = Math.max(SHIPPING_THRESHOLD_CENTS - subtotal, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient transition-colors duration-500 dark:bg-[var(--optibio-abyssal)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient transition-colors duration-500">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--optibio-gold)]/10 to-[var(--optibio-gold)]/10 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-lg text-muted-foreground">Discover our premium KSM-66 Ashwagandha</p>
          </div>
          <Link href="/shop">
            <Button size="lg" className="bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-navy)] hover:from-[var(--optibio-navy-dark)] hover:to-[var(--optibio-navy-dark)] shadow-lg">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-16 bg-hero-gradient transition-colors duration-500">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-lg text-muted-foreground">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            {shipping > 0 && (
              <Card className="border-2 border-[var(--optibio-gold)]/30 bg-gradient-to-br from-[var(--optibio-ivory)] to-white transition-colors duration-500">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">
                        {amountToFreeShipping > 0 
                          ? `Add ${formatPrice(amountToFreeShipping)} more for FREE shipping!`
                          : "You've unlocked FREE shipping!"
                        }
                      </span>
                    </div>
                    <span className="text-sm font-medium text-primary">{Math.round(shippingProgress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden transition-colors duration-500">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-ivory)]0 transition-all duration-500 rounded-full"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-2 border-slate-200 dark:border-[var(--optibio-border-dark)] dark:border-[var(--optibio-border-dark)] hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 dark:border-[var(--optibio-border-dark)]">
                          <img
                            src={item.productImage || "/products/optibio-90cap-bottle-front.jpg"}
                            alt={item.productName || "Product"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link href={`/product/${item.productSlug}`}>
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-[var(--optibio-navy)] transition-colors cursor-pointer">
                                {item.productName}
                              </h3>
                            </Link>
                            {item.variantName && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">{item.variantName}</p>
                            )}
                            {item.isSubscription && (
                              <Badge className="mt-2 bg-[var(--optibio-gold)]/10 text-[var(--optibio-navy)] border-[var(--optibio-gold)]/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Subscription
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900 dark:text-white">
                              {formatPrice(item.priceInCents)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-300">per item</div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border-2 border-slate-200 dark:border-[var(--optibio-border-dark)] dark:border-[var(--optibio-border-dark)] rounded-xl overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updateCartMutation.isPending}
                              className="h-10 w-10 rounded-none hover:bg-slate-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <div className="w-12 text-center font-semibold text-slate-900 dark:text-white">
                              {item.quantity}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateCartMutation.isPending}
                              className="h-10 w-10 rounded-none hover:bg-slate-100"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-slate-600 dark:text-slate-300">Subtotal</div>
                              <div className="text-xl font-bold text-slate-900 dark:text-white">
                                {formatPrice(item.priceInCents * item.quantity)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeCartMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Shopping */}
            <Link href="/shop">
              <Button variant="outline" size="lg" className="w-full border-2 hover:bg-slate-50">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Discount Code */}
              <Card className="border-2 border-slate-200 dark:border-[var(--optibio-border-dark)]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[var(--optibio-navy)]" />
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Discount Code</h3>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="p-4 rounded-xl bg-[var(--optibio-gold)]/10 border-2 border-[var(--optibio-gold)]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[var(--optibio-gold)]" />
                          <div>
                            <div className="font-semibold text-[var(--optibio-navy)]">{appliedDiscount.code}</div>
                            <div className="text-sm text-[var(--optibio-navy)]/70">
                              {appliedDiscount.discountType === "percentage" 
                                ? `${appliedDiscount.discountValue}% off`
                                : `${formatPrice(appliedDiscount.discountValue)} off`
                              }
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAppliedDiscount(null)}
                          className="text-[var(--optibio-navy)] hover:text-[var(--optibio-navy)]/80"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="border-2"
                      />
                      <Button
                        onClick={handleApplyDiscount}
                        disabled={!discountCode || !discountValidation?.valid}
                        className="bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-navy)] hover:from-[var(--optibio-navy-dark)] hover:to-[var(--optibio-navy-dark)]"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border-2 border-slate-200 dark:border-[var(--optibio-border-dark)] dark:border-[var(--optibio-border-dark)] shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[var(--optibio-gold)]">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-[var(--optibio-gold)]">FREE</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700 dark:text-slate-200">
                      <span>Tax</span>
                      <span className="font-semibold">{formatPrice(tax)}</span>
                    </div>

                    <div className="pt-3 border-t-2 border-slate-200 dark:border-[var(--optibio-border-dark)]">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-gold-dark)] bg-clip-text text-transparent">
                            {formatPrice(total)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-300">or 4 payments of {formatPrice(Math.round(total / 4))}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setLocation("/checkout")}
                    className="w-full bg-gradient-to-r from-[var(--optibio-navy)] to-[var(--optibio-navy)] hover:from-[var(--optibio-navy-dark)] hover:to-[var(--optibio-navy-dark)] shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 dark:border-[var(--optibio-border-dark)] dark:border-[var(--optibio-border-dark)] space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <Shield className="w-5 h-5 text-[var(--optibio-navy)] flex-shrink-0" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <RotateCcw className="w-5 h-5 text-[var(--optibio-navy)] flex-shrink-0" />
                      <span>60-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <Truck className="w-5 h-5 text-[var(--optibio-navy)] flex-shrink-0" />
                      <span>Free shipping on orders over {formatPrice(SHIPPING_THRESHOLD_CENTS)}</span>
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

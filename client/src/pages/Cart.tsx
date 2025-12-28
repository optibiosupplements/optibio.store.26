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
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient transition-colors duration-500">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient transition-colors duration-500">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#C9A961]/10 to-[#C9A961]/10 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-lg text-muted-foreground">Discover our premium KSM-66 Ashwagandha</p>
          </div>
          <Link href="/shop">
            <Button size="lg" className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg">
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
              <Card className="border-2 border-[#C9A961]/30 dark:border-[#C9A961]/50 bg-gradient-to-br from-[#F7F4EF] to-white dark:from-card dark:to-card/80 transition-colors duration-500">
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
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-500">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1E3A5F] to-[#F7F4EF]0 transition-all duration-500 rounded-full"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-2 border-slate-200 dark:border-border hover:shadow-lg dark:hover:shadow-[#C9A961]/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
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
                              <h3 className="font-bold text-lg text-slate-900 hover:text-[#1E3A5F] transition-colors cursor-pointer">
                                {item.productName}
                              </h3>
                            </Link>
                            {item.variantName && (
                              <p className="text-sm text-slate-600">{item.variantName}</p>
                            )}
                            {item.isSubscription && (
                              <Badge className="mt-2 bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Subscription
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-900">
                              {formatPrice(item.priceInCents)}
                            </div>
                            <div className="text-sm text-slate-600">per item</div>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updateCartMutation.isPending}
                              className="h-10 w-10 rounded-none hover:bg-slate-100"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <div className="w-12 text-center font-semibold text-slate-900">
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
                              <div className="text-sm text-slate-600">Subtotal</div>
                              <div className="text-xl font-bold text-slate-900">
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
              <Card className="border-2 border-slate-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#1E3A5F]" />
                    <h3 className="font-bold text-lg text-slate-900">Discount Code</h3>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="p-4 rounded-xl bg-[#C9A961]/10 border-2 border-[#C9A961]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />
                          <div>
                            <div className="font-semibold text-[#1E3A5F]">{appliedDiscount.code}</div>
                            <div className="text-sm text-[#1E3A5F]/70">
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
                          className="text-[#1E3A5F] hover:text-[#1E3A5F]/80"
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
                        className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45]"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="border-2 border-slate-200 shadow-xl">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-xl text-slate-900">Order Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#C9A961]">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-[#C9A961]">FREE</span>
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
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-[#1E3A5F] to-[#B89651] bg-clip-text text-transparent">
                            {formatPrice(total)}
                          </div>
                          <div className="text-xs text-slate-600">or 4 payments of {formatPrice(Math.round(total / 4))}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => setLocation("/checkout")}
                    className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Shield className="w-5 h-5 text-[#1E3A5F] flex-shrink-0" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <RotateCcw className="w-5 h-5 text-[#1E3A5F] flex-shrink-0" />
                      <span>60-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Truck className="w-5 h-5 text-[#1E3A5F] flex-shrink-0" />
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

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-700" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-blue-700" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Your cart is empty</h2>
            <p className="text-lg text-slate-600">Discover our premium KSM-66 Ashwagandha</p>
          </div>
          <Link href="/shop">
            <Button size="lg" className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
          <p className="text-lg text-slate-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free Shipping Progress */}
            {shipping > 0 && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-700" />
                      <span className="font-semibold text-slate-900">
                        {amountToFreeShipping > 0 
                          ? `Add ${formatPrice(amountToFreeShipping)} more for FREE shipping!`
                          : "You've unlocked FREE shipping!"
                        }
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-700">{Math.round(shippingProgress)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-500 rounded-full"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-2 border-slate-200 hover:shadow-lg transition-shadow duration-300">
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
                              <h3 className="font-bold text-lg text-slate-900 hover:text-blue-700 transition-colors cursor-pointer">
                                {item.productName}
                              </h3>
                            </Link>
                            {item.variantName && (
                              <p className="text-sm text-slate-600">{item.variantName}</p>
                            )}
                            {item.isSubscription && (
                              <Badge className="mt-2 bg-amber-100 text-amber-900 border-amber-300">
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
                    <Tag className="w-5 h-5 text-blue-700" />
                    <h3 className="font-bold text-lg text-slate-900">Discount Code</h3>
                  </div>
                  
                  {appliedDiscount ? (
                    <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-700" />
                          <div>
                            <div className="font-semibold text-green-900">{appliedDiscount.code}</div>
                            <div className="text-sm text-green-700">
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
                          className="text-green-700 hover:text-green-800"
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
                        className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700"
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
                      <div className="flex justify-between text-green-700">
                        <span>Discount</span>
                        <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

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
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
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
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <RotateCcw className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>60-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
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

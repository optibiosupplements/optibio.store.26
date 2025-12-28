import { useEffect, useState } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShoppingCart, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface CartItemData {
  productName: string;
  variantName?: string;
  quantity: number;
  priceInCents: number;
  imageUrl?: string;
}

export default function CartRecover() {
  const [, params] = useRoute("/cart/recover");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [token, setToken] = useState<string>("");

  // Get token from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  // Fetch abandoned cart data
  const { data: cartData, isLoading: cartLoading, error: cartError } = trpc.abandonedCart.getByToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  // Restore cart mutation
  const restoreCartMutation = trpc.abandonedCart.restoreCart.useMutation({
    onSuccess: () => {
      toast.success("Cart restored successfully!", {
        description: "Redirecting to checkout...",
      });
      setTimeout(() => {
        setLocation("/checkout");
      }, 1500);
    },
    onError: (error) => {
      toast.error("Failed to restore cart", {
        description: error.message,
      });
    },
  });

  const handleRestoreCart = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = getLoginUrl();
      return;
    }

    if (token) {
      restoreCartMutation.mutate({ token });
    }
  };

  // Loading state
  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EF]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#C9A961] mx-auto mb-4" />
          <p className="text-[#2D2D2D] text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EF] px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <CardTitle>Invalid Recovery Link</CardTitle>
            </div>
            <CardDescription>
              This cart recovery link is invalid or incomplete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartError || !cartData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F4EF] px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <CardTitle>Cart Not Found</CardTitle>
            </div>
            <CardDescription>
              {cartError?.message || "This cart has already been recovered or the link has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success - show cart preview
  const cartItems: CartItemData[] = cartData.cartItems || [];
  const totalValue = cartData.totalValue || 0;

  return (
    <div className="min-h-screen bg-[#F7F4EF] py-12 px-4">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A961] rounded-full mb-4">
            <ShoppingCart className="h-8 w-8 text-[#1E3A5F]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
            Welcome Back!
          </h1>
          <p className="text-[#666] text-lg">
            Your cart is ready and waiting for you
          </p>
        </div>

        {/* Cart Preview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#1E3A5F]">Your Saved Cart</CardTitle>
            <CardDescription>
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} • Saved on {new Date(cartData.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b border-[#EDE9E3] last:border-0 last:pb-0"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg bg-white"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#2D2D2D] mb-1">
                    {item.productName}
                  </h3>
                  {item.variantName && (
                    <p className="text-sm text-[#666] mb-1">{item.variantName}</p>
                  )}
                  <p className="text-sm text-[#666]">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#C9A961] text-lg">
                    ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-[#1E3A5F]">
              <span className="text-lg font-semibold text-[#2D2D2D]">Total:</span>
              <span className="text-2xl font-bold text-[#1E3A5F]">
                ${(totalValue / 100).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Reminder */}
        <Alert className="mb-6 bg-[#F7F4EF] border-[#C9A961]">
          <CheckCircle2 className="h-5 w-5 text-[#C9A961]" />
          <AlertDescription className="text-[#2D2D2D]">
            <strong className="text-[#1E3A5F]">Why Optibio?</strong><br />
            ✓ 20+ clinical studies backing KSM-66® • ✓ Third-party tested for purity<br />
            ✓ 90-day money-back guarantee • ✓ Free shipping on orders over $75
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isAuthenticated ? (
            <Button
              onClick={handleRestoreCart}
              disabled={restoreCartMutation.isPending}
              className="w-full h-14 text-lg bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#A88541] text-[#2D2D2D] font-bold"
            >
              {restoreCartMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Restoring Cart...
                </>
              ) : (
                <>
                  Restore Cart & Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          ) : (
            <>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-[#2D2D2D]">
                  Please log in to restore your cart and complete your purchase.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="w-full h-14 text-lg bg-gradient-to-r from-[#C9A961] to-[#B89651] hover:from-[#B89651] hover:to-[#A88541] text-[#2D2D2D] font-bold"
              >
                Log In to Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            asChild
            variant="outline"
            className="w-full h-12 text-base border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white"
          >
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>

        {/* Trust Signals */}
        <div className="mt-8 text-center text-sm text-[#666]">
          <p>🔒 Secure checkout • 💳 All major payment methods accepted</p>
        </div>
      </div>
    </div>
  );
}

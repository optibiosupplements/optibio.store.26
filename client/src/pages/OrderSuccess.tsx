import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { APP_LOGO } from "@/const";
import { CheckCircle2, Package, Truck, Mail, ArrowRight, Home } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  
  // Get session_id from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  // Clear cart after successful payment
  const clearCartMutation = trpc.cart.clear.useMutation();

  useEffect(() => {
    if (sessionId && user) {
      // Clear the cart since payment was successful
      clearCartMutation.mutate();
      // Show success toast
      toast.success("Order placed successfully! Check your email for confirmation.", {
        duration: 5000,
      });
    }
  }, [sessionId, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Invalid Order</h1>
            <p className="text-slate-600">No order session found. Please try again.</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt="Optibio" className="h-10 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#152B45] to-[#152B45] bg-clip-text text-transparent">
                Optibio
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Success Message */}
        <Card className="border-2 border-[#C9A961]/30 shadow-2xl mb-8">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center mx-auto border-4 border-[#C9A961]/30 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-[#C9A961]" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-slate-900">Order Confirmed!</h1>
              <p className="text-xl text-slate-600">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            {sessionId && (
              <div className="inline-block px-6 py-3 rounded-xl bg-slate-100 border-2 border-slate-200">
                <p className="text-sm text-slate-600">Order Reference</p>
                <p className="text-lg font-mono font-semibold text-slate-900">{sessionId.slice(-12).toUpperCase()}</p>
              </div>
            )}

            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F7F4EF] border-2 border-[#C9A961]/30 max-w-2xl mx-auto">
              <Mail className="w-6 h-6 text-[#1E3A5F] flex-shrink-0" />
              <p className="text-sm text-[#1E3A5F] text-left">
                <strong>Confirmation email sent!</strong> Check your inbox for order details and tracking information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="border-2 border-slate-200 shadow-xl mb-8">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">What Happens Next?</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center border-2 border-[#C9A961]/30">
                    <Package className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Order Processing</h3>
                  <p className="text-slate-600">
                    We're preparing your Optibio Ashwagandha KSM-66 for shipment. Our team ensures every bottle meets our premium quality standards.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Timeline:</strong> 1-2 business days
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center border-2 border-[#C9A961]/30">
                    <Truck className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Shipping & Delivery</h3>
                  <p className="text-slate-600">
                    Once shipped, you'll receive a tracking number via email. Most orders arrive within 3-5 business days.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Timeline:</strong> 3-5 business days after shipment
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center border-2 border-[#C9A961]/30">
                    <CheckCircle2 className="w-6 h-6 text-[#1E3A5F]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Start Your Wellness Journey</h3>
                  <p className="text-slate-600">
                    Begin taking your premium KSM-66 Ashwagandha as directed. Most customers notice benefits within 2-4 weeks of consistent use.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Recommended:</strong> Take 1-2 capsules daily with food
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Guarantee */}
        <Card className="border-2 border-slate-200 shadow-xl mb-8">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Our Quality Guarantee</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30">
                <h3 className="font-bold text-slate-900 mb-2">✓ 100% Money-Back Guarantee</h3>
                <p className="text-sm text-slate-600">
                  Not satisfied? Get a full refund within 90 days, no questions asked.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30">
                <h3 className="font-bold text-slate-900 mb-2">✓ Third-Party Tested</h3>
                <p className="text-sm text-slate-600">
                  Every batch is independently tested for purity and potency.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30">
                <h3 className="font-bold text-slate-900 mb-2">✓ Premium KSM-66®</h3>
                <p className="text-sm text-slate-600">
                  The most clinically studied ashwagandha extract with 22+ human trials.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30">
                <h3 className="font-bold text-slate-900 mb-2">✓ Made in USA</h3>
                <p className="text-sm text-slate-600">
                  Manufactured in GMP-certified facilities with strict quality controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Recommendations */}
        <Card className="border-2 border-slate-200 shadow-xl mb-8">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Complete Your Wellness Journey</h2>
              <p className="text-slate-600">Customers who bought this also loved:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recommendation 1: Larger bottle */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/30 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-slate-200 flex-shrink-0">
                    <img
                      src="/products/optibio-90cap-bottle-front.jpg"
                      alt="Optibio 180 Capsules"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Optibio Ashwagandha</h3>
                    <p className="text-sm text-slate-600">180 Capsules (3-Month Supply)</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-slate-900">$89.99</span>
                      <span className="text-sm text-[#C9A961] font-semibold">Save 18%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                    <span>3-month supply for consistent results</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                    <span>Better value - $0.50 per serving</span>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation("/product/ashwagandha-ksm66-180")}
                  className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45]"
                >
                  View Product
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Recommendation 2: Subscription */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#F7F4EF] to-white border-2 border-[#C9A961]/20 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-slate-200 flex-shrink-0">
                    <img
                      src="/products/optibio-90cap-bottle-front.jpg"
                      alt="Optibio Subscription"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-2 py-1 rounded-md bg-[#C9A961]/20 text-[#1E3A5F] text-xs font-bold mb-1">
                      BEST VALUE
                    </div>
                    <h3 className="font-bold text-slate-900">Monthly Subscription</h3>
                    <p className="text-sm text-slate-600">90 Capsules - Auto-Delivery</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-bold text-slate-900">$44.99/mo</span>
                      <span className="text-sm text-[#C9A961] font-semibold">Save 25%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                    <span>Never run out - auto-delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                    <span>Cancel or pause anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#C9A961]" />
                    <span>Free shipping on all orders</span>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation("/product/ashwagandha-ksm66-90")}
                  className="w-full bg-gradient-to-r from-[#B89651] to-[#F7F4EF]0 hover:from-[#B89651] hover:to-[#B89651]"
                >
                  Subscribe & Save
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-500">
                💡 <strong>Pro Tip:</strong> Consistent daily use for 8-12 weeks delivers the best results
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/products")}
            className="border-2"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Support */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-slate-600">
            Questions about your order?
          </p>
          <p className="text-slate-900">
            Contact us at{" "}
            <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">
              support@optibio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

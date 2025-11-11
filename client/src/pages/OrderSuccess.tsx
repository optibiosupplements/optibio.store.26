import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Package, Truck, Mail, ArrowRight, Home } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";

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
    }
  }, [sessionId, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <div className="animate-pulse text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/optibio-logo.png" alt="OptiBio" className="h-10 w-auto" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                OptiBio
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Success Message */}
        <Card className="border-2 border-green-200 shadow-2xl mb-8">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mx-auto border-4 border-green-200 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
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

            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border-2 border-blue-200 max-w-2xl mx-auto">
              <Mail className="w-6 h-6 text-blue-700 flex-shrink-0" />
              <p className="text-sm text-blue-900 text-left">
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
                    <Package className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Order Processing</h3>
                  <p className="text-slate-600">
                    We're preparing your OptiBio Ashwagandha KSM-66 for shipment. Our team ensures every bottle meets our premium quality standards.
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Timeline:</strong> 1-2 business days
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
                    <Truck className="w-6 h-6 text-blue-700" />
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
                    <CheckCircle2 className="w-6 h-6 text-blue-700" />
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
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-2">✓ 100% Money-Back Guarantee</h3>
                <p className="text-sm text-slate-600">
                  Not satisfied? Get a full refund within 90 days, no questions asked.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-2">✓ Third-Party Tested</h3>
                <p className="text-sm text-slate-600">
                  Every batch is independently tested for purity and potency.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-2">✓ Premium KSM-66®</h3>
                <p className="text-sm text-slate-600">
                  The most clinically studied ashwagandha extract with 22+ human trials.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200">
                <h3 className="font-bold text-slate-900 mb-2">✓ Made in USA</h3>
                <p className="text-sm text-slate-600">
                  Manufactured in GMP-certified facilities with strict quality controls.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-lg"
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
            <a href="mailto:support@optibio.com" className="text-blue-700 hover:text-blue-800 font-semibold underline">
              support@optibio.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

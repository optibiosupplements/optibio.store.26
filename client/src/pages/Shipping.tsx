import { Card, CardContent } from "@/components/ui/card";
import { Truck, Package, RotateCcw, CheckCircle2 } from "lucide-react";

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Shipping & Returns</h1>
          <p className="text-slate-600">Last Updated: January 11, 2025</p>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl mb-8">
          <CardContent className="p-8 space-y-8 prose prose-slate max-w-none">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9A961]/10 to-[#F7F4EF] flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#1E3A5F]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Shipping Policy</h2>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Shipping Locations</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We currently ship to all 50 states within the United States, including Alaska and Hawaii. We do not ship to P.O. boxes, APO/FPO addresses, or international destinations at this time.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Processing Time</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Orders are processed within 1-2 business days (Monday through Friday, excluding holidays). You will receive an email confirmation when your order is placed and another email with tracking information once your order has shipped.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Shipping Methods & Delivery Times</h3>
              <div className="space-y-4 mb-4">
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Standard Shipping (Free on orders $75+)</h4>
                  <p className="text-slate-700 text-sm mb-2">Delivery: 3-5 business days</p>
                  <p className="text-slate-700 text-sm">Cost: $5.99 (Free on orders $75 or more)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Express Shipping</h4>
                  <p className="text-slate-700 text-sm mb-2">Delivery: 2-3 business days</p>
                  <p className="text-slate-700 text-sm">Cost: $12.99</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Overnight Shipping</h4>
                  <p className="text-slate-700 text-sm mb-2">Delivery: 1 business day</p>
                  <p className="text-slate-700 text-sm">Cost: $24.99</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mb-4">
                <strong>Note:</strong> Delivery times are estimates and begin after your order has been processed and shipped. Delays may occur due to weather, carrier issues, or other circumstances beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Order Tracking</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Once your order ships, you will receive a tracking number via email. You can track your package using this number on the carrier's website (USPS, FedEx, or UPS). You can also view your order status by logging into your account and visiting the "My Orders" page.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Shipping Carriers</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use trusted carriers including USPS, FedEx, and UPS to ensure your order arrives safely and on time. The carrier is selected based on your location and shipping method.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Address Accuracy</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Please ensure your shipping address is accurate and complete. We are not responsible for orders shipped to incorrect addresses provided by the customer. If you need to update your shipping address, please contact us immediately at <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a>.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lost or Damaged Packages</h3>
              <p className="text-slate-700 leading-relaxed">
                If your package is lost or arrives damaged, please contact us within 7 days of the expected delivery date. We will work with the carrier to resolve the issue and either resend your order or issue a refund.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 shadow-xl mb-8">
          <CardContent className="p-8 space-y-8 prose prose-slate max-w-none">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-[#C9A961]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Returns & Refunds</h2>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">90-Day Money-Back Guarantee</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We stand behind the quality of our products. If you're not completely satisfied with your purchase, you can return it within 90 days of delivery for a full refund—no questions asked.
              </p>

              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-white border-2 border-[#C9A961]/30 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#C9A961] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Our Promise</h4>
                    <p className="text-slate-700 text-sm">
                      We believe in the power of premium KSM-66® Ashwagandha. If you don't experience the benefits you're looking for, we'll give you your money back. Your satisfaction is our priority.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">How to Return a Product</h3>
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A961]/10 text-[#1E3A5F] font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold">Contact Us</p>
                    <p className="text-slate-700 text-sm">
                      Email <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a> with your order number and reason for return.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A961]/10 text-[#1E3A5F] font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold">Receive Return Authorization</p>
                    <p className="text-slate-700 text-sm">
                      We'll send you a Return Merchandise Authorization (RMA) number and return instructions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A961]/10 text-[#1E3A5F] font-bold flex items-center justify-center text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold">Ship Your Return</p>
                    <p className="text-slate-700 text-sm">
                      Pack the product securely and ship it to the address provided. Include your RMA number.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C9A961]/10 text-[#1E3A5F] font-bold flex items-center justify-center text-sm">
                    4
                  </div>
                  <div>
                    <p className="text-slate-900 font-semibold">Get Your Refund</p>
                    <p className="text-slate-700 text-sm">
                      Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Return Conditions</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
                <li>Products must be returned within 90 days of delivery</li>
                <li>Products can be opened or used—we stand by our guarantee</li>
                <li>Original packaging is not required</li>
                <li>You are responsible for return shipping costs (unless the product is defective or we made an error)</li>
                <li>Refunds are issued to the original payment method</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Refund Processing</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Once your return is received and inspected, we will send you an email confirmation. Your refund will be processed within 5-7 business days and credited to your original payment method. Please allow an additional 3-5 business days for the refund to appear in your account, depending on your bank or credit card company.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Exchanges</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not offer direct exchanges at this time. If you need a different product or variant, please return your original order for a refund and place a new order for the item you want.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Defective or Damaged Products</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you receive a defective or damaged product, please contact us immediately at <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a> with photos of the damage. We will send you a replacement at no cost or issue a full refund, including return shipping costs.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Subscription Returns</h3>
              <p className="text-slate-700 leading-relaxed">
                If you have a subscription, you can cancel at any time through your account. If you've already received a shipment you don't want, you can return it following our standard return process. Canceling your subscription does not automatically return products you've already received.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200 shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Additional Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Order Cancellation</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  You can cancel your order within 24 hours of placing it by contacting us at <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a>. Once your order has been processed and shipped, it cannot be canceled, but you can return it using our standard return process.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Incorrect Orders</h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  If you receive the wrong product, please contact us immediately. We will send you the correct product at no additional cost and provide a prepaid return label for the incorrect item.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Questions?</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">
                  If you have any questions about shipping or returns, our customer support team is here to help:
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <p className="text-slate-900 font-semibold mb-2">Contact OptiBio Support</p>
                  <p className="text-slate-700 text-sm">Email: <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a></p>
                  <p className="text-slate-700 text-sm">Response Time: Within 24 hours (business days)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

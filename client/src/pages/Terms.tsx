import { Card, CardContent } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-600">Last Updated: January 11, 2025</p>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl">
          <CardContent className="p-8 space-y-8 prose prose-slate max-w-none">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms of Service ("Terms") govern your access to and use of the OptiBio website and services. By accessing or using our website, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our website or purchase our products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility</h2>
              <p className="text-slate-700 leading-relaxed">
                You must be at least 18 years old to use our website and purchase our products. By using our services, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Registration</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To make purchases, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or violates these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Information and Availability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We strive to provide accurate product descriptions, images, and pricing. However:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Product images are for illustration purposes and may not exactly represent the actual product</li>
                <li>We do not warrant that product descriptions or other content is accurate, complete, or error-free</li>
                <li>Product availability is subject to change without notice</li>
                <li>We reserve the right to limit quantities or discontinue products at any time</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Orders and Payment</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Order Acceptance</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Your order is an offer to purchase products from OptiBio. We reserve the right to accept or decline your order for any reason, including product availability, errors in pricing or product information, or suspected fraud. If we decline your order after payment has been processed, we will issue a full refund.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Payment Processing</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                All payments are processed securely through Stripe. By providing payment information, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>You are authorized to use the payment method provided</li>
                <li>The payment information is accurate and current</li>
                <li>You will pay all charges incurred at the prices in effect when charges are incurred</li>
                <li>You are responsible for all applicable taxes</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Pricing Errors</h3>
              <p className="text-slate-700 leading-relaxed">
                If we discover a pricing error after you have placed an order, we will notify you and give you the option to confirm your order at the correct price or cancel it for a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Shipping and Delivery</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We ship to addresses within the United States. Shipping times and costs vary based on your location and selected shipping method. Please see our <a href="/shipping" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">Shipping & Returns Policy</a> for detailed information.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Title and risk of loss pass to you upon delivery to the carrier. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Returns and Refunds</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We offer a 90-day money-back guarantee on all products. If you are not satisfied with your purchase, you may return it for a full refund within 90 days of delivery. Please see our <a href="/shipping" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">Shipping & Returns Policy</a> for complete details on our return process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Subscription Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you subscribe to our auto-delivery service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>You authorize us to charge your payment method automatically at regular intervals</li>
                <li>Subscriptions continue until you cancel</li>
                <li>You can cancel, pause, or modify your subscription at any time through your account</li>
                <li>Cancellations take effect after the current billing cycle</li>
                <li>We may change subscription pricing with 30 days' notice</li>
                <li>You are responsible for maintaining valid payment information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Health Disclaimers</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">FDA Disclaimer</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Medical Advice</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                The information on our website is for informational purposes only and is not intended as medical advice. Always consult with a qualified healthcare professional before starting any new supplement regimen, especially if you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Are pregnant or nursing</li>
                <li>Have a medical condition</li>
                <li>Are taking prescription medications</li>
                <li>Are under 18 years of age</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Individual Results</h3>
              <p className="text-slate-700 leading-relaxed">
                Results may vary. Testimonials and reviews reflect individual experiences and are not guarantees of results. Your results may differ based on various factors including diet, exercise, genetics, and overall health.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the property of OptiBio and is protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Copy, reproduce, or distribute our content without permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Modify or create derivative works from our content</li>
                <li>Use automated systems to access or scrape our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Prohibited Uses</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree not to use our website or services to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful code, viruses, or malware</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass, abuse, or harm others</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the proper functioning of our website</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To the fullest extent permitted by law, OptiBio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Your use or inability to use our products or services</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Any third-party conduct or content on our website</li>
                <li>Any other matter relating to our services</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Our total liability shall not exceed the amount you paid for the product giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Indemnification</h2>
              <p className="text-slate-700 leading-relaxed">
                You agree to indemnify and hold harmless OptiBio and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our website, violation of these Terms, or infringement of any rights of another party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Governing Law</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Arbitration</h3>
              <p className="text-slate-700 leading-relaxed">
                Any dispute arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to participate in class action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes your acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Severability</h2>
              <p className="text-slate-700 leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="p-6 rounded-xl bg-slate-50 border-2 border-slate-200">
                <p className="text-slate-900 font-semibold mb-2">OptiBio</p>
                <p className="text-slate-700">Email: <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a></p>
                <p className="text-slate-700">Legal: <a href="mailto:legal@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">legal@optibio.com</a></p>
              </div>
            </section>

            <section className="border-t-2 border-slate-200 pt-6">
              <p className="text-sm text-slate-500 italic">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

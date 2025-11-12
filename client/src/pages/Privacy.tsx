import { Card, CardContent } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-600">Last Updated: January 11, 2025</p>
        </div>

        <Card className="border-2 border-slate-200 shadow-xl">
          <CardContent className="p-8 space-y-8 prose prose-slate max-w-none">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                OptiBio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our products. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Personal Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                This information may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Name and contact information (email address, phone number, shipping address)</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Account credentials (username and password)</li>
                <li>Purchase history and preferences</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you visit our website, we may automatically collect certain information about your device and browsing actions, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping notifications</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and product offerings</li>
                <li>Detect and prevent fraud or unauthorized activities</li>
                <li>Comply with legal obligations</li>
                <li>Analyze website usage and trends</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing and Disclosure</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Service Providers</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                We work with trusted third-party service providers who assist us in operating our website and conducting our business:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
                <li><strong>Payment Processing:</strong> Stripe (for secure payment processing)</li>
                <li><strong>Shipping:</strong> USPS, FedEx, UPS (for order fulfillment)</li>
                <li><strong>Email Services:</strong> For sending transactional and marketing emails</li>
                <li><strong>Analytics:</strong> For website performance and user behavior analysis</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">Legal Requirements</h3>
              <p className="text-slate-700 leading-relaxed">
                We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings. However, disabling cookies may limit certain features of our website.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Types of cookies we use:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy Rights</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">privacy@optibio.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                Our website and products are not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links</h2>
              <p className="text-slate-700 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">International Data Transfers</h2>
              <p className="text-slate-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our website, you consent to the transfer of your information to the United States and other countries where we operate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our website after changes are posted constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="p-6 rounded-xl bg-slate-50 border-2 border-slate-200">
                <p className="text-slate-900 font-semibold mb-2">OptiBio</p>
                <p className="text-slate-700">Email: <a href="mailto:privacy@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">privacy@optibio.com</a></p>
                <p className="text-slate-700">Support: <a href="mailto:support@optibio.com" className="text-[#1E3A5F] hover:text-[#1E3A5F] font-semibold underline">support@optibio.com</a></p>
              </div>
            </section>

            <section className="border-t-2 border-slate-200 pt-6">
              <p className="text-sm text-slate-500 italic">
                This Privacy Policy is effective as of the date stated above and applies to all information collected by OptiBio through our website and related services.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Shield,
  Mail,
  ExternalLink,
  Accessibility as AccessibilityIcon,
  Keyboard,
  Eye,
  Volume2,
  ChevronRight
} from "lucide-react";
// Breadcrumb styling moved to custom implementation

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
      {/* Header */}
      <section className="relative py-12 md:py-16 overflow-hidden gradient-hero">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#C9A961]/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#1E3A5F]/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <nav className="flex items-center gap-2 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-2 h-6">
            <a href="/" className="text-slate-500 hover:text-[#1E3A5F] transition-colors leading-none flex items-center">
              Home
            </a>
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-[#1E3A5F] font-bold leading-none flex items-center">
              Accessibility
            </span>
          </nav>
          <div className="max-w-3xl">
            <Badge className="mb-4 px-5 py-2 bg-gradient-to-r from-[#C9A961] to-[#F7F4EF]0 text-slate-900 border-0 shadow-gold">
              <AccessibilityIcon className="w-4 h-4 mr-2" />
              <span className="font-bold">WCAG 2.1 AA Compliant</span>
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E3A5F]">
              Accessibility Statement
            </h1>
            <p className="text-lg text-slate-600">
              Optibio is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Compliance Status */}
          <Card className="mb-8 border-2 border-[#C9A961]/20 shadow-cream">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#C9A961] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Compliance Status</CardTitle>
                  <p className="text-sm text-muted-foreground">Last updated: December 26, 2025</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900">WCAG 2.1 Level AA Compliant</p>
                  <p className="text-sm text-green-700 mt-1">
                    Our website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. This means our content is accessible to a wide range of people with disabilities, including blindness and low vision, deafness and hearing loss, limited movement, speech disabilities, photosensitivity, and combinations of these.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Perceivable content</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Operable interface</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Understandable information</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Robust compatibility</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card className="mb-8 border-2 border-[#C9A961]/20 shadow-cream">
            <CardHeader>
              <CardTitle className="text-2xl">Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <Keyboard className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Keyboard Navigation</h3>
                  <p className="text-muted-foreground">
                    All interactive elements can be accessed using a keyboard. Use the Tab key to navigate through links and buttons, Enter to activate, and arrow keys for menus and dropdowns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Visual Accessibility</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>High contrast text with minimum 4.5:1 ratio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>Descriptive alt text for all images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>Clear focus indicators on interactive elements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>Resizable text without loss of functionality</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-5 h-5 text-[#1E3A5F]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Screen Reader Compatibility</h3>
                  <p className="text-muted-foreground mb-3">
                    Our website is compatible with popular screen readers and assistive technologies:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>JAWS (Windows)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>NVDA (Windows)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>VoiceOver (Mac/iOS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>TalkBack (Android)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="mb-8 border-2 border-[#C9A961]/20 shadow-cream">
            <CardHeader>
              <CardTitle className="text-2xl">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Standards & Guidelines</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Accessible Rich Internet Applications (ARIA) specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Section 508 of the Rehabilitation Act</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Supported Browsers</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  Our website is optimized for accessibility in the following browsers (latest versions):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-slate-50 rounded border text-center">Chrome</div>
                  <div className="p-2 bg-slate-50 rounded border text-center">Firefox</div>
                  <div className="p-2 bg-slate-50 rounded border text-center">Safari</div>
                  <div className="p-2 bg-slate-50 rounded border text-center">Edge</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback & Contact */}
          <Card className="border-2 border-[#C9A961]/20 shadow-cream">
            <CardHeader>
              <CardTitle className="text-2xl">Feedback & Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We welcome your feedback on the accessibility of Optibio. If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <a href="mailto:accessibility@optibiosupplements.com" className="text-[#1E3A5F] hover:underline">
                      accessibility@optibiosupplements.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Contact Form</p>
                    <Link href="/about#contact">
                      <span className="text-[#1E3A5F] hover:underline cursor-pointer">
                        Visit our contact page
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F7F4EF] border border-[#C9A961]/20 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong>Response Time:</strong> We aim to respond to accessibility feedback within 2 business days. For urgent accessibility issues, please indicate "Urgent" in your subject line.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              Ready to experience premium wellness supplements?
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-[#1E3A5F] to-[#152B45] hover:opacity-90">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

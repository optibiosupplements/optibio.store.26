import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, Shield, Info } from "lucide-react";

export default function DoNotSell() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    additionalInfo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in production this would send to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would:
    // 1. Send the request to the backend
    // 2. Log the request for compliance records
    // 3. Process the opt-out within 45 days (CCPA requirement)
    // 4. Send confirmation email to the user

    setSubmitted(true);
    setIsSubmitting(false);
    toast.success("Your request has been submitted successfully");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12 dark:bg-[#0B1120]">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-2 border-green-200 dark:border-green-800 shadow-xl">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Request Submitted Successfully
              </h1>
              <p className="text-slate-700 dark:text-slate-200 mb-6">
                Thank you for submitting your request. We will process your "Do Not Sell or Share My Personal Information" request within 45 days as required by California law.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                You will receive a confirmation email at <strong>{formData.email}</strong> once your request has been processed.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Homepage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12 dark:bg-[#0B1120]">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Do Not Sell or Share My Personal Information
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            California Consumer Privacy Act (CCPA) & California Privacy Rights Act (CPRA) Request Form
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200 dark:border-[#2D4A77] shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#1E3A5F]" />
                  Submit Your Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter your email address"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll use this email to verify your identity and send confirmation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State of Residence *</Label>
                    <Input
                      id="state"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="e.g., California"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalInfo: e.target.value })
                      }
                      placeholder="Any additional details about your request..."
                      rows={4}
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      By submitting this form, you are requesting that Optibio:
                    </p>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Not sell your personal information to third parties</li>
                      <li>Not share your personal information for cross-context behavioral advertising</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-slate-200 dark:border-[#2D4A77]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#1E3A5F]" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Know what personal information is collected</li>
                  <li>Know if personal information is sold or shared</li>
                  <li>Opt-out of the sale or sharing of personal information</li>
                  <li>Request deletion of personal information</li>
                  <li>Not be discriminated against for exercising these rights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-[#2D4A77]">
              <CardHeader>
                <CardTitle className="text-lg">Processing Time</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  We will process your request within <strong>45 days</strong> of receipt, as required by California law.
                </p>
                <p>
                  If we need additional time, we will notify you and may extend this period by an additional 45 days.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-[#2D4A77]">
              <CardHeader>
                <CardTitle className="text-lg">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300">
                <p className="mb-2">
                  For questions about this form or your privacy rights:
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@optibio.com"
                    className="text-[#1E3A5F] hover:underline"
                  >
                    privacy@optibio.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

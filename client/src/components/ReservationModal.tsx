import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, Star, Zap, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReservationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReservationModal({ open, onOpenChange }: ReservationModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedTier, setSelectedTier] = useState<"founders" | "early_adopter" | "pre_launch">("early_adopter");
  const [reservationNumber, setReservationNumber] = useState<number | null>(null);

  const createReservationMutation = trpc.presale.createReservation.useMutation({
    onSuccess: (data) => {
      // Get the position from the database insert result
      const position = data.reservation.insertId;
      setReservationNumber(position);
      toast.success(`You're reserved! You're ${getTierName(selectedTier)} #${position}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create reservation");
    },
  });

  const getTierName = (tier: string) => {
    switch (tier) {
      case "founders":
        return "Founding Member";
      case "early_adopter":
        return "Early Believer";
      case "pre_launch":
        return "Pre-Launch Member";
      default:
        return "";
    }
  };

  const getTierPrice = (tier: typeof selectedTier) => {
    switch (tier) {
      case "founders":
        return "69";
      case "early_adopter":
        return "49";
      case "pre_launch":
        return "54.99";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      toast.error("Please fill in all fields");
      return;
    }

    createReservationMutation.mutate({
      name,
      email,
      tier: selectedTier,
      price: getTierPrice(selectedTier),
    });
  };

  const handleClose = () => {
    if (!reservationNumber) {
      onOpenChange(false);
    } else {
      // Reset form and close
      setName("");
      setEmail("");
      setSelectedTier("early_adopter");
      setReservationNumber(null);
      onOpenChange(false);
    }
  };

  // If reservation is complete, show confirmation
  if (reservationNumber) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl font-bold text-green-600">
              ✅ You're Reserved!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                You're {getTierName(selectedTier)} #{reservationNumber}
              </h3>
              <p className="text-slate-600">
                We've sent a confirmation email to <strong>{email}</strong>
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-3">
              <h4 className="font-bold text-lg">What Happens Next?</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p><strong>Day 1-7:</strong> We'll share supplier visit photos and quality testing updates</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p><strong>Day 15:</strong> Payment opens (we'll email you with your exclusive link)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p><strong>Day 90:</strong> Your order ships with tracking number</p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-slate-600">
              <p>Your spot is held for 48 hours after payment opens.</p>
              <p className="mt-2">Questions? Email us at support@optibio.com</p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Reservation form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold">
            Reserve Your Spot
          </DialogTitle>
          <p className="text-center text-slate-600 mt-2">
            Choose your tier and secure your place in line. No payment required yet.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Tier Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-bold">Choose Your Tier</Label>
            
            <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as any)}>
              {/* Founder's Circle */}
              <div className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedTier === "founders" 
                  ? "border-yellow-400 bg-yellow-50 shadow-lg" 
                  : "border-slate-200 hover:border-yellow-300"
              }`}>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="founders" id="founders" className="mt-1" />
                  <Label htmlFor="founders" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-xl font-bold">Founder's Circle</h3>
                      </div>
                      <Badge className="bg-yellow-400 text-slate-900 font-bold">BEST VALUE</Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">$69</span>
                        <span className="text-slate-500 line-through">$119.98</span>
                        <span className="text-green-600 font-semibold">Save $51</span>
                      </div>
                      <p className="text-sm text-slate-600">2 bottles (90-day supply) • $34.50/bottle</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>2 bottles (90-day supply)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span><strong>25% off for life</strong> on all future orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Founding Member #X certificate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Free shipping for life</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>First access to new products (30 days early)</span>
                      </div>
                    </div>

                    <p className="text-xs text-red-600 font-semibold mt-3">
                      ⚠️ Only 100 spots available
                    </p>
                  </Label>
                </div>
              </div>

              {/* Early Believer */}
              <div className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedTier === "early_adopter" 
                  ? "border-blue-400 bg-blue-50 shadow-lg" 
                  : "border-slate-200 hover:border-blue-300"
              }`}>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="early_adopter" id="early_adopter" className="mt-1" />
                  <Label htmlFor="early_adopter" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500" />
                        <h3 className="text-xl font-bold">Early Believer</h3>
                      </div>
                      <Badge className="bg-blue-500 text-white font-bold">MOST POPULAR</Badge>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">$49</span>
                        <span className="text-slate-500 line-through">$59.99</span>
                        <span className="text-green-600 font-semibold">Save $11</span>
                      </div>
                      <p className="text-sm text-slate-600">1 bottle (45-day supply)</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>1 bottle (45-day supply)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span><strong>15% off for life</strong> on all future orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>"Early Believer" badge on account</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Early access to new products (14 days early)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Priority shipping at launch</span>
                      </div>
                    </div>

                    <p className="text-xs text-orange-600 font-semibold mt-3">
                      ⚠️ Only 500 spots available
                    </p>
                  </Label>
                </div>
              </div>

              {/* Pre-Launch */}
              <div className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedTier === "pre_launch" 
                  ? "border-purple-400 bg-purple-50 shadow-lg" 
                  : "border-slate-200 hover:border-purple-300"
              }`}>
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="pre_launch" id="pre_launch" className="mt-1" />
                  <Label htmlFor="pre_launch" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <h3 className="text-xl font-bold">Pre-Launch</h3>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">$54.99</span>
                        <span className="text-slate-500 line-through">$59.99</span>
                        <span className="text-green-600 font-semibold">Save $5</span>
                      </div>
                      <p className="text-sm text-slate-600">1 bottle (45-day supply)</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>1 bottle (45-day supply)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span><strong>10% off for life</strong> on all future orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Pre-launch pricing locked in</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Priority shipping at launch</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-semibold mt-3">
                      ✅ Unlimited spots (until launch day)
                    </p>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t pt-6">
            <Label className="text-lg font-bold">Your Information</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-900">90-Day Money-Back Guarantee</h4>
                <p className="text-sm text-green-800">
                  If we don't ship by Day 90, you get a 100% refund. No questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={createReservationMutation.isPending}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold text-lg py-6"
          >
            {createReservationMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Reserving Your Spot...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Reserve My Spot (No Payment Yet)
              </>
            )}
          </Button>

          <p className="text-xs text-center text-slate-600">
            By reserving, you agree to receive updates about your order. No payment required now.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

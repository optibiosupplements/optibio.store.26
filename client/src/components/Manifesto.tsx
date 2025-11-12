import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  FileText,
  Users,
  Sparkles
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Manifesto() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const joinWaitlist = trpc.presale.joinWaitlist.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("You're on the list!", {
        description: "We'll email you when pre-sale opens in 48 hours."
      });
    },
    onError: (error: any) => {
      toast.error("Something went wrong", {
        description: error.message
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    joinWaitlist.mutate({ email, name, source: "manifesto" });
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Welcome to the Movement
            </h2>
            <p className="text-xl text-blue-200">
              You're officially on the waitlist. We'll email you in <strong>48 hours</strong> when pre-sale opens with exclusive Founder's Edition pricing.
            </p>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
              <p className="text-sm text-blue-200 mb-4">
                <strong>What happens next:</strong>
              </p>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">
                    <strong>Day 1 (48 hours):</strong> Pre-sale opens. You get first access to Founder's Edition (limited to 500 spots)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">
                    <strong>Day 7:</strong> We share behind-the-scenes: visiting suppliers, quality testing, manufacturing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">
                    <strong>Day 90:</strong> Your order ships. You're part of the founding community that demanded better.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-300">
              Share this with friends who deserve better than the supplement industry's broken promises.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-sm px-4 py-2">
              <AlertCircle className="w-4 h-4 mr-2" />
              Industry Truth
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              The Supplement Industry<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                Is Broken
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
              70% of supplements don't contain what their labels claim. Companies use cheap extracts, hide behind proprietary blends, and prioritize profit over efficacy.
            </p>
          </div>

          {/* The Problems */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/5 border-red-500/30 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Fake Ingredients</h3>
                <p className="text-sm text-blue-200">
                  Most "ashwagandha" is cheap root powder with no active compounds. Clinical studies used KSM-66®—but 90% of brands don't.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-red-500/30 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Zero Transparency</h3>
                <p className="text-sm text-blue-200">
                  No third-party testing. No batch verification. No proof of purity. Just trust us, they say. Why should you?
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-red-500/30 backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Proprietary Blends</h3>
                <p className="text-sm text-blue-200">
                  "Proprietary blend" means "we're hiding the dosage because it's too low to work." If it worked, they'd tell you.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* The Solution */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-2xl p-8 md:p-12 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-6 py-3 rounded-full font-bold">
                <Sparkles className="w-5 h-5" />
                We're Building Something Different
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                A Supplement Company Where Transparency<br />
                Isn't a Marketing Tactic—It's Our Foundation
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Only Clinically Validated Ingredients</h4>
                  <p className="text-sm text-blue-200">
                    KSM-66® Ashwagandha—the exact extract used in 20+ published clinical trials. Not generic powder. Not "proprietary blend." The real thing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Third-Party Testing for Every Batch</h4>
                  <p className="text-sm text-blue-200">
                    Heavy metals, microbials, potency—all tested by independent labs. Results published on our website. No hiding.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Full Supply Chain Transparency</h4>
                  <p className="text-sm text-blue-200">
                    We'll show you where it's grown, how it's extracted, who manufactures it. No secrets. No smoke and mirrors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white mb-2">Clinical Dosages, Not Pixie Dust</h4>
                  <p className="text-sm text-blue-200">
                    600mg daily—the exact dose proven to reduce stress by 44%. Not 100mg. Not "a pinch." The amount that actually works.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Call to Action */}
          <div className="bg-gradient-to-br from-slate-800 to-blue-900 border-2 border-yellow-400/50 rounded-2xl p-8 md:p-12 space-y-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-yellow-400" />
              <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30">
                Join the Founding Community
              </Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              We're Not Just Selling Supplements—<br />
              We're Proving This Industry Can Do Better
            </h2>
            
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              We're launching our first product—pharmaceutical-grade Ashwagandha KSM-66—in <strong>90 days</strong>. 
              Join the waitlist to get exclusive Founder's Edition pricing and be part of building a better supplement company.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 h-12"
                required
              />
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 h-12"
                required
              />
              <Button 
                type="submit"
                size="lg"
                disabled={joinWaitlist.isPending}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-slate-900 font-bold text-lg h-14"
              >
                {joinWaitlist.isPending ? "Joining..." : "Join the Waitlist"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <p className="text-sm text-blue-300">
              No spam. No BS. Just updates on our journey to fix what's broken.
            </p>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-blue-400">
                <strong>What you'll get as a founding member:</strong> Exclusive pre-sale pricing (up to 40% off), 
                lifetime discounts on all future products, early access to new launches, and recognition as a Founding Member 
                who demanded transparency from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

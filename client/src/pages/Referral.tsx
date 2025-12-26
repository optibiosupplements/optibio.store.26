import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Check,
  Gift,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  Share2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Referral() {
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: referralData } = trpc.referral.getMyReferralCode.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: stats } = trpc.referral.getMyReferralStats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: referrals } = trpc.referral.getMyReferrals.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: credits } = trpc.referral.getMyCredits.useQuery(undefined, {
    enabled: !!user,
  });

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!referralData) return;

    const message = encodeURIComponent(
      `I've been loving OptiBio Ashwagandha! Use my referral link to get $10 off your first order: ${referralData.referralUrl}`
    );

    const urls: Record<string, string> = {
      email: `mailto:?subject=Get $10 off OptiBio Ashwagandha&body=${message}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralUrl)}`,
      whatsapp: `https://wa.me/?text=${message}`,
    };

    window.open(urls[platform], "_blank");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A961]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your referral dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Referral Program</h1>
          <p className="text-lg text-slate-600">
            Share OptiBio with friends and earn $10 credit for each successful referral
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold text-slate-900">{stats?.totalReferrals || 0}</p>
                </div>
                <Users className="h-8 w-8 text-[#C9A961]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.pendingReferrals || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.completedReferrals || 0}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Available Credits</p>
                  <p className="text-3xl font-bold text-[#C9A961]">
                    ${((stats?.availableCredits || 0) / 100).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-[#C9A961]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Share Your Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#C9A961]" />
                Your Referral Link
              </CardTitle>
              <CardDescription>
                Share this link with friends to give them $10 off and earn $10 credit yourself
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Referral Code */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Referral Code
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralData?.referralCode || "Loading..."}
                    readOnly
                    className="font-mono text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(referralData?.referralCode || "")}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Referral URL */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Referral URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={referralData?.referralUrl || "Loading..."}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(referralData?.referralUrl || "")}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Share Buttons */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-3 block">
                  <Share2 className="h-4 w-4 inline mr-2" />
                  Share via
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleShare("email")}
                    className="justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("whatsapp")}
                    className="justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                    className="justify-start"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="justify-start"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Earn rewards by sharing OptiBio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center text-[#C9A961] font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Share Your Link</h3>
                  <p className="text-sm text-slate-600">
                    Send your unique referral link to friends via email, social media, or messaging apps
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center text-[#C9A961] font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">They Get $10 Off</h3>
                  <p className="text-sm text-slate-600">
                    Your friend receives $10 credit on their first order when they use your link
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center text-[#C9A961] font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">You Earn $10 Credit</h3>
                  <p className="text-sm text-slate-600">
                    Once they complete their purchase, you'll receive $10 credit to use on your next order
                  </p>
                </div>
              </div>

              <Separator />

              <div className="bg-[#F7F4EF]/50 p-4 rounded-lg border border-[#C9A961]/20">
                <h4 className="font-semibold text-slate-900 mb-2">Terms & Conditions</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Credits are applied automatically after successful referral</li>
                  <li>• No limit on the number of referrals you can make</li>
                  <li>• Credits never expire and can be stacked</li>
                  <li>• Credits can be used on any product or subscription</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Referral History</CardTitle>
            <CardDescription>Track the status of your referrals</CardDescription>
          </CardHeader>
          <CardContent>
            {!referrals || referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">No referrals yet</p>
                <p className="text-sm text-slate-500">
                  Start sharing your referral link to earn credits!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {referral.referredEmail || "Pending signup"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {referral.orderValue && (
                        <p className="text-sm text-slate-600">
                          ${(referral.orderValue / 100).toFixed(2)}
                        </p>
                      )}
                      <Badge
                        variant={
                          referral.status === "credited"
                            ? "default"
                            : referral.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {referral.status === "credited"
                          ? "Credited"
                          : referral.status === "completed"
                          ? "Completed"
                          : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Credits */}
        {credits && credits.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Available Credits</CardTitle>
              <CardDescription>Credits you can use on your next order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {credits.map((credit) => (
                  <div
                    key={credit.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-[#F7F4EF]/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#C9A961]/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-[#C9A961]" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          ${(credit.amount / 100).toFixed(2)} Credit
                        </p>
                        <p className="text-sm text-slate-500">
                          From {credit.source} • {new Date(credit.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Available
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

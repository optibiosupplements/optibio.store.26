import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { toast } from "sonner";
import { 
  Gift, 
  Star, 
  Trophy, 
  Users, 
  Sparkles, 
  Crown, 
  Copy, 
  Check,
  ArrowRight,
  Loader2,
  Clock,
  ShoppingBag,
  Percent,
  Truck,
  Package
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tierColors = {
  bronze: "bg-amber-700",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-purple-600",
};

const tierIcons = {
  bronze: Star,
  silver: Trophy,
  gold: Crown,
  platinum: Sparkles,
};

export default function Rewards() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: account, isLoading: accountLoading, refetch: refetchAccount } = trpc.loyalty.getAccount.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const { data: transactions, isLoading: transactionsLoading } = trpc.loyalty.getTransactions.useQuery(
    { limit: 10, offset: 0 },
    { enabled: isAuthenticated }
  );
  
  const { data: rewards, isLoading: rewardsLoading, refetch: refetchRewards } = trpc.loyalty.getRewards.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const { data: tierBenefits } = trpc.loyalty.getTierBenefits.useQuery();

  const applyReferralMutation = trpc.loyalty.applyReferralCode.useMutation({
    onSuccess: (data) => {
      toast.success(`You earned ${data.pointsEarned} bonus points!`);
      setReferralCode("");
      refetchAccount();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const redeemRewardMutation = trpc.loyalty.redeemReward.useMutation({
    onSuccess: (data) => {
      toast.success(`Reward redeemed! ${data.rewardCode ? `Your code: ${data.rewardCode}` : ""}`);
      refetchAccount();
      refetchRewards();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const copyReferralCode = () => {
    if (account?.referralCode) {
      navigator.clipboard.writeText(account.referralCode);
      setCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyReferral = () => {
    if (referralCode.trim()) {
      applyReferralMutation.mutate({ code: referralCode.trim() });
    }
  };

  const handleRedeemReward = (rewardId: number) => {
    redeemRewardMutation.mutate({ rewardId });
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "discount_percent":
        return <Percent className="h-5 w-5" />;
      case "discount_fixed":
        return <ShoppingBag className="h-5 w-5" />;
      case "free_shipping":
        return <Truck className="h-5 w-5" />;
      case "free_product":
        return <Package className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <Header />
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="h-10 w-10 text-emerald-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">OptiBio Rewards</h1>
              <p className="text-xl text-gray-600 mb-8">
                Join our loyalty program and earn points on every purchase. 
                Unlock exclusive rewards, discounts, and VIP benefits.
              </p>
            </div>

            {/* Benefits Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <Card className="text-left">
                <CardContent className="pt-6">
                  <Star className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold mb-2">Earn Points</h3>
                  <p className="text-sm text-gray-600">Get 1 point for every $1 spent. Higher tiers earn up to 2x points!</p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="pt-6">
                  <Gift className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold mb-2">Redeem Rewards</h3>
                  <p className="text-sm text-gray-600">Use your points for discounts, free shipping, and exclusive products.</p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="pt-6">
                  <Users className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold mb-2">Refer Friends</h3>
                  <p className="text-sm text-gray-600">Earn 100 bonus points for each friend you refer!</p>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a href={getLoginUrl()}>
                Join Now & Get 50 Bonus Points
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const TierIcon = account ? tierIcons[account.tier] : Star;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Account Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Points Balance Card */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Your Rewards</CardTitle>
                  {account && (
                    <Badge className={`${tierColors[account.tier]} text-white`}>
                      <TierIcon className="h-3 w-3 mr-1" />
                      {account.tier.charAt(0).toUpperCase() + account.tier.slice(1)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {accountLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : account ? (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-emerald-600">{account.pointsBalance.toLocaleString()}</span>
                      <span className="text-gray-500">points available</span>
                    </div>
                    
                    {account.nextTier?.tier && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress to {account.nextTier.tier}</span>
                          <span className="font-medium">{account.nextTier.pointsNeeded} points to go</span>
                        </div>
                        <Progress value={account.nextTier.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">{account.lifetimePoints.toLocaleString()}</span> lifetime points
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{account.tierMultiplier}x</span> points multiplier
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Referral Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  Refer Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {account?.referralCode ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Share your code and both earn 100 points!</p>
                    <div className="flex gap-2">
                      <Input 
                        value={account.referralCode} 
                        readOnly 
                        className="font-mono text-center"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={copyReferralCode}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    
                    {!account.referredBy && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 mb-2">Have a referral code?</p>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Enter code"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                          />
                          <Button 
                            onClick={handleApplyReferral}
                            disabled={applyReferralMutation.isPending}
                            size="sm"
                          >
                            {applyReferralMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Rewards, History, Tiers */}
          <Tabs defaultValue="rewards" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="history">Points History</TabsTrigger>
              <TabsTrigger value="tiers">Tier Benefits</TabsTrigger>
            </TabsList>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              {rewardsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : rewards && rewards.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <Card 
                      key={reward.id} 
                      className={`relative ${!reward.isAvailable ? "opacity-60" : ""}`}
                    >
                      {reward.minTier && reward.minTier !== "bronze" && (
                        <Badge 
                          className={`absolute top-3 right-3 ${tierColors[reward.minTier]} text-white text-xs`}
                        >
                          {reward.minTier}+
                        </Badge>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            {getRewardIcon(reward.rewardType)}
                          </div>
                          <div>
                            <CardTitle className="text-base">{reward.name}</CardTitle>
                            <CardDescription className="text-emerald-600 font-semibold">
                              {reward.pointsCost.toLocaleString()} points
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full"
                              variant={reward.canRedeem ? "default" : "outline"}
                              disabled={!reward.canRedeem}
                            >
                              {!reward.isAvailable 
                                ? "Tier Locked" 
                                : !reward.canAfford 
                                  ? "Not Enough Points" 
                                  : "Redeem"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Redemption</DialogTitle>
                              <DialogDescription>
                                You are about to redeem <strong>{reward.name}</strong> for{" "}
                                <strong>{reward.pointsCost.toLocaleString()} points</strong>.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex gap-3 mt-4">
                              <Button 
                                className="flex-1"
                                onClick={() => handleRedeemReward(reward.id)}
                                disabled={redeemRewardMutation.isPending}
                              >
                                {redeemRewardMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Confirm Redemption
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No rewards available yet. Check back soon!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              {transactionsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
              ) : transactions && transactions.transactions.length > 0 ? (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {transactions.transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.points > 0 ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                            }`}>
                              {tx.type === "earn" && <ShoppingBag className="h-5 w-5" />}
                              {tx.type === "redeem" && <Gift className="h-5 w-5" />}
                              {tx.type === "bonus" && <Star className="h-5 w-5" />}
                              {tx.type === "referral" && <Users className="h-5 w-5" />}
                              {tx.type === "expire" && <Clock className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">{tx.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(tx.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`font-semibold ${
                            tx.points > 0 ? "text-emerald-600" : "text-red-600"
                          }`}>
                            {tx.points > 0 ? "+" : ""}{tx.points.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet. Start earning points by shopping!</p>
                    <Button asChild className="mt-4">
                      <Link href="/shop">Shop Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tiers Tab */}
            <TabsContent value="tiers">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tierBenefits?.tiers.map((tier) => {
                  const TIcon = tierIcons[tier.key as keyof typeof tierIcons];
                  const isCurrentTier = account?.tier === tier.key;
                  return (
                    <Card 
                      key={tier.key} 
                      className={`relative ${isCurrentTier ? "ring-2 ring-emerald-500" : ""}`}
                    >
                      {isCurrentTier && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500">
                          Current
                        </Badge>
                      )}
                      <CardHeader className="text-center pb-2">
                        <div className={`w-16 h-16 ${tierColors[tier.key as keyof typeof tierColors]} rounded-full flex items-center justify-center mx-auto mb-2`}>
                          <TIcon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>
                          {tier.threshold === 0 ? "Starting tier" : `${tier.threshold.toLocaleString()}+ points`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {tier.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>

          {/* How to Earn Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Shop</h4>
                  <p className="text-sm text-gray-600">
                    Earn {tierBenefits?.pointsPerDollar || 1} point per $1 spent
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Refer Friends</h4>
                  <p className="text-sm text-gray-600">
                    Earn {tierBenefits?.referralBonus || 100} points per referral
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Leave Reviews</h4>
                  <p className="text-sm text-gray-600">
                    Earn {tierBenefits?.reviewBonus || 25} points per review
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Sign Up</h4>
                  <p className="text-sm text-gray-600">
                    Get {tierBenefits?.signupBonus || 50} bonus points instantly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  DollarSign,
  Users,
  TrendingDown,
  TrendingUp,
  Package,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function AdminAnalytics() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();

  const { data: overview, isLoading: overviewLoading } = trpc.analytics.getOverview.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const { data: tierMetrics, isLoading: tierLoading } = trpc.analytics.getMetricsByTier.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  const { data: conversionMetrics, isLoading: conversionLoading } =
    trpc.analytics.getConversionMetrics.useQuery(undefined, {
      enabled: user?.role === "admin",
    });

  const { data: revenueBreakdown, isLoading: revenueLoading } =
    trpc.analytics.getRevenueBreakdown.useQuery(undefined, {
      enabled: user?.role === "admin",
    });

  // Redirect if not admin
  if (!authLoading && user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const isLoading =
    authLoading || overviewLoading || tierLoading || conversionLoading || revenueLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <Loader2 className="h-12 w-12 animate-spin text-blue-700" />
      </div>
    );
  }

  const getTierName = (tier: string) => {
    switch (tier) {
      case "founders":
        return "Founder's Circle";
      case "early_adopter":
        return "Early Believer";
      case "pre_launch":
        return "Pre-Launch";
      default:
        return "Regular";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "founders":
        return "from-amber-500 to-yellow-500";
      case "early_adopter":
        return "from-blue-500 to-indigo-500";
      case "pre_launch":
        return "from-[#C9A961] to-[#B89651]";
      default:
        return "from-slate-500 to-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12 md:py-16">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-10 h-10 text-blue-700" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-slate-600">
            Real-time insights into your subscription business
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monthly Recurring Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#C9A961]">
                {formatPrice(overview?.mrr || 0)}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                /month from active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {overview?.activeSubscriptions || 0}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Recurring customers
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Churn Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {overview?.churnRate?.toFixed(1) || "0.0"}%
              </div>
              <p className="text-sm text-slate-600 mt-1">
                Last 30 days
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatPrice(overview?.totalRevenue || 0)}
              </div>
              <p className="text-sm text-slate-600 mt-1">
                All-time revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Metrics by Tier */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Metrics by Founder Tier</CardTitle>
            <CardDescription>
              Performance breakdown by customer tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {tierMetrics && tierMetrics.length > 0 ? (
                tierMetrics.map((tier) => (
                  <div
                    key={tier.tier}
                    className="p-6 rounded-lg border-2 bg-gradient-to-r from-white to-slate-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${getTierColor(
                            tier.tier
                          )}`}
                        />
                        <h3 className="text-xl font-semibold text-slate-900">
                          {getTierName(tier.tier)}
                        </h3>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">
                        {tier.count} subscribers
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="text-sm text-slate-600 mb-1">
                          Monthly Recurring Revenue
                        </div>
                        <div className="text-2xl font-bold text-[#C9A961]">
                          {formatPrice(tier.mrr)}
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border">
                        <div className="text-sm text-slate-600 mb-1">
                          Average Lifetime Value
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(tier.avgLTV)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p>No tier data available yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Conversion Rate</CardTitle>
              <CardDescription>
                One-time buyers who became subscribers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {conversionMetrics?.conversionRate?.toFixed(1) || "0.0"}%
                </div>
                <div className="text-slate-600">
                  {conversionMetrics?.subscriptionOrders || 0} of{" "}
                  {conversionMetrics?.totalOrders || 0} customers
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Revenue Breakdown</CardTitle>
              <CardDescription>
                Subscription vs one-time purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueBreakdown && revenueBreakdown.length > 0 ? (
                  revenueBreakdown.map((tier) => {
                    const total = tier.totalRevenue;
                    const subPercent =
                      total > 0
                        ? (tier.subscriptionRevenue / total) * 100
                        : 0;

                    return (
                      <div key={tier.tier} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-900">
                            {getTierName(tier.tier)}
                          </span>
                          <span className="text-slate-600">
                            {formatPrice(total)}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getTierColor(
                              tier.tier
                            )}`}
                            style={{ width: `${subPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Subscription: {formatPrice(tier.subscriptionRevenue)}
                          </span>
                          <span>
                            One-time: {formatPrice(tier.oneTimeRevenue)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No revenue data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-slate-500">
          <p>
            Data updates in real-time as new subscriptions and orders are
            processed
          </p>
        </div>
      </div>
    </div>
  );
}

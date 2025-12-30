import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Redirect } from "wouter";

/**
 * Analytics Dashboard
 * 
 * Admin-only page showing revenue optimization metrics:
 * - Cart abandonment recovery
 * - Post-purchase email performance
 * - Reorder and subscription conversion rates
 * - Revenue impact calculations
 */
export default function Analytics() {
  const { user, loading } = useAuth();
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const handleDateRangeChange = (range: { startDate?: string; endDate?: string }) => {
    setDateRange(range);
  };

  // Fetch all metrics
  const cartMetrics = trpc.revenueAnalytics.getAbandonedCartMetrics.useQuery(dateRange);
  const emailMetrics = trpc.revenueAnalytics.getPostPurchaseMetrics.useQuery(dateRange);
  const revenueImpact = trpc.revenueAnalytics.getRevenueImpact.useQuery(dateRange);

  // Check if user is admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0B1120] dark:bg-[#0B1120]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Redirect to="/" />;
  }

  const isLoading = cartMetrics.isLoading || emailMetrics.isLoading || revenueImpact.isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E3A5F] border-b">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 mt-2">
                Monitor the performance of your revenue optimization systems
              </p>
            </div>
            <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Revenue Impact Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardDescription className="text-green-700">Total Revenue Impact</CardDescription>
                  <CardTitle className="text-3xl font-bold text-green-900">
                    ${revenueImpact.data?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700">
                    Combined revenue from all optimizations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Cart Recovery</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    ${revenueImpact.data?.cartRecoveryRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    From abandoned cart emails
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Reorder Revenue</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    ${revenueImpact.data?.reorderRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    From post-purchase emails
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Subscription Revenue</CardDescription>
                  <CardTitle className="text-2xl font-bold">
                    ${revenueImpact.data?.subscriptionRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Annual value from conversions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Abandoned Cart Recovery */}
            <Card>
              <CardHeader>
                <CardTitle>🛒 Abandoned Cart Recovery</CardTitle>
                <CardDescription>
                  Performance of the 3-email abandoned cart recovery sequence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Abandoned</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {cartMetrics.data?.totalAbandoned || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Recovered</div>
                    <div className="text-2xl font-bold text-green-600">
                      {cartMetrics.data?.totalRecovered || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Recovery Rate</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {cartMetrics.data?.recoveryRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Email Sequence Performance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Email 1 (1hr reminder)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {cartMetrics.data?.email1Sent || 0} sent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-700">Email 2 (24hr + 5% discount)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {cartMetrics.data?.email2Sent || 0} sent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Email 3 (48hr final urgency)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {cartMetrics.data?.email3Sent || 0} sent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-green-700 font-medium">Revenue Recovered</div>
                      <div className="text-xs text-green-600 mt-1">
                        From {cartMetrics.data?.totalRecovered || 0} recovered carts
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      ${revenueImpact.data?.cartRecoveryRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post-Purchase Email Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>📧 Post-Purchase Email Funnel</CardTitle>
                <CardDescription>
                  Performance of the 4-email nurture sequence (Day 7, 21, 60, 90)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Tracked</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {emailMetrics.data?.totalTracked || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Reorder Rate</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {emailMetrics.data?.reorderRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {emailMetrics.data?.reorderCount || 0} reorders
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Subscription Rate</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {emailMetrics.data?.subscriptionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {emailMetrics.data?.subscriptionCount || 0} conversions
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Review Rate</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {emailMetrics.data?.reviewRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {emailMetrics.data?.reviewCount || 0} reviews
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Email Sequence Delivery</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">Day 7 (Check-in + tips)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {emailMetrics.data?.day7Sent || 0} sent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-700">Day 21 (Sleep + review request)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {emailMetrics.data?.day21Sent || 0} sent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-700">Day 60 (Replenishment reminder)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {emailMetrics.data?.day60Sent || 0} sent
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-700">Day 90 (Subscribe & Save offer)</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {emailMetrics.data?.day90Sent || 0} sent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-blue-700 font-medium">Reorder Revenue</div>
                        <div className="text-xs text-blue-600 mt-1">
                          From {emailMetrics.data?.reorderCount || 0} repeat purchases
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        ${revenueImpact.data?.reorderRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-purple-700 font-medium">Subscription Value</div>
                        <div className="text-xs text-purple-600 mt-1">
                          Annual value from {emailMetrics.data?.subscriptionCount || 0} conversions
                        </div>
                      </div>
                      <div className="text-xl font-bold text-purple-900">
                        ${revenueImpact.data?.subscriptionRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insights & Recommendations */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">💡 Key Insights</CardTitle>
                <CardDescription className="text-blue-700">
                  Recommendations based on your current performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(cartMetrics.data?.recoveryRate || 0) < 15 && (
                    <div className="p-4 bg-white dark:bg-[#1E3A5F] dark:bg-[#1E3A5F] rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">
                        📈 Improve Cart Recovery Rate
                      </div>
                      <p className="text-sm text-blue-800">
                        Your cart recovery rate is {cartMetrics.data?.recoveryRate.toFixed(1)}%. Industry average is 15-20%. 
                        Consider testing different email timing or offering a larger discount in Email 2.
                      </p>
                    </div>
                  )}

                  {(emailMetrics.data?.reorderRate || 0) < 25 && (
                    <div className="p-4 bg-white dark:bg-[#1E3A5F] dark:bg-[#1E3A5F] rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">
                        🔄 Boost Reorder Rate
                      </div>
                      <p className="text-sm text-blue-800">
                        Your reorder rate is {emailMetrics.data?.reorderRate.toFixed(1)}%. Target is 30%+. 
                        Consider adding SMS reminders or testing different discount amounts in the Day 60 email.
                      </p>
                    </div>
                  )}

                  {(emailMetrics.data?.subscriptionRate || 0) < 10 && (
                    <div className="p-4 bg-white dark:bg-[#1E3A5F] dark:bg-[#1E3A5F] rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">
                        💰 Increase Subscription Conversions
                      </div>
                      <p className="text-sm text-blue-800">
                        Your subscription conversion rate is {emailMetrics.data?.subscriptionRate.toFixed(1)}%. Target is 15%+. 
                        Consider emphasizing the savings more prominently or offering a first-month discount.
                      </p>
                    </div>
                  )}

                  {(cartMetrics.data?.recoveryRate || 0) >= 15 && 
                   (emailMetrics.data?.reorderRate || 0) >= 25 && 
                   (emailMetrics.data?.subscriptionRate || 0) >= 10 && (
                    <div className="p-4 bg-white dark:bg-[#1E3A5F] dark:bg-[#1E3A5F] rounded-lg border border-green-200">
                      <div className="font-semibold text-green-900 mb-2">
                        🎉 Excellent Performance!
                      </div>
                      <p className="text-sm text-green-800">
                        All your metrics are meeting or exceeding industry benchmarks. Keep monitoring and consider A/B testing 
                        to optimize further.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

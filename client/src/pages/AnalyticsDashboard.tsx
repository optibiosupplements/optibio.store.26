import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, ShoppingCart, Users, DollarSign, Smartphone } from 'lucide-react';
import { formatPrice } from '@/const';

const COLORS = ['#1E3A5F', '#C9A961', '#5FA865', '#EBF5FB'];

export default function AnalyticsDashboard() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch analytics data
  const trafficQuery = trpc.revenueAnalytics.getTrafficDashboard.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const funnelQuery = trpc.revenueAnalytics.getConversionFunnel.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const sourcesQuery = trpc.revenueAnalytics.getTrafficSources.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const deviceQuery = trpc.revenueAnalytics.getDeviceBreakdown.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const cartMetricsQuery = trpc.revenueAnalytics.getAbandonedCartMetrics.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const postPurchaseQuery = trpc.revenueAnalytics.getPostPurchaseMetrics.useQuery(
    { startDate, endDate },
    { enabled: !!startDate && !!endDate }
  );

  const isLoading = trafficQuery.isLoading || funnelQuery.isLoading || sourcesQuery.isLoading;

  // Prepare funnel data for visualization
  const funnelData = useMemo(() => {
    if (!funnelQuery.data) return [];
    const { totalSessions, viewedHomepage, viewedProduct, addedToCart, startedCheckout, completedPurchase } = funnelQuery.data;
    
    return [
      { name: 'Homepage', value: viewedHomepage, percentage: totalSessions > 0 ? Math.round((viewedHomepage / totalSessions) * 100) : 0 },
      { name: 'Product', value: viewedProduct, percentage: totalSessions > 0 ? Math.round((viewedProduct / totalSessions) * 100) : 0 },
      { name: 'Add to Cart', value: addedToCart, percentage: totalSessions > 0 ? Math.round((addedToCart / totalSessions) * 100) : 0 },
      { name: 'Checkout', value: startedCheckout, percentage: totalSessions > 0 ? Math.round((startedCheckout / totalSessions) * 100) : 0 },
      { name: 'Purchase', value: completedPurchase, percentage: totalSessions > 0 ? Math.round((completedPurchase / totalSessions) * 100) : 0 },
    ];
  }, [funnelQuery.data]);

  // Prepare device data
  const deviceData = useMemo(() => {
    if (!deviceQuery.data) return [];
    return [
      { name: 'Mobile', value: deviceQuery.data.mobile },
      { name: 'Tablet', value: deviceQuery.data.tablet },
      { name: 'Desktop', value: deviceQuery.data.desktop },
    ];
  }, [deviceQuery.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F4EF] to-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[#1E3A5F]">Analytics Dashboard</h1>
          <p className="text-gray-600">Track visitor traffic, sales performance, and conversion metrics</p>
        </div>

        {/* Date Range Selector */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date Range
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#1E3A5F]" />
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1E3A5F]">
                {isLoading ? '...' : trafficQuery.data?.totals.uniqueVisitors || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total unique visitors</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#C9A961]" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#C9A961]">
                {isLoading ? '...' : `${trafficQuery.data?.conversionRate.toFixed(2) || 0}%`}
              </div>
              <p className="text-xs text-gray-500 mt-1">Visitors to purchases</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#5FA865]" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#5FA865]">
                {isLoading ? '...' : formatPrice(trafficQuery.data?.totals.totalRevenueInCents || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Revenue from sales</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#152B45]" />
                Avg Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#152B45]">
                {isLoading ? '...' : formatPrice(trafficQuery.data?.averageOrderValue || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Average per order</p>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Trends */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Daily visitor and page view trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
            ) : trafficQuery.data?.metrics && trafficQuery.data.metrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficQuery.data.metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="uniqueVisitors" stroke="#1E3A5F" name="Unique Visitors" />
                  <Line type="monotone" dataKey="totalPageViews" stroke="#C9A961" name="Page Views" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User progression through purchase steps</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : funnelData.length > 0 ? (
                <div className="space-y-4">
                  {funnelData.map((step, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{step.name}</span>
                        <span className="text-sm text-gray-600">{step.value} ({step.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#1E3A5F] h-2 rounded-full"
                          style={{ width: `${step.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Device Breakdown
              </CardTitle>
              <CardDescription>Traffic distribution by device type</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>
              ) : deviceData.length > 0 && deviceData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">No data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cart Recovery & Post-Purchase Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Abandoned Cart Recovery</CardTitle>
              <CardDescription>Cart recovery email performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartMetricsQuery.isLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Abandoned</p>
                      <p className="text-2xl font-bold text-[#1E3A5F]">{cartMetricsQuery.data?.totalAbandoned || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recovered</p>
                      <p className="text-2xl font-bold text-[#5FA865]">{cartMetricsQuery.data?.totalRecovered || 0}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recovery Rate</p>
                    <p className="text-2xl font-bold text-[#C9A961]">{cartMetricsQuery.data?.recoveryRate.toFixed(1) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue Recovered</p>
                    <p className="text-2xl font-bold text-[#152B45]">{formatPrice(cartMetricsQuery.data?.revenueRecovered || 0)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle>Post-Purchase Performance</CardTitle>
              <CardDescription>Email engagement and reorder metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {postPurchaseQuery.isLoading ? (
                <div className="text-gray-500">Loading...</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Reorder Rate</p>
                      <p className="text-2xl font-bold text-[#1E3A5F]">{postPurchaseQuery.data?.reorderRate.toFixed(1) || 0}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Subscription Rate</p>
                      <p className="text-2xl font-bold text-[#5FA865]">{postPurchaseQuery.data?.subscriptionRate.toFixed(1) || 0}%</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Review Rate</p>
                    <p className="text-2xl font-bold text-[#C9A961]">{postPurchaseQuery.data?.reviewRate.toFixed(1) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tracked</p>
                    <p className="text-2xl font-bold text-[#152B45]">{postPurchaseQuery.data?.totalTracked || 0}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

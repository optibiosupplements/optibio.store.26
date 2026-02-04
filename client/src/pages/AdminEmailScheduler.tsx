import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Play,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  Star,
  Repeat,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminEmailScheduler() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAbandonedCartEmail, setSelectedAbandonedCartEmail] = useState<string>("all");
  const [selectedPostPurchaseEmail, setSelectedPostPurchaseEmail] = useState<string>("all");

  // Redirect non-admins
  if (!authLoading && (!user || user.role !== "admin")) {
    setLocation("/");
    return null;
  }

  // Fetch data
  const { data: schedulerStatus, refetch: refetchStatus } = trpc.adminEmailScheduler.getStatus.useQuery();
  const { data: abandonedCartStats, refetch: refetchAbandonedCart } = trpc.adminEmailScheduler.getAbandonedCartStats.useQuery();
  const { data: postPurchaseStats, refetch: refetchPostPurchase } = trpc.adminEmailScheduler.getPostPurchaseStats.useQuery();
  const { data: recentCarts, refetch: refetchRecentCarts } = trpc.adminEmailScheduler.getRecentAbandonedCarts.useQuery({ limit: 10 });

  // Mutations
  const triggerAbandonedCart = trpc.adminEmailScheduler.triggerAbandonedCartEmails.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetchAbandonedCart();
      refetchRecentCarts();
    },
    onError: (error) => {
      toast.error(`Failed to trigger emails: ${error.message}`);
    },
  });

  const triggerPostPurchase = trpc.adminEmailScheduler.triggerPostPurchaseEmails.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetchPostPurchase();
    },
    onError: (error) => {
      toast.error(`Failed to trigger emails: ${error.message}`);
    },
  });

  const handleRefreshAll = () => {
    refetchStatus();
    refetchAbandonedCart();
    refetchPostPurchase();
    refetchRecentCarts();
    toast.success("Data refreshed");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1E3A5F] text-white py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Mail className="w-7 h-7" />
                Email Scheduler
              </h1>
              <p className="text-white/80 mt-1">
                Automated email sequences for cart recovery and customer retention
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={schedulerStatus?.isRunning ? "default" : "destructive"}
                className={schedulerStatus?.isRunning ? "bg-green-500" : ""}
              >
                {schedulerStatus?.isRunning ? "Running" : "Stopped"}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshAll}
                className="text-white border-white/30 hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Abandoned Carts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{abandonedCartStats?.totalCarts || 0}</div>
              <p className="text-sm text-gray-500">
                {abandonedCartStats?.recoveredCarts || 0} recovered ({abandonedCartStats?.recoveryRate?.toFixed(1) || 0}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Post-Purchase Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postPurchaseStats?.totalOrders || 0}</div>
              <p className="text-sm text-gray-500">
                {postPurchaseStats?.reorders || 0} reorders ({postPurchaseStats?.reorderRate?.toFixed(1) || 0}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postPurchaseStats?.subscriptions || 0}</div>
              <p className="text-sm text-gray-500">
                {postPurchaseStats?.subscriptionRate?.toFixed(1) || 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postPurchaseStats?.reviews || 0}</div>
              <p className="text-sm text-gray-500">
                {postPurchaseStats?.reviewRate?.toFixed(1) || 0}% review rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="abandoned-cart" className="space-y-6">
          <TabsList>
            <TabsTrigger value="abandoned-cart" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Abandoned Cart
            </TabsTrigger>
            <TabsTrigger value="post-purchase" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Post-Purchase
            </TabsTrigger>
            <TabsTrigger value="recent-activity" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* Abandoned Cart Tab */}
          <TabsContent value="abandoned-cart" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Sequence Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Email Sequence Performance</CardTitle>
                  <CardDescription>
                    3-email recovery sequence: 1hr, 24hr, 48hr after abandonment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Gentle Reminder</p>
                          <p className="text-sm text-gray-500">1 hour after abandonment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{abandonedCartStats?.email1Sent || 0} sent</p>
                        <p className="text-sm text-amber-600">{abandonedCartStats?.pendingEmail1 || 0} pending</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold">
                          2
                        </div>
                        <div>
                          <p className="font-medium">5% Discount Offer</p>
                          <p className="text-sm text-gray-500">24 hours after abandonment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{abandonedCartStats?.email2Sent || 0} sent</p>
                        <p className="text-sm text-amber-600">{abandonedCartStats?.pendingEmail2 || 0} pending</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold">
                          3
                        </div>
                        <div>
                          <p className="font-medium">Final Urgency</p>
                          <p className="text-sm text-gray-500">48 hours after abandonment</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{abandonedCartStats?.email3Sent || 0} sent</p>
                        <p className="text-sm text-amber-600">{abandonedCartStats?.pendingEmail3 || 0} pending</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Trigger */}
              <Card>
                <CardHeader>
                  <CardTitle>Manual Trigger</CardTitle>
                  <CardDescription>
                    Manually send abandoned cart recovery emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select 
                      value={selectedAbandonedCartEmail} 
                      onValueChange={setSelectedAbandonedCartEmail}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select email" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sequences</SelectItem>
                        <SelectItem value="1">Email 1 (1hr)</SelectItem>
                        <SelectItem value="2">Email 2 (24hr)</SelectItem>
                        <SelectItem value="3">Email 3 (48hr)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => triggerAbandonedCart.mutate({ 
                        emailNumber: selectedAbandonedCartEmail as "1" | "2" | "3" | "all" 
                      })}
                      disabled={triggerAbandonedCart.isPending}
                    >
                      {triggerAbandonedCart.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Send Now
                    </Button>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Automatic Schedule</p>
                        <p className="text-sm text-amber-700 mt-1">
                          The scheduler runs automatically every 10 minutes to check for carts 
                          that need recovery emails. Manual trigger is for testing or catching up.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Post-Purchase Tab */}
          <TabsContent value="post-purchase" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Sequence Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Nurture Sequence Performance</CardTitle>
                  <CardDescription>
                    4-email retention sequence: Day 7, 21, 60, 90 after purchase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                          D7
                        </div>
                        <div>
                          <p className="font-medium">Check-in + Tips</p>
                          <p className="text-sm text-gray-500">7 days after purchase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{postPurchaseStats?.day7Sent || 0} sent</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          D21
                        </div>
                        <div>
                          <p className="font-medium">Review Request</p>
                          <p className="text-sm text-gray-500">21 days after purchase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{postPurchaseStats?.day21Sent || 0} sent</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm">
                          D60
                        </div>
                        <div>
                          <p className="font-medium">Replenishment Reminder</p>
                          <p className="text-sm text-gray-500">60 days after purchase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{postPurchaseStats?.day60Sent || 0} sent</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                          D90
                        </div>
                        <div>
                          <p className="font-medium">Subscribe & Save</p>
                          <p className="text-sm text-gray-500">90 days after purchase</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{postPurchaseStats?.day90Sent || 0} sent</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Trigger */}
              <Card>
                <CardHeader>
                  <CardTitle>Manual Trigger</CardTitle>
                  <CardDescription>
                    Manually send post-purchase nurture emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select 
                      value={selectedPostPurchaseEmail} 
                      onValueChange={setSelectedPostPurchaseEmail}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select email" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sequences</SelectItem>
                        <SelectItem value="7">Day 7 (Check-in)</SelectItem>
                        <SelectItem value="21">Day 21 (Review)</SelectItem>
                        <SelectItem value="60">Day 60 (Restock)</SelectItem>
                        <SelectItem value="90">Day 90 (Subscribe)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => triggerPostPurchase.mutate({ 
                        dayNumber: selectedPostPurchaseEmail as "7" | "21" | "60" | "90" | "all" 
                      })}
                      disabled={triggerPostPurchase.isPending}
                    >
                      {triggerPostPurchase.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Send Now
                    </Button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Automatic Schedule</p>
                        <p className="text-sm text-blue-700 mt-1">
                          The scheduler runs automatically every hour to check for orders 
                          that need nurture emails based on their purchase date.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 mx-auto text-green-600 mb-1" />
                      <p className="text-lg font-bold">{postPurchaseStats?.reorderRate?.toFixed(1) || 0}%</p>
                      <p className="text-xs text-gray-500">Reorder Rate</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Repeat className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                      <p className="text-lg font-bold">{postPurchaseStats?.subscriptionRate?.toFixed(1) || 0}%</p>
                      <p className="text-xs text-gray-500">Sub Rate</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                      <p className="text-lg font-bold">{postPurchaseStats?.reviewRate?.toFixed(1) || 0}%</p>
                      <p className="text-xs text-gray-500">Review Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="recent-activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Abandoned Carts</CardTitle>
                <CardDescription>
                  Latest carts tracked for recovery email sequences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Cart Value</TableHead>
                      <TableHead>Emails Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCarts && recentCarts.length > 0 ? (
                      recentCarts.map((cart) => (
                        <TableRow key={cart.id}>
                          <TableCell className="font-medium">
                            {cart.email || <span className="text-gray-400">No email</span>}
                          </TableCell>
                          <TableCell>{cart.totalValueFormatted}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {[1, 2, 3].map((num) => (
                                <Badge 
                                  key={num}
                                  variant={(cart.emailsSent as number[]).includes(num) ? "default" : "outline"}
                                  className={(cart.emailsSent as number[]).includes(num) ? "bg-green-500" : ""}
                                >
                                  {num}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {cart.isRecovered ? (
                              <Badge className="bg-green-500">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Recovered
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {new Date(cart.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No abandoned carts tracked yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Scheduler Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Scheduler Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1 flex items-center gap-2">
                  {schedulerStatus?.isRunning ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Running</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600 font-medium">Stopped</span>
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Run</p>
                <p className="mt-1">
                  {schedulerStatus?.lastRunTime 
                    ? new Date(schedulerStatus.lastRunTime).toLocaleString()
                    : "Never"
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Schedule</p>
                <p className="mt-1 text-sm">
                  Abandoned Cart: Every 10 min<br />
                  Post-Purchase: Every hour<br />
                  Daily Summary: 9:00 AM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

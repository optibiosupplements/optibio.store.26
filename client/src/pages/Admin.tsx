import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  LogOut,
  ExternalLink,
  Activity,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { formatPrice } from "@/const";

// Admin sidebar menu items - hidden from public, accessed via direct URL only
const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: DollarSign, label: "Revenue", path: "/admin/revenue" },
  { icon: Activity, label: "Traffic", path: "/admin/traffic" },
];

export default function Admin() {
  const [location, setLocation] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();

  // Fetch overview data for dashboard
  const { data: overview, isLoading: overviewLoading } = trpc.analytics.getOverview.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  // Redirect non-admin users to home (security)
  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <img
              src={APP_LOGO}
              alt={APP_TITLE}
              className="h-16 w-16 rounded-lg object-cover shadow-md"
            />
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-sm text-slate-500">
                Sign in with your admin account to continue
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            className="w-full bg-[#1E3A5F] hover:bg-[#2C5282]"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Redirect non-admin users
  if (user.role !== "admin") {
    return null;
  }

  const isLoading = overviewLoading;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        {/* Admin Sidebar */}
        <Sidebar className="border-r border-slate-200 bg-white">
          <SidebarHeader className="h-14 border-b border-slate-100 px-4">
            <div className="flex items-center gap-3">
              <img
                src={APP_LOGO}
                alt={APP_TITLE}
                className="h-8 w-8 rounded-md object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">OptiBio</span>
                <span className="text-xs text-slate-500">Admin Panel</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminMenuItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      className={`h-10 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#1E3A5F] text-white hover:bg-[#2C5282]"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {/* Quick Links */}
            <div className="mt-6 px-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Quick Links
              </p>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => window.open("/", "_blank")}
                    className="h-9 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm">View Store</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
                    className="h-9 text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Stripe Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full rounded-lg p-2 hover:bg-slate-100 transition-colors text-left">
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarFallback className="text-xs font-medium bg-[#1E3A5F] text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-6">
            <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-slate-100 lg:hidden" />
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
              </div>
            ) : (
              <>
                {/* Welcome Banner */}
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#1E3A5F] to-[#2C5282] text-white">
                  <h2 className="text-xl font-semibold mb-1">
                    Welcome back, {user?.name?.split(" ")[0] || "Admin"}
                  </h2>
                  <p className="text-sm text-white/80">
                    Here's what's happening with your store today.
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Monthly Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-[#C9A961]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900">
                        {formatPrice(overview?.mrr || 0)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        From active subscriptions
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Active Subscribers
                      </CardTitle>
                      <Users className="h-4 w-4 text-[#1E3A5F]" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900">
                        {overview?.activeSubscriptions || 0}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Recurring customers
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Total Revenue
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900">
                        {formatPrice(overview?.totalRevenue || 0)}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        All-time earnings
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        Churn Rate
                      </CardTitle>
                      <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900">
                        {overview?.churnRate?.toFixed(1) || "0.0"}%
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card
                    className="border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation("/admin/analytics")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#1E3A5F]/10">
                          <BarChart3 className="h-5 w-5 text-[#1E3A5F]" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Analytics</CardTitle>
                          <CardDescription>
                            View detailed subscription metrics
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card
                    className="border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation("/admin/revenue")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#C9A961]/10">
                          <DollarSign className="h-5 w-5 text-[#C9A961]" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Revenue</CardTitle>
                          <CardDescription>
                            Track sales and revenue trends
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card
                    className="border-slate-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation("/admin/traffic")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Traffic</CardTitle>
                          <CardDescription>
                            Monitor visitor analytics
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

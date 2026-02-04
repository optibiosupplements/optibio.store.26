import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl, formatPrice } from "@/const";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Package,
  Activity,
  LogOut,
  ExternalLink,
  Loader2,
  Truck,
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Box,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Admin sidebar menu items
const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Shipping", path: "/admin/shipping" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: DollarSign, label: "Revenue", path: "/admin/revenue" },
  { icon: Activity, label: "Traffic", path: "/admin/traffic" },
];

interface ShippingRate {
  carrier: string;
  service: string;
  rate: string;
  estimatedDays: number;
}

export default function AdminShipping() {
  const [location, setLocation] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showRatesDialog, setShowRatesDialog] = useState(false);
  const [showPackingSlipDialog, setShowPackingSlipDialog] = useState(false);
  const [packingSlipHtml, setPackingSlipHtml] = useState("");

  // Fetch pending shipments
  const { data: pendingOrders, isLoading: ordersLoading, refetch: refetchOrders } = 
    trpc.shipping.getPendingShipments.useQuery(undefined, {
      enabled: user?.role === "admin",
    });

  // Get rates state
  const [ratesData, setRatesData] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Create shipment mutation
  const createShipmentMutation = trpc.shipping.createShipment.useMutation({
    onSuccess: (data) => {
      toast.success(`Shipment created! Tracking: ${data.shipment?.trackingNumber || 'N/A'}`);
      setShowRatesDialog(false);
      setSelectedOrder(null);
      refetchOrders();
    },
    onError: (error) => {
      toast.error(`Failed to create shipment: ${error.message}`);
    },
  });

  // Packing slip state
  const [packingSlipLoading, setPackingSlipLoading] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E3A5F]" />
      </div>
    );
  }

  // Login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-16 w-16 rounded-lg object-cover shadow-md" />
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-slate-900">Admin Access</h1>
              <p className="text-sm text-slate-500">Sign in with your admin account to continue</p>
            </div>
          </div>
          <Button onClick={() => { window.location.href = getLoginUrl(); }} className="w-full bg-[#1E3A5F] hover:bg-[#2C5282]">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Non-admin
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500">You don't have permission to access this page.</p>
          <Button onClick={() => setLocation("/")} variant="outline">Go Home</Button>
        </div>
      </div>
    );
  }

  const handleGetRates = async (order: any) => {
    setSelectedOrder(order);
    setRatesLoading(true);
    try {
      // Use fetch directly since getRates is a query, not mutation
      const response = await fetch(`/api/trpc/shipping.getRates?input=${encodeURIComponent(JSON.stringify({
        address: {
          firstName: order.shippingFirstName,
          lastName: order.shippingLastName,
          address1: order.shippingAddress1,
          address2: order.shippingAddress2 || undefined,
          city: order.shippingCity,
          state: order.shippingState,
          zipCode: order.shippingZipCode,
          country: order.shippingCountry,
        },
        itemCount: 1,
      }))}`);
      const data = await response.json();
      if (data.result?.data) {
        setRatesData(data.result.data);
        setShowRatesDialog(true);
      } else {
        toast.error('Failed to get rates');
      }
    } catch (error: any) {
      toast.error(`Failed to get rates: ${error.message}`);
    } finally {
      setRatesLoading(false);
    }
  };

  const handleCreateShipment = (carrier?: string, service?: string) => {
    if (!selectedOrder) return;
    createShipmentMutation.mutate({
      orderId: selectedOrder.id,
      preferredCarrier: carrier,
      preferredService: service,
    });
  };

  const handlePrintPackingSlip = async (order: any) => {
    setSelectedOrder(order);
    setPackingSlipLoading(true);
    try {
      // Use fetch directly since getPackingSlip is a query
      const response = await fetch(`/api/trpc/shipping.getPackingSlip?input=${encodeURIComponent(JSON.stringify({
        orderId: order.id,
      }))}`);
      const data = await response.json();
      if (data.result?.data?.html) {
        setPackingSlipHtml(data.result.data.html);
        setShowPackingSlipDialog(true);
      } else {
        toast.error('Failed to generate packing slip');
      }
    } catch (error: any) {
      toast.error(`Failed to generate packing slip: ${error.message}`);
    } finally {
      setPackingSlipLoading(false);
    }
  };

  const printPackingSlip = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(packingSlipHtml);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg object-cover" />
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">OptiBio Admin</h2>
                <p className="text-xs text-slate-500">Shipping Management</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.path)}
                    isActive={location === item.path}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-slate-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#1E3A5F] text-white text-xs">
                      {user.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-slate-900">{user.name || "Admin"}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation("/")}>
                  <ExternalLink className="h-4 w-4 mr-2" /> View Store
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-900">Shipping Management</h1>
              <p className="text-sm text-slate-500">Manage orders, generate labels, and track shipments</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </header>

          <main className="p-6">
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" /> Pending Shipments
                  {pendingOrders && pendingOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-1">{pendingOrders.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="shipped" className="gap-2">
                  <Truck className="h-4 w-4" /> Shipped
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                  </div>
                ) : !pendingOrders || pendingOrders.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900">All Caught Up!</h3>
                      <p className="text-slate-500">No orders pending shipment.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pendingOrders.map((order: any) => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base flex items-center gap-2">
                                <Package className="h-4 w-4 text-[#1E3A5F]" />
                                Order #{order.orderNumber}
                              </CardTitle>
                              <CardDescription>
                                {new Date(order.createdAt).toLocaleDateString()} • {formatPrice(order.total)}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" /> Processing
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Shipping Address */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-slate-400" /> Ship To
                              </h4>
                              <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                                <p className="font-medium">{order.shippingFirstName} {order.shippingLastName}</p>
                                <p>{order.shippingAddress1}</p>
                                {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                                <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
                                <p>{order.shippingCountry}</p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                <Box className="h-4 w-4 text-slate-400" /> Items
                              </h4>
                              <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                                <p className="text-slate-500">Items will be shown on packing slip</p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-slate-200">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintPackingSlip(order)}
                              disabled={packingSlipLoading}
                            >
                              {packingSlipLoading && selectedOrder?.id === order.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4 mr-2" />
                              )}
                              Packing Slip
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGetRates(order)}
                              disabled={ratesLoading}
                            >
                              {ratesLoading && selectedOrder?.id === order.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <DollarSign className="h-4 w-4 mr-2" />
                              )}
                              Get Rates
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#1E3A5F] hover:bg-[#2C5282]"
                              onClick={() => {
                                setSelectedOrder(order);
                                handleCreateShipment();
                              }}
                              disabled={createShipmentMutation.isPending}
                            >
                              {createShipmentMutation.isPending && selectedOrder?.id === order.id ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Truck className="h-4 w-4 mr-2" />
                              )}
                              Ship (Lowest Rate)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="shipped">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Truck className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">Shipped Orders</h3>
                    <p className="text-slate-500">View shipped orders with tracking information.</p>
                    <p className="text-sm text-slate-400 mt-2">Coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>

      {/* Rates Dialog */}
      <Dialog open={showRatesDialog} onOpenChange={setShowRatesDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Shipping Rates</DialogTitle>
            <DialogDescription>
              Select a shipping option for Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {ratesData.map((rate: ShippingRate, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-[#1E3A5F] hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleCreateShipment(rate.carrier, rate.service)}
              >
                <div>
                  <p className="font-medium text-slate-900">{rate.carrier} - {rate.service}</p>
                  <p className="text-sm text-slate-500">{rate.estimatedDays} business days</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1E3A5F]">${rate.rate}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatesDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Packing Slip Dialog */}
      <Dialog open={showPackingSlipDialog} onOpenChange={setShowPackingSlipDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Packing Slip</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.orderNumber}
            </DialogDescription>
          </DialogHeader>
          <div 
            className="border border-slate-200 rounded-lg p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: packingSlipHtml }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPackingSlipDialog(false)}>Close</Button>
            <Button onClick={printPackingSlip} className="bg-[#1E3A5F] hover:bg-[#2C5282]">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

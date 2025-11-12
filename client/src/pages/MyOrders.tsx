import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, Truck, CheckCircle2, Clock, ArrowLeft, Loader2, ShoppingBag, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "wouter";
import { useState } from "react";

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Fetch user's orders
  const { data: orders, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: !!user,
  });

  // Fetch selected order details
  const { data: orderDetails, isLoading: orderDetailsLoading } = trpc.orders.getById.useQuery(
    { id: selectedOrderId! },
    { enabled: !!selectedOrderId }
  );

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "processing":
        return <Package className="w-5 h-5 text-[#1E3A5F]" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-[#C9A961]/10 text-[#1E3A5F] border-[#C9A961]/30";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-[#C9A961]/20 text-[#1E3A5F] border-[#C9A961]/30";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Loading state
  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#1E3A5F]" />
          <span className="text-slate-600">Loading your orders...</span>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#C9A961]/10 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-[#1E3A5F]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">Sign In Required</h1>
              <p className="text-slate-600">Please sign in to view your order history.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45]"
              >
                Sign In
              </Button>
              <Button variant="outline" onClick={() => setLocation("/")} className="w-full">
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Order detail view
  if (selectedOrderId && orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="outline"
            onClick={() => setSelectedOrderId(null)}
            className="mb-6 border-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <Card className="border-2 border-slate-200 shadow-xl">
            <CardContent className="p-8 space-y-6">
              {/* Order Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-slate-200">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Details</h1>
                  <p className="text-slate-600">Order #{orderDetails.orderNumber}</p>
                  <p className="text-sm text-slate-500">Placed on {formatDate(orderDetails.createdAt)}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold ${getStatusColor(orderDetails.status)}`}>
                  {getStatusIcon(orderDetails.status)}
                  {getStatusText(orderDetails.status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Items</h2>
                {orderDetails.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-2 border-slate-200 flex-shrink-0">
                      <img
                        src="/products/optibio-90cap-bottle-front.jpg"
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-slate-600">{item.variantName}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-slate-600">Qty: {item.quantity}</span>
                        <span className="font-semibold text-slate-900">{formatPrice(item.totalInCents)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-3 pt-6 border-t-2 border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderDetails.subtotalInCents)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>{formatPrice(orderDetails.shippingInCents)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>{formatPrice(orderDetails.taxInCents)}</span>
                </div>
                {orderDetails.discountInCents > 0 && (
                  <div className="flex justify-between text-[#C9A961]">
                    <span>Discount</span>
                    <span>-{formatPrice(orderDetails.discountInCents)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t-2 border-slate-200">
                  <span>Total</span>
                  <span>{formatPrice(orderDetails.totalInCents)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-6 border-t-2 border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Shipping Address</h2>
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <p className="font-semibold text-slate-900">
                    {orderDetails.shippingFirstName} {orderDetails.shippingLastName}
                  </p>
                  <p className="text-slate-600">{orderDetails.shippingAddress1}</p>
                  {orderDetails.shippingAddress2 && (
                    <p className="text-slate-600">{orderDetails.shippingAddress2}</p>
                  )}
                  <p className="text-slate-600">
                    {orderDetails.shippingCity}, {orderDetails.shippingState} {orderDetails.shippingZipCode}
                  </p>
                  <p className="text-slate-600">{orderDetails.shippingCountry}</p>
                  {orderDetails.shippingPhone && (
                    <p className="text-slate-600 mt-2">{orderDetails.shippingPhone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Orders list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#F7F4EF]/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-slate-600 hover:text-slate-900">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-400">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium">My Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Orders</h1>
          <p className="text-slate-600">View and track your OptiBio orders</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card className="border-2 border-slate-200 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">No Orders Yet</h2>
                <p className="text-slate-600">You haven't placed any orders yet. Start shopping to see your orders here!</p>
              </div>
              <Button
                onClick={() => setLocation("/shop")}
                className="bg-gradient-to-r from-[#1E3A5F] to-[#1E3A5F] hover:from-[#152B45] hover:to-[#152B45] shadow-lg"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">Order #{order.orderNumber}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        Total: {formatPrice(order.totalInCents)}
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedOrderId(order.id)}
                      variant="outline"
                      className="border-2"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

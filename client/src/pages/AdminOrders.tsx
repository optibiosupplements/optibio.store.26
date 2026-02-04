import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Package, 
  Search,
  RefreshCw,
  Eye,
  Truck,
  XCircle,
  DollarSign,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Ban,
  Loader2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Format price from cents
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

// Status badge colors
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-gray-100 text-gray-700 border-gray-200",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: RefreshCw,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Ban,
  refunded: DollarSign,
};

export default function AdminOrders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [actionDialog, setActionDialog] = useState<{type: string; orderId: number} | null>(null);
  const [actionData, setActionData] = useState<any>({});

  // Fetch orders
  const { data, isLoading, refetch } = trpc.adminOrders.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter as any,
    paymentStatus: paymentFilter as any,
  });

  // Fetch order stats
  const { data: stats } = trpc.adminOrders.getStats.useQuery();

  // Fetch selected order details
  const { data: orderDetails, isLoading: detailsLoading } = trpc.adminOrders.get.useQuery(
    { id: selectedOrder! },
    { enabled: !!selectedOrder }
  );

  // Mutations
  const updateStatus = trpc.adminOrders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated");
      setActionDialog(null);
      setActionData({});
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const cancelOrder = trpc.adminOrders.cancel.useMutation({
    onSuccess: () => {
      toast.success("Order cancelled");
      setActionDialog(null);
      setActionData({});
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const refundOrder = trpc.adminOrders.refund.useMutation({
    onSuccess: () => {
      toast.success("Refund processed");
      setActionDialog(null);
      setActionData({});
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const addNote = trpc.adminOrders.addNote.useMutation({
    onSuccess: () => {
      toast.success("Note added");
      setActionDialog(null);
      setActionData({});
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const handleAction = () => {
    if (!actionDialog) return;
    
    switch (actionDialog.type) {
      case "ship":
        updateStatus.mutate({
          id: actionDialog.orderId,
          status: "shipped",
          trackingNumber: actionData.trackingNumber,
          shippingCarrier: actionData.shippingCarrier,
        });
        break;
      case "deliver":
        updateStatus.mutate({
          id: actionDialog.orderId,
          status: "delivered",
        });
        break;
      case "process":
        updateStatus.mutate({
          id: actionDialog.orderId,
          status: "processing",
        });
        break;
      case "cancel":
        cancelOrder.mutate({
          id: actionDialog.orderId,
          reason: actionData.reason,
        });
        break;
      case "refund":
        refundOrder.mutate({
          id: actionDialog.orderId,
          reason: actionData.reason,
          amountInCents: actionData.partialRefund ? parseInt(actionData.amount) * 100 : undefined,
        });
        break;
      case "note":
        addNote.mutate({
          id: actionDialog.orderId,
          note: actionData.note,
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage orders, fulfillment, and refunds</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{stats?.byStatus.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Processing</p>
                <p className="text-2xl font-bold text-blue-800">{stats?.byStatus.processing || 0}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Shipped</p>
                <p className="text-2xl font-bold text-purple-800">{stats?.byStatus.shipped || 0}</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Delivered</p>
                <p className="text-2xl font-bold text-green-800">{stats?.byStatus.delivered || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Cancelled</p>
                <p className="text-2xl font-bold text-red-800">{stats?.byStatus.cancelled || 0}</p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Refunded</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.byStatus.refunded || 0}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, email, or name..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">No orders found</TableCell>
              </TableRow>
            ) : (
              data?.orders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Package;
                return (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order.id)}>
                    <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.shippingFirstName} {order.shippingLastName}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[order.status]} border`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentStatusColors[order.paymentStatus]}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatPrice(order.totalInCents)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order.id); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)} of {data.pagination.total} orders
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order {orderDetails?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Status and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge className={`${statusColors[orderDetails.status]} border text-base px-3 py-1`}>
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </Badge>
                  <Badge className={`${paymentStatusColors[orderDetails.paymentStatus]} text-base px-3 py-1`}>
                    Payment: {orderDetails.paymentStatus.charAt(0).toUpperCase() + orderDetails.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {orderDetails.status === "pending" && (
                    <Button size="sm" onClick={() => setActionDialog({ type: "process", orderId: orderDetails.id })}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Process
                    </Button>
                  )}
                  {orderDetails.status === "processing" && (
                    <Button size="sm" onClick={() => setActionDialog({ type: "ship", orderId: orderDetails.id })}>
                      <Truck className="h-4 w-4 mr-1" />
                      Ship
                    </Button>
                  )}
                  {orderDetails.status === "shipped" && (
                    <Button size="sm" onClick={() => setActionDialog({ type: "deliver", orderId: orderDetails.id })}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Delivered
                    </Button>
                  )}
                  {!["delivered", "cancelled", "refunded"].includes(orderDetails.status) && (
                    <Button size="sm" variant="destructive" onClick={() => setActionDialog({ type: "cancel", orderId: orderDetails.id })}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                  {orderDetails.paymentStatus === "paid" && orderDetails.status !== "refunded" && (
                    <Button size="sm" variant="outline" onClick={() => setActionDialog({ type: "refund", orderId: orderDetails.id })}>
                      <DollarSign className="h-4 w-4 mr-1" />
                      Refund
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setActionDialog({ type: "note", orderId: orderDetails.id })}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Note
                  </Button>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{orderDetails.customer?.name || `${orderDetails.shippingFirstName} ${orderDetails.shippingLastName}`}</p>
                    <p className="text-sm text-muted-foreground">{orderDetails.email}</p>
                    {orderDetails.shippingPhone && (
                      <p className="text-sm text-muted-foreground">{orderDetails.shippingPhone}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{orderDetails.shippingFirstName} {orderDetails.shippingLastName}</p>
                    <p>{orderDetails.shippingAddress1}</p>
                    {orderDetails.shippingAddress2 && <p>{orderDetails.shippingAddress2}</p>}
                    <p>{orderDetails.shippingCity}, {orderDetails.shippingState} {orderDetails.shippingZipCode}</p>
                    <p>{orderDetails.shippingCountry}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tracking Info */}
              {(orderDetails.trackingNumber || orderDetails.shippingCarrier) && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <Truck className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Tracking Information</p>
                        <p className="text-sm">
                          {orderDetails.shippingCarrier && <span className="font-medium">{orderDetails.shippingCarrier}: </span>}
                          {orderDetails.trackingNumber}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium">{item.productName}</p>
                            {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                            {item.sku && <p className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</p>}
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.priceInCents)}</TableCell>
                          <TableCell className="text-right">{formatPrice(item.totalInCents)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Order Totals */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderDetails.subtotalInCents)}</span>
                    </div>
                    {orderDetails.discountInCents > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(orderDetails.discountInCents)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{orderDetails.shippingInCents === 0 ? "Free" : formatPrice(orderDetails.shippingInCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatPrice(orderDetails.taxInCents)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(orderDetails.totalInCents)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              {orderDetails.adminNotes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Admin Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap font-sans">{orderDetails.adminNotes}</pre>
                  </CardContent>
                </Card>
              )}

              {/* Customer Notes */}
              {orderDetails.customerNotes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{orderDetails.customerNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Action Dialogs */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === "ship" && "Ship Order"}
              {actionDialog?.type === "deliver" && "Mark as Delivered"}
              {actionDialog?.type === "process" && "Process Order"}
              {actionDialog?.type === "cancel" && "Cancel Order"}
              {actionDialog?.type === "refund" && "Process Refund"}
              {actionDialog?.type === "note" && "Add Note"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionDialog?.type === "ship" && (
              <>
                <div className="space-y-2">
                  <Label>Shipping Carrier</Label>
                  <Select value={actionData.shippingCarrier || ""} onValueChange={(v) => setActionData({ ...actionData, shippingCarrier: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USPS">USPS</SelectItem>
                      <SelectItem value="UPS">UPS</SelectItem>
                      <SelectItem value="FedEx">FedEx</SelectItem>
                      <SelectItem value="DHL">DHL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tracking Number</Label>
                  <Input
                    value={actionData.trackingNumber || ""}
                    onChange={(e) => setActionData({ ...actionData, trackingNumber: e.target.value })}
                    placeholder="Enter tracking number"
                  />
                </div>
              </>
            )}

            {actionDialog?.type === "deliver" && (
              <p>Are you sure you want to mark this order as delivered?</p>
            )}

            {actionDialog?.type === "process" && (
              <p>Are you sure you want to start processing this order?</p>
            )}

            {actionDialog?.type === "cancel" && (
              <div className="space-y-2">
                <Label>Cancellation Reason *</Label>
                <Textarea
                  value={actionData.reason || ""}
                  onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                  placeholder="Enter reason for cancellation"
                  required
                />
              </div>
            )}

            {actionDialog?.type === "refund" && (
              <>
                <div className="space-y-2">
                  <Label>Refund Reason *</Label>
                  <Textarea
                    value={actionData.reason || ""}
                    onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                    placeholder="Enter reason for refund"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="partialRefund"
                    checked={actionData.partialRefund || false}
                    onChange={(e) => setActionData({ ...actionData, partialRefund: e.target.checked })}
                  />
                  <Label htmlFor="partialRefund">Partial refund</Label>
                </div>
                {actionData.partialRefund && (
                  <div className="space-y-2">
                    <Label>Refund Amount ($)</Label>
                    <Input
                      type="number"
                      value={actionData.amount || ""}
                      onChange={(e) => setActionData({ ...actionData, amount: e.target.value })}
                      placeholder="Enter amount"
                      step="0.01"
                    />
                  </div>
                )}
              </>
            )}

            {actionDialog?.type === "note" && (
              <div className="space-y-2">
                <Label>Note *</Label>
                <Textarea
                  value={actionData.note || ""}
                  onChange={(e) => setActionData({ ...actionData, note: e.target.value })}
                  placeholder="Enter admin note"
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>Cancel</Button>
            <Button 
              onClick={handleAction}
              disabled={
                (actionDialog?.type === "cancel" && !actionData.reason) ||
                (actionDialog?.type === "refund" && !actionData.reason) ||
                (actionDialog?.type === "note" && !actionData.note) ||
                updateStatus.isPending || cancelOrder.isPending || refundOrder.isPending || addNote.isPending
              }
              variant={actionDialog?.type === "cancel" || actionDialog?.type === "refund" ? "destructive" : "default"}
            >
              {(updateStatus.isPending || cancelOrder.isPending || refundOrder.isPending || addNote.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

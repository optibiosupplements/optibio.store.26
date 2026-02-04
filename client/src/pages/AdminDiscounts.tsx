import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Tag, 
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Format price from cents
const formatPrice = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

// Format discount value
const formatDiscount = (type: string, value: number) => {
  if (type === "percentage") {
    return `${value}%`;
  }
  return formatPrice(value);
};

// Get status badge for discount
const getDiscountStatus = (discount: any) => {
  const now = new Date();
  const startsAt = discount.startsAt ? new Date(discount.startsAt) : null;
  const expiresAt = discount.expiresAt ? new Date(discount.expiresAt) : null;
  
  if (!discount.isActive) {
    return { label: "Inactive", color: "bg-gray-100 text-gray-700", icon: XCircle };
  }
  if (expiresAt && expiresAt < now) {
    return { label: "Expired", color: "bg-red-100 text-red-700", icon: Clock };
  }
  if (startsAt && startsAt > now) {
    return { label: "Scheduled", color: "bg-blue-100 text-blue-700", icon: Calendar };
  }
  return { label: "Active", color: "bg-green-100 text-green-700", icon: CheckCircle };
};

export default function AdminDiscounts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);

  // Fetch discounts
  const { data, isLoading, refetch } = trpc.adminDiscounts.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter as any,
    type: typeFilter as any,
  });

  // Fetch stats
  const { data: stats } = trpc.adminDiscounts.getStats.useQuery();

  // Mutations
  const createDiscount = trpc.adminDiscounts.create.useMutation({
    onSuccess: () => {
      toast.success("Discount code created");
      setIsCreateOpen(false);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateDiscount = trpc.adminDiscounts.update.useMutation({
    onSuccess: () => {
      toast.success("Discount code updated");
      setEditingDiscount(null);
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteDiscount = trpc.adminDiscounts.delete.useMutation({
    onSuccess: () => {
      toast.success("Discount code deactivated");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code} to clipboard`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Discount Codes</h1>
          <p className="text-muted-foreground">Manage promotional codes and discounts</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Discount Code</DialogTitle>
              </DialogHeader>
              <DiscountForm
                onSubmit={(data) => createDiscount.mutate(data)}
                isLoading={createDiscount.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Codes</p>
                <p className="text-2xl font-bold">{stats?.totalCodes || 0}</p>
              </div>
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Active</p>
                <p className="text-2xl font-bold text-green-800">{stats?.activeCodes || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Expired</p>
                <p className="text-2xl font-bold text-red-800">{stats?.expiredCodes || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Uses</p>
                <p className="text-2xl font-bold text-blue-800">{stats?.totalUses || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Used Codes */}
      {stats?.mostUsed && stats.mostUsed.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performing Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.mostUsed.map((code) => (
                <Badge key={code.code} variant="secondary" className="px-3 py-1">
                  <span className="font-mono font-bold mr-2">{code.code}</span>
                  <span className="text-muted-foreground">
                    {formatDiscount(code.discountType, code.discountValue)} • {code.usedCount} uses
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code or description..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : data?.discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No discount codes found</TableCell>
              </TableRow>
            ) : (
              data?.discounts.map((discount) => {
                const status = getDiscountStatus(discount);
                const StatusIcon = status.icon;
                return (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{discount.code}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(discount.code)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      {discount.description && (
                        <p className="text-sm text-muted-foreground">{discount.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {discount.discountType === "percentage" ? (
                          <Percent className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{formatDiscount(discount.discountType, discount.discountValue)}</span>
                      </div>
                      {(discount.minPurchaseInCents || 0) > 0 && (
                        <p className="text-xs text-muted-foreground">Min: {formatPrice(discount.minPurchaseInCents || 0)}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{discount.usedCount || 0}</span>
                        {discount.maxUsesTotal && (
                          <span className="text-muted-foreground">/ {discount.maxUsesTotal}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {discount.maxUsesPerCustomer} per customer
                      </p>
                    </TableCell>
                    <TableCell>
                      {discount.startsAt && (
                        <p className="text-xs">
                          From: {new Date(discount.startsAt).toLocaleDateString()}
                        </p>
                      )}
                      {discount.expiresAt && (
                        <p className="text-xs">
                          Until: {new Date(discount.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                      {!discount.startsAt && !discount.expiresAt && (
                        <p className="text-xs text-muted-foreground">No expiry</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingDiscount(discount)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyCode(discount.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </DropdownMenuItem>
                          {discount.isActive && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                if (confirm("Deactivate this discount code?")) {
                                  deleteDiscount.mutate({ id: discount.id });
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)} of {data.pagination.total} codes
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

      {/* Edit Dialog */}
      <Dialog open={!!editingDiscount} onOpenChange={(open) => !open && setEditingDiscount(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Discount Code</DialogTitle>
          </DialogHeader>
          {editingDiscount && (
            <DiscountForm
              initialData={editingDiscount}
              onSubmit={(data) => updateDiscount.mutate({ id: editingDiscount.id, ...data })}
              isLoading={updateDiscount.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Discount Form Component
function DiscountForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: any; 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    description: initialData?.description || "",
    discountType: initialData?.discountType || "percentage",
    discountValue: initialData?.discountValue || "",
    minPurchaseInCents: initialData?.minPurchaseInCents ? (initialData.minPurchaseInCents || 0) / 100 : "",
    maxUsesTotal: initialData?.maxUsesTotal || "",
    maxUsesPerCustomer: initialData?.maxUsesPerCustomer || 1,
    isActive: initialData?.isActive ?? true,
    startsAt: initialData?.startsAt ? new Date(initialData.startsAt).toISOString().split('T')[0] : "",
    expiresAt: initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {
      code: formData.code.toUpperCase(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      discountValue: parseInt(formData.discountValue as string),
      minPurchaseInCents: formData.minPurchaseInCents ? Math.round(parseFloat(String(formData.minPurchaseInCents)) * 100) : 0,
      maxUsesTotal: formData.maxUsesTotal ? parseInt(formData.maxUsesTotal as string) : undefined,
      maxUsesPerCustomer: parseInt(formData.maxUsesPerCustomer as string),
      isActive: formData.isActive,
      startsAt: formData.startsAt || undefined,
      expiresAt: formData.expiresAt || undefined,
    };
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Code *</Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="SAVE20"
            className="font-mono"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select 
            value={formData.discountType} 
            onValueChange={(v) => setFormData({ ...formData, discountType: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          {formData.discountType === "percentage" ? "Discount Percentage *" : "Discount Amount (cents) *"}
        </Label>
        <div className="relative">
          {formData.discountType === "percentage" ? (
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          ) : (
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
            placeholder={formData.discountType === "percentage" ? "20" : "500"}
            className="pl-9"
            min="1"
            max={formData.discountType === "percentage" ? "100" : undefined}
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.discountType === "percentage" 
            ? "Enter a value between 1-100" 
            : "Enter amount in cents (e.g., 500 = $5.00)"}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Summer sale discount"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Purchase ($)</Label>
          <Input
            type="number"
            value={formData.minPurchaseInCents}
            onChange={(e) => setFormData({ ...formData, minPurchaseInCents: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Max Uses (Total)</Label>
          <Input
            type="number"
            value={formData.maxUsesTotal}
            onChange={(e) => setFormData({ ...formData, maxUsesTotal: e.target.value })}
            placeholder="Unlimited"
            min="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Max Uses Per Customer</Label>
        <Input
          type="number"
          value={formData.maxUsesPerCustomer}
          onChange={(e) => setFormData({ ...formData, maxUsesPerCustomer: e.target.value })}
          min="1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            type="date"
            value={formData.startsAt}
            onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input
            type="date"
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label>Active</Label>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? "Update" : "Create"} Code
        </Button>
      </DialogFooter>
    </form>
  );
}

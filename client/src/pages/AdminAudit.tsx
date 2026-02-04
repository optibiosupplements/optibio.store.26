import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  Search, 
  User,
  Calendar,
  Filter,
  FileText,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  Boxes
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminAudit() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.adminAudit.list.useQuery({
    page,
    limit: 50,
    search: search || undefined,
    action: actionFilter !== "all" ? actionFilter as any : undefined,
    resourceType: resourceFilter !== "all" ? resourceFilter as any : undefined,
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700";
      case "update":
        return "bg-blue-100 text-blue-700";
      case "delete":
        return "bg-red-100 text-red-700";
      case "view":
        return "bg-gray-100 text-gray-700";
      case "login":
        return "bg-purple-100 text-purple-700";
      case "logout":
        return "bg-purple-100 text-purple-700";
      case "refund":
        return "bg-orange-100 text-orange-700";
      case "cancel":
        return "bg-red-100 text-red-700";
      case "ship":
        return "bg-blue-100 text-blue-700";
      case "fulfill":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case "product":
        return <Package className="h-4 w-4" />;
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "customer":
        return <Users className="h-4 w-4" />;
      case "discount":
        return <Tag className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      case "settings":
        return <Settings className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "inventory":
        return <Boxes className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-muted-foreground">Track all admin actions and changes</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="cancel">Cancel</SelectItem>
            <SelectItem value="ship">Ship</SelectItem>
            <SelectItem value="fulfill">Fulfill</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="order">Order</SelectItem>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="discount">Discount</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="settings">Settings</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audit Log Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <History className="h-8 w-8 text-muted-foreground" />
                    <p>No audit logs found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(log.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {log.userName || `User #${log.userId}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getActionBadgeColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResourceIcon(log.resourceType)}
                      <span className="capitalize">{log.resourceType}</span>
                      {log.resourceId && (
                        <span className="text-muted-foreground">#{log.resourceId}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.changeDescription || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ipAddress || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === data.pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

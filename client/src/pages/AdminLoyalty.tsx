import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Gift, 
  Star, 
  Trophy, 
  Users, 
  Crown, 
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
  TrendingUp,
  Award,
  Percent,
  Truck,
  Package,
  ShoppingBag
} from "lucide-react";
import { Link, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

const tierColors = {
  bronze: "bg-amber-700",
  silver: "bg-slate-400",
  gold: "bg-yellow-500",
  platinum: "bg-purple-600",
};

const rewardTypeLabels = {
  discount_percent: "Percentage Discount",
  discount_fixed: "Fixed Discount",
  free_shipping: "Free Shipping",
  free_product: "Free Product",
  exclusive_access: "Exclusive Access",
};

export default function AdminLoyalty() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [bonusDialogOpen, setBonusDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // Form state for creating/editing rewards
  const [rewardForm, setRewardForm] = useState({
    name: "",
    description: "",
    pointsCost: 100,
    rewardType: "discount_percent" as const,
    rewardValue: 10,
    minTier: "bronze" as const,
    limitPerUser: undefined as number | undefined,
    totalLimit: undefined as number | undefined,
  });

  const [bonusForm, setBonusForm] = useState({
    points: 100,
    description: "",
  });

  // Queries
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = trpc.adminLoyalty.getStats.useQuery();
  const { data: rewards, isLoading: rewardsLoading, refetch: refetchRewards } = trpc.adminLoyalty.listRewards.useQuery();
  const { data: accountsData, isLoading: accountsLoading, refetch: refetchAccounts } = trpc.adminLoyalty.listAccounts.useQuery({ limit: 20, offset: 0 });
  const { data: recentTransactions, isLoading: transactionsLoading } = trpc.adminLoyalty.getRecentTransactions.useQuery({ limit: 10 });

  // Mutations
  const createRewardMutation = trpc.adminLoyalty.createReward.useMutation({
    onSuccess: () => {
      toast.success("Reward created successfully");
      setCreateDialogOpen(false);
      refetchRewards();
      refetchStats();
      resetRewardForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateRewardMutation = trpc.adminLoyalty.updateReward.useMutation({
    onSuccess: () => {
      toast.success("Reward updated successfully");
      setEditDialogOpen(false);
      refetchRewards();
      setSelectedReward(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteRewardMutation = trpc.adminLoyalty.deleteReward.useMutation({
    onSuccess: () => {
      toast.success("Reward deleted");
      refetchRewards();
      refetchStats();
    },
    onError: (error) => toast.error(error.message),
  });

  const awardBonusMutation = trpc.adminLoyalty.awardBonusPoints.useMutation({
    onSuccess: () => {
      toast.success("Bonus points awarded");
      setBonusDialogOpen(false);
      refetchAccounts();
      refetchStats();
      setSelectedAccount(null);
      setBonusForm({ points: 100, description: "" });
    },
    onError: (error) => toast.error(error.message),
  });

  // Auth check
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [authLoading, isAuthenticated, user, setLocation]);

  const resetRewardForm = () => {
    setRewardForm({
      name: "",
      description: "",
      pointsCost: 100,
      rewardType: "discount_percent",
      rewardValue: 10,
      minTier: "bronze",
      limitPerUser: undefined,
      totalLimit: undefined,
    });
  };

  const handleCreateReward = () => {
    createRewardMutation.mutate(rewardForm);
  };

  const handleUpdateReward = () => {
    if (!selectedReward) return;
    updateRewardMutation.mutate({
      id: selectedReward.id,
      ...rewardForm,
    });
  };

  const handleDeleteReward = (id: number) => {
    if (confirm("Are you sure you want to delete this reward?")) {
      deleteRewardMutation.mutate({ id });
    }
  };

  const handleAwardBonus = () => {
    if (!selectedAccount) return;
    awardBonusMutation.mutate({
      userId: selectedAccount.userId,
      ...bonusForm,
    });
  };

  const openEditDialog = (reward: any) => {
    setSelectedReward(reward);
    setRewardForm({
      name: reward.name,
      description: reward.description || "",
      pointsCost: reward.pointsCost,
      rewardType: reward.rewardType,
      rewardValue: reward.rewardValue,
      minTier: reward.minTier || "bronze",
      limitPerUser: reward.limitPerUser || undefined,
      totalLimit: reward.totalLimit || undefined,
    });
    setEditDialogOpen(true);
  };

  const openBonusDialog = (account: any) => {
    setSelectedAccount(account);
    setBonusDialogOpen(true);
  };

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Loyalty Program</h1>
            <p className="text-muted-foreground">Manage rewards, members, and points</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Reward
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Reward</DialogTitle>
                <DialogDescription>Add a new reward for members to redeem</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                    placeholder="e.g., 10% Off Next Order"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={rewardForm.description}
                    onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                    placeholder="Describe the reward..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Points Cost</Label>
                    <Input
                      type="number"
                      value={rewardForm.pointsCost}
                      onChange={(e) => setRewardForm({ ...rewardForm, pointsCost: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reward Value</Label>
                    <Input
                      type="number"
                      value={rewardForm.rewardValue}
                      onChange={(e) => setRewardForm({ ...rewardForm, rewardValue: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reward Type</Label>
                    <Select
                      value={rewardForm.rewardType}
                      onValueChange={(v: any) => setRewardForm({ ...rewardForm, rewardType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount_percent">% Discount</SelectItem>
                        <SelectItem value="discount_fixed">$ Discount</SelectItem>
                        <SelectItem value="free_shipping">Free Shipping</SelectItem>
                        <SelectItem value="free_product">Free Product</SelectItem>
                        <SelectItem value="exclusive_access">Exclusive Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Min Tier</Label>
                    <Select
                      value={rewardForm.minTier}
                      onValueChange={(v: any) => setRewardForm({ ...rewardForm, minTier: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="platinum">Platinum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateReward} disabled={createRewardMutation.isPending}>
                  {createRewardMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Reward
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.accounts.total.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Points Issued</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.accounts.pointsIssued.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Points Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.accounts.pointsBalance.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Redemptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.rewards.redemptions.toLocaleString() || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {[
                { key: "bronze", label: "Bronze", icon: Star, count: stats?.accounts.byTier.bronze || 0 },
                { key: "silver", label: "Silver", icon: Trophy, count: stats?.accounts.byTier.silver || 0 },
                { key: "gold", label: "Gold", icon: Crown, count: stats?.accounts.byTier.gold || 0 },
                { key: "platinum", label: "Platinum", icon: Sparkles, count: stats?.accounts.byTier.platinum || 0 },
              ].map((tier) => (
                <div key={tier.key} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tierColors[tier.key as keyof typeof tierColors]}`}>
                    <tier.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{tier.label}</p>
                    <p className="text-2xl font-bold">{tier.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Rewards, Members, Activity */}
        <Tabs defaultValue="rewards">
          <TabsList>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
                <CardDescription>{rewards?.length || 0} rewards configured</CardDescription>
              </CardHeader>
              <CardContent>
                {rewardsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : rewards && rewards.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reward</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Min Tier</TableHead>
                        <TableHead>Redeemed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{reward.name}</p>
                              {reward.description && (
                                <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                  {reward.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {rewardTypeLabels[reward.rewardType]}
                            </Badge>
                          </TableCell>
                          <TableCell>{reward.pointsCost.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={tierColors[reward.minTier || "bronze"]}>
                              {reward.minTier || "bronze"}
                            </Badge>
                          </TableCell>
                          <TableCell>{reward.timesRedeemed || 0}</TableCell>
                          <TableCell>
                            <Badge variant={reward.isActive ? "default" : "secondary"}>
                              {reward.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(reward)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReward(reward.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No rewards created yet</p>
                    <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                      Create First Reward
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Members</CardTitle>
                <CardDescription>View and manage member accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {accountsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : accountsData?.accounts && accountsData.accounts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Points Balance</TableHead>
                        <TableHead>Lifetime Points</TableHead>
                        <TableHead>Referral Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accountsData.accounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{account.userName || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{account.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={tierColors[account.tier]}>
                              {account.tier}
                            </Badge>
                          </TableCell>
                          <TableCell>{account.pointsBalance.toLocaleString()}</TableCell>
                          <TableCell>{account.lifetimePoints.toLocaleString()}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {account.referralCode}
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openBonusDialog(account)}
                            >
                              <Award className="h-4 w-4 mr-1" />
                              Award Points
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No loyalty members yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest points transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : recentTransactions && recentTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{tx.userName || "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{tx.userEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{tx.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={tx.points > 0 ? "text-emerald-600" : "text-red-600"}>
                              {tx.points > 0 ? "+" : ""}{tx.points.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{tx.description}</TableCell>
                          <TableCell>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No activity yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Reward Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
              <DialogDescription>Update reward details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points Cost</Label>
                  <Input
                    type="number"
                    value={rewardForm.pointsCost}
                    onChange={(e) => setRewardForm({ ...rewardForm, pointsCost: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reward Value</Label>
                  <Input
                    type="number"
                    value={rewardForm.rewardValue}
                    onChange={(e) => setRewardForm({ ...rewardForm, rewardValue: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label>Active</Label>
                <Switch
                  checked={selectedReward?.isActive}
                  onCheckedChange={(checked) => {
                    if (selectedReward) {
                      updateRewardMutation.mutate({ id: selectedReward.id, isActive: checked });
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateReward} disabled={updateRewardMutation.isPending}>
                {updateRewardMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Award Bonus Dialog */}
        <Dialog open={bonusDialogOpen} onOpenChange={setBonusDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Award Bonus Points</DialogTitle>
              <DialogDescription>
                Award points to {selectedAccount?.userName || selectedAccount?.userEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Points to Award</Label>
                <Input
                  type="number"
                  value={bonusForm.points}
                  onChange={(e) => setBonusForm({ ...bonusForm, points: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={bonusForm.description}
                  onChange={(e) => setBonusForm({ ...bonusForm, description: e.target.value })}
                  placeholder="e.g., Customer appreciation bonus"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBonusDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAwardBonus} 
                disabled={awardBonusMutation.isPending || !bonusForm.description}
              >
                {awardBonusMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Award Points
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

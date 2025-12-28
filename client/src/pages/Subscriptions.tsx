import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Package,
  Calendar,
  CreditCard,
  Pause,
  Play,
  XCircle,
  ArrowLeft,
  ExternalLink,
  SkipForward,
} from "lucide-react";
import { formatPrice } from "@/const";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Subscriptions() {
  const [, setLocation] = useLocation();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);

  const { data: subscriptions, isLoading } = trpc.subscriptions.list.useQuery();
  const utils = trpc.useUtils();

  const pauseMutation = trpc.subscriptions.pause.useMutation({
    onSuccess: () => {
      utils.subscriptions.list.invalidate();
      toast.success("Subscription paused successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to pause subscription");
    },
  });

  const resumeMutation = trpc.subscriptions.resume.useMutation({
    onSuccess: () => {
      utils.subscriptions.list.invalidate();
      toast.success("Subscription resumed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resume subscription");
    },
  });

  const skipMutation = trpc.subscriptions.skipNextDelivery.useMutation({
    onSuccess: (data: { success: boolean; newBillingDate: Date }) => {
      utils.subscriptions.list.invalidate();
      const newDate = new Date(data.newBillingDate).toLocaleDateString();
      toast.success(`Next delivery skipped! New billing date: ${newDate}`);
    },
    onError: () => {
      toast.error("Failed to skip delivery");
    },
  });

  const cancelMutation = trpc.subscriptions.cancel.useMutation({
    onSuccess: () => {
      utils.subscriptions.list.invalidate();
      toast.success("Subscription will be cancelled at the end of the billing period");
      setCancelDialogOpen(false);
      setSelectedSubscriptionId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });

  const portalMutation = trpc.subscriptions.createPortalSession.useMutation({
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Failed to open billing portal");
    },
  });

  const handlePause = (subscriptionId: string, id: number) => {
    pauseMutation.mutate({ id });
  };

  const handleResume = (subscriptionId: string, id: number) => {
    resumeMutation.mutate({ id });
  };

  const handleSkip = (subscriptionId: string) => {
    skipMutation.mutate({ subscriptionId });
  };

  const handleCancelClick = (subscriptionId: string, id: number) => {
    setSelectedSubscriptionId(id.toString());
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (selectedSubscriptionId) {
      cancelMutation.mutate({ id: parseInt(selectedSubscriptionId) });
    }
  };

  const handleUpdatePayment = () => {
    portalMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#F7F4EF] py-12">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3A5F]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#F7F4EF] py-12">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                My Subscriptions
              </h1>
              <p className="text-lg text-slate-600">
                Manage your recurring orders and billing
              </p>
            </div>

            {subscriptions && subscriptions.length > 0 && (
              <Button
                onClick={handleUpdatePayment}
                disabled={portalMutation.isPending}
                variant="outline"
                className="border-2"
              >
                {portalMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Update Payment
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Subscriptions List */}
        {!subscriptions || subscriptions.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-16 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Active Subscriptions
              </h3>
              <p className="text-slate-600 mb-6">
                You don't have any active subscriptions yet. Subscribe to save on your favorite products!
              </p>
              <Button onClick={() => setLocation("/shop")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {subscriptions.map(({ subscription, plan, product, variant }) => {
              const nextBilling = new Date(subscription.nextBillingDate);
              const isActive = subscription.status === "active";
              const isPaused = subscription.status === "paused";
              const isCancelled = subscription.status === "cancelled";

              return (
                <Card key={subscription.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-[#1E3A5F]" />
                        <div>
                          <CardTitle className="text-xl">
                            Optibio Ashwagandha KSM-66
                          </CardTitle>
                          <CardDescription className="text-base mt-1">
                            {subscription.quantity} bottle{subscription.quantity > 1 ? "s" : ""} every month
                          </CardDescription>
                        </div>
                      </div>

                      <Badge
                        variant={isActive ? "default" : isPaused ? "secondary" : "destructive"}
                        className="text-sm px-3 py-1"
                      >
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Subscription Details */}
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-600">Next Billing Date</div>
                          <div className="font-semibold text-slate-900">
                            {nextBilling.toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                        <div>
                          <div className="text-sm text-slate-600">Billing Amount</div>
                          <div className="font-semibold text-slate-900">
                            {formatPrice(subscription.priceInCents)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {isActive && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleSkip(subscription.stripeSubscriptionId || '')}
                            disabled={skipMutation.isPending}
                            className="border-[#C9A961]/30 hover:bg-[#F7F4EF] hover:border-[#C9A961]/40"
                          >
                            {skipMutation.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <SkipForward className="w-4 h-4 mr-2" />
                            )}
                            Skip Next Delivery
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handlePause(subscription.stripeSubscriptionId || '', subscription.id)}
                            disabled={pauseMutation.isPending}
                          >
                            {pauseMutation.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Pause className="w-4 h-4 mr-2" />
                            )}
                            Pause Subscription
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => handleCancelClick(subscription.stripeSubscriptionId || '', subscription.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancel Subscription
                          </Button>
                        </>
                      )}

                      {isPaused && (
                        <Button
                          variant="default"
                          onClick={() => handleResume(subscription.stripeSubscriptionId || '', subscription.id)}
                          disabled={resumeMutation.isPending}
                        >
                          {resumeMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          Resume Subscription
                        </Button>
                      )}

                      {isCancelled && (
                        <div className="text-sm text-slate-600">
                          This subscription will end on {nextBilling.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Your subscription will remain active until the end of your current billing period.
                  You won't be charged again after that.
                </p>
                <p className="font-medium text-slate-900">
                  Are you sure you want to cancel?
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel Subscription
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

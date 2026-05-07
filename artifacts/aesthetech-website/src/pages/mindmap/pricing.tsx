import { useState } from "react";
import { useCreatePaymentOrder, useVerifyPayment, useGetSubscription, getGetSubscriptionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { loadRazorpayScript } from "@/hooks/use-razorpay";
import { useQueryClient } from "@tanstack/react-query";

const PLANS = [
  { id: "monthly", name: "Monthly", price: "₹299", period: "per month", features: ["Unlimited assessments", "All challenges", "Basic analytics"] },
  { id: "annual", name: "Annual", price: "₹1,999", period: "per year", features: ["Unlimited assessments", "All challenges", "Advanced analytics", "Priority support"], popular: true },
  { id: "lifetime", name: "Lifetime", price: "₹4,999", period: "one time", features: ["Everything in Annual", "Lifetime updates", "1-on-1 mentorship session"] }
];

export default function MindMapPricing() {
  const { toast } = useToast();
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const queryClient = useQueryClient();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: subscription } = useGetSubscription({
    query: { queryKey: getGetSubscriptionQueryKey(), retry: false }
  });

  const handleSubscribe = async (planId: "monthly" | "annual" | "lifetime") => {
    setLoadingPlanId(planId);
    
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast({ title: "Error", description: "Razorpay SDK failed to load", variant: "destructive" });
      setLoadingPlanId(null);
      return;
    }

    createOrder.mutate({ data: { planId } }, {
      onSuccess: (orderData) => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "MindMap Career Compass",
          description: `Subscription to ${planId} plan`,
          order_id: orderData.orderId,
          handler: function (response: any) {
            verifyPayment.mutate({
              data: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                planId: planId
              }
            }, {
              onSuccess: () => {
                toast({ title: "Success", description: "Payment verified successfully!" });
                queryClient.invalidateQueries({ queryKey: getGetSubscriptionQueryKey() });
              },
              onError: () => {
                toast({ title: "Payment Verification Failed", variant: "destructive" });
              }
            });
          },
          prefill: {
            name: "User",
            email: "user@example.com",
          },
          theme: {
            color: "#6b46c1"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoadingPlanId(null);
      },
      onError: () => {
        toast({ title: "Failed to create order", variant: "destructive" });
        setLoadingPlanId(null);
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Invest in Your Future</h1>
        <p className="text-xl text-muted-foreground">Unlock the full potential of MindMap Career Compass.</p>
        
        {subscription?.isPremium && (
          <div className="mt-8 inline-block px-4 py-2 bg-green-500/20 text-green-500 rounded-full font-medium">
            You have an active {subscription.planId} subscription
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PLANS.map((plan, i) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card p-8 rounded-3xl relative flex flex-col ${plan.popular ? 'border-2 border-primary transform md:-translate-y-4 shadow-2xl shadow-primary/20' : 'border-t-2 border-t-white/10'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-display font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-2">{plan.period}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 text-muted-foreground">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</div>
                  {f}
                </li>
              ))}
            </ul>

            <Button 
              size="lg" 
              className={`w-full rounded-full ${plan.popular ? '' : 'variant-outline'}`}
              onClick={() => handleSubscribe(plan.id as "monthly" | "annual" | "lifetime")}
              disabled={loadingPlanId === plan.id || createOrder.isPending || subscription?.isPremium}
            >
              {loadingPlanId === plan.id ? "Processing..." : subscription?.isPremium ? "Current Plan" : "Choose Plan"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
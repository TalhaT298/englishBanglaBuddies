import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentInitData {
  amount: number;
  method: "bkash" | "sslcommerz" | "card" | "other";
  description: string;
}

export const paymentService = {
  initiatePayment: async (paymentData: PaymentInitData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // In a real app, you would call an edge function to handle payment gateway integration
      // For this demo, we'll simulate a successful payment

      // Create a transaction record
      const transactionId = `TX${Date.now()}`;

      const { data, error } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          amount: paymentData.amount,
          status: "completed", // In real app, this would initially be 'pending'
          method: paymentData.method,
          transaction_id: transactionId,
          description: paymentData.description,
        })
        .select()
        .single();

      if (error) throw error;

      // In a real app, after confirming payment success, you'd update subscription status

      return {
        success: true,
        transactionId,
        paymentData: data,
      };
    } catch (error: any) {
      console.error("Payment initiation error:", error.message);
      toast.error("Payment failed", {
        description: error.message,
      });
      return {
        success: false,
        error: error.message,
      };
    }
  },

  getPaymentHistory: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Get payment history error:", error.message);
      return [];
    }
  },
};

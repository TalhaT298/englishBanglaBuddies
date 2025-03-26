
import React from 'react';
import { useBkash } from 'react-bkash';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface BkashPaymentProps {
  amount: number;
  onSuccess: (data: any) => void;
}

const BkashPayment: React.FC<BkashPaymentProps> = ({ amount, onSuccess }) => {
  const { toast } = useToast();
  const { error, loading, triggerBkash } = useBkash({
    onSuccess: (data) => {
      console.log('Payment successful:', data);
      toast({
        title: "পেমেন্ট সফল হয়েছে",
        description: `${amount} টাকা পেমেন্ট সম্পন্ন হয়েছে`,
      });
      onSuccess(data);
    },
    onClose: () => {
      console.log('Bkash iFrame closed');
      toast({
        title: "পেমেন্ট বাতিল করা হয়েছে",
        variant: "destructive",
      });
    },
    // For development, using sandbox URL - replace with production URL in production
    bkashScriptURL: 'https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js',
    amount: amount,
    onCreatePayment: async (paymentRequest) => {
      // In a real app, you would call your backend API
      console.log('Creating payment with request:', paymentRequest);
      
      // Mock response for development purposes
      // In production, replace with actual API call
      return {
        paymentID: `PID${Math.floor(Math.random() * 1000000)}`,
        createTime: new Date().toISOString(),
        orgLogo: "https://sandbox.bka.sh/resources/logo/bkash_logo.png",
        orgName: "ইংরেজি গার্লফ্রেন্ড",
        transactionStatus: "Initiated",
        amount: amount.toString(),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV${Math.floor(Math.random() * 1000000)}`
      };
    },
    onExecutePayment: async (paymentID) => {
      // In a real app, you would call your backend API
      console.log('Executing payment with ID:', paymentID);
      
      // Mock response for development purposes
      // In production, replace with actual API call
      return {
        paymentID: paymentID,
        paymentExecuteTime: new Date().toISOString(),
        transactionStatus: "Completed",
        amount: amount.toString(),
        currency: "BDT",
        trxID: `TRX${Math.floor(Math.random() * 1000000)}`,
        merchantInvoiceNumber: `INV${Math.floor(Math.random() * 1000000)}`
      };
    },
  });
  
  if (loading) {
    return <div className="flex justify-center py-4">লোড হচ্ছে...</div>;
  }
  
  if (error) {
    return (
      <div className="text-red-500 py-4">
        <p>Error: {error.message}</p>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={triggerBkash}
        >
          আবার চেষ্টা করুন
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={triggerBkash}
      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
    >
      বিকাশ দিয়ে পেমেন্ট করুন
    </Button>
  );
};

export default BkashPayment;

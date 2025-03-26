
import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

interface SSLCommerzPaymentProps {
  amount: number;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
  };
  productInfo?: {
    name: string;
    category: string;
  };
  onSuccess?: (data: any) => void;
  onFail?: (error: any) => void;
}

const SSLCommerzPayment: React.FC<SSLCommerzPaymentProps> = ({
  amount,
  customerInfo = {
    name: 'Customer Name',
    email: 'customer@example.com',
    phone: '01711111111',
    address: 'Dhaka',
    city: 'Dhaka',
    postcode: '1000',
  },
  productInfo = {
    name: 'English Learning Package',
    category: 'Education',
  },
  onSuccess,
  onFail,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Generate a unique transaction ID for this payment
      const transactionId = `TRX${Date.now()}`;
      
      // Prepare the payment data
      const paymentData = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: transactionId,
        product_name: productInfo.name,
        product_category: productInfo.category,
        cus_name: customerInfo.name,
        cus_email: customerInfo.email,
        cus_phone: customerInfo.phone,
        cus_add1: customerInfo.address,
        cus_city: customerInfo.city,
        cus_postcode: customerInfo.postcode,
      };

      // Initialize the payment
      const response = await api.payment.initSSLCommerz(paymentData);
      
      if (response.data && response.data.GatewayPageURL) {
        // Redirect to the SSLCommerz payment page
        window.location.href = response.data.GatewayPageURL;
      } else {
        // For demo purposes in case backend isn't connected yet
        console.log('SSLCommerz gateway URL not found in response, using demo flow');
        toast({
          title: "ডেমো মোড",
          description: "আসল SSLCommerz ব্যাকএন্ড কানেকশন সেটআপ করা হয়নি। ডেমো মোড চলছে।",
        });
        
        // Simulate a successful payment after a delay
        setTimeout(() => {
          toast({
            title: "পেমেন্ট সফল হয়েছে (ডেমো)",
            description: `${amount} টাকা পেমেন্ট সম্পন্ন হয়েছে (ডেমো মোড)`,
          });
          
          if (onSuccess) {
            onSuccess({
              tran_id: transactionId,
              amount: amount,
              status: 'VALID',
              card_type: 'VISA',
            });
          }
          
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "পেমেন্ট ব্যর্থ হয়েছে",
        description: "পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      
      if (onFail) {
        onFail(error);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-green-600 hover:bg-green-700 text-white"
    >
      {isLoading ? (
        'প্রক্রিয়াকরণ হচ্ছে...'
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          এসএসএল কমার্জ দিয়ে পেমেন্ট করুন
        </>
      )}
    </Button>
  );
};

export default SSLCommerzPayment;

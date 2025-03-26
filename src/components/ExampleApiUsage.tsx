
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ExampleApiUsage = () => {
  const [girlfriends, setGirlfriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate progress
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const fetchGirlfriends = async () => {
    setIsLoading(true);
    try {
      // Fetch data from Supabase
      const { data, error } = await supabase
        .from('girlfriends')
        .select('*');
      
      if (error) throw error;
      
      setGirlfriends(data);
      toast({
        title: "ডাটা লোড হয়েছে",
        description: "সার্ভার থেকে ডাটা সফলভাবে লোড হয়েছে।",
      });
    } catch (error) {
      console.error('Error fetching girlfriends:', error);
      toast({
        title: "ত্রুটি!",
        description: "ডাটা লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
      
      // For demo purposes, let's add some mock data when backend isn't available
      setGirlfriends([
        { id: 1, name: "মারিয়া" },
        { id: 2, name: "ন্যান্সি" },
        { id: 3, name: "সারাহ" },
      ]);
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">সুপাবেজ API উদাহরণ</h2>
      
      {isLoading && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">ডাটা লোড হচ্ছে...</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <Button 
        onClick={fetchGirlfriends} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'লোড হচ্ছে...' : 'ডাটা লোড করুন'}
      </Button>
      
      {girlfriends.length > 0 && (
        <div className="mt-4 border rounded-md p-4">
          <h3 className="font-medium mb-2">গার্লফ্রেন্ড তালিকা</h3>
          <ul className="space-y-2">
            {girlfriends.map((girl) => (
              <li key={girl.id} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                {girl.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExampleApiUsage;

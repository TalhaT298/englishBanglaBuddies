
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyChat = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">কোনো চ্যাট নেই</h3>
      <p className="text-gray-500 mb-4">চ্যাট করার জন্য সাথীরা পেইজ থেকে একজন সাথীকে যোগ করো</p>
      <Button onClick={() => navigate('/girlfriends')}>
        সাথী খুঁজুন
      </Button>
    </div>
  );
};

export default EmptyChat;

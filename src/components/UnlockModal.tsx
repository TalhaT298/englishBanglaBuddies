
import React from 'react';
import { X, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Girlfriend } from './GirlfriendCard';

interface UnlockModalProps {
  girlfriend: Girlfriend;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const UnlockModal: React.FC<UnlockModalProps> = ({ girlfriend, isOpen, onClose, onUnlock }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl animate-scale-up">
        <div className="relative">
          <img 
            src={girlfriend.avatar} 
            alt={girlfriend.name}
            className="w-full h-48 object-cover object-center" 
          />
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 w-8 h-8 bg-black/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <h2 className="text-xl font-semibold">{girlfriend.name} আনলক করুন</h2>
          <p className="text-sm text-gray-500 mt-1">বিষয়: {girlfriend.topic}</p>
          
          <div className="mt-4 space-y-4">
            <p className="text-sm">
              {girlfriend.name} আপনাকে {girlfriend.topic} এর ইংরেজি কথোপকথন শিখাবে। আনলক করার পরে আপনি যেকোনো সময় চ্যাট করতে পারবেন।
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <h3 className="text-sm font-medium mb-2">এই আনলক এ থাকছে:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">অসীম চ্যাট সুবিধা</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">ভয়েস মেসেজ সাপোর্ট</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">ছবি শেয়ারিং</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">কন্টেক্সট বেইজড লার্নিং</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={onUnlock}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12"
              >
                <Lock className="w-4 h-4 mr-2" />
                ১০০ পয়েন্ট দিয়ে আনলক করুন
              </Button>
              
              <Button 
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-300 text-gray-700 dark:text-gray-300 h-10"
              >
                বাতিল করুন
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;

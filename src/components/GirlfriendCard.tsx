
import React from 'react';
import { Heart, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GirlfriendProfile } from '@/types/girlfriend';

interface GirlfriendCardProps {
  girlfriend: GirlfriendProfile;
  onLike: (girlfriend: GirlfriendProfile) => void;
  onDislike: (girlfriend: GirlfriendProfile) => void;
  onUnlock: (girlfriend: GirlfriendProfile) => void;
}

export type Girlfriend = GirlfriendProfile;

const GirlfriendCard: React.FC<GirlfriendCardProps> = ({ 
  girlfriend, 
  onLike, 
  onDislike, 
  onUnlock 
}) => {
  const { name, avatar, description, level, topic, occupation, personality, isUnlocked } = girlfriend;

  return (
    <div className="w-full rounded-2xl overflow-hidden glass-card transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="relative">
        <img 
          src={avatar} 
          alt={name}
          className="w-full h-64 object-cover object-center" 
        />
        <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
          <span>লেভেল {level}</span>
        </div>
        
        <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center">
          <span>{occupation}</span>
        </div>
        
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <Lock className="w-8 h-8 text-white mb-2" />
            <p className="text-white font-medium">আনলক করুন</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{name}</h3>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">বিষয়: {topic}</p>
        
        <p className="text-sm mt-3 text-gray-600 line-clamp-2">{description}</p>
        
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-xs text-gray-600 dark:text-gray-300">
          <p className="italic">"{personality}"</p>
        </div>
        
        {isUnlocked ? (
          <div className="mt-4 flex gap-3">
            <Button 
              onClick={() => onDislike(girlfriend)} 
              variant="outline" 
              size="icon"
              className="w-14 h-14 rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
            >
              <X className="w-8 h-8" />
            </Button>
            
            <Button 
              onClick={() => onLike(girlfriend)} 
              className="flex-1 bg-gradient-to-r from-girlfriend-pink to-girlfriend-lavender hover:opacity-90 text-white h-14 rounded-full"
            >
              <Heart className="w-6 h-6 mr-2" />
              চ্যাট করুন
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => onUnlock(girlfriend)} 
            variant="outline" 
            className="w-full mt-4 border-primary text-primary hover:bg-primary/10 h-14 rounded-full"
          >
            আনলক করুন
          </Button>
        )}
      </div>
    </div>
  );
};

export default GirlfriendCard;

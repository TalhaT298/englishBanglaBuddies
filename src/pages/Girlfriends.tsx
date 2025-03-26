
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import GirlfriendCard, { Girlfriend } from '@/components/GirlfriendCard';
import UnlockModal from '@/components/UnlockModal';
import Navbar from '@/components/Navbar';
import { girlfriendService } from '@/services/girlfriendService';
import { GirlfriendProfile } from '@/types/girlfriend';

const Girlfriends = () => {
  const navigate = useNavigate();
  const [girlfriends, setGirlfriends] = useState<GirlfriendProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGirlfriend, setSelectedGirlfriend] = useState<GirlfriendProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGirlfriends, setHasGirlfriends] = useState(false);
  
  // Fetch girlfriends from Supabase
  useEffect(() => {
    const fetchGirlfriends = async () => {
      setIsLoading(true);
      try {
        const data = await girlfriendService.getAllGirlfriends();
        setGirlfriends(data);
        setHasGirlfriends(data.length > 0);
      } catch (error) {
        console.error('Error fetching girlfriends:', error);
        toast.error('Failed to load girlfriends');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGirlfriends();
  }, []);
  
  const filteredGirlfriends = girlfriends.filter(girl => 
    girl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    girl.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    girl.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = (girlfriend: GirlfriendProfile) => {
    // Save selected girlfriend to local storage
    localStorage.setItem('selectedGirlfriend', JSON.stringify(girlfriend));
    navigate('/chat');
  };

  const handleDislike = (girlfriend: GirlfriendProfile) => {
    // Move to next card
    setCurrentIndex(prev => (prev + 1) % filteredGirlfriends.length);
    toast("পরবর্তী প্রোফাইল দেখানো হচ্ছে", {
      description: `আপনি ${girlfriend.name} কে পছন্দ করেননি।`,
    });
  };

  const handleUnlockModal = (girlfriend: GirlfriendProfile) => {
    setSelectedGirlfriend(girlfriend);
    setIsModalOpen(true);
  };

  const handleUnlock = async () => {
    if (!selectedGirlfriend) return;
    
    try {
      const success = await girlfriendService.unlockGirlfriend(selectedGirlfriend.id!);
      
      if (success) {
        setGirlfriends(prev => 
          prev.map(girl => 
            girl.id === selectedGirlfriend.id ? { ...girl, isUnlocked: true } : girl
          )
        );
        
        setIsModalOpen(false);
        toast("আনলক সম্পন্ন হয়েছে!", {
          description: `${selectedGirlfriend.name} এখন আপনার সাথে চ্যাট করতে পারবে।`,
        });
      }
    } catch (error) {
      console.error('Error unlocking girlfriend:', error);
      toast.error('Failed to unlock profile');
    }
  };

  // Get current girlfriend to display in Tinder-like fashion
  const currentGirlfriend = filteredGirlfriends[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-md mx-auto px-4 pb-24 pt-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-6 animate-fade-in">সাথীরা</h1>
          
          <div className="relative mb-6 animate-fade-in">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="সার্চ করুন..."
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tinder-like Swipe Interface */}
          {filteredGirlfriends.length > 0 && (
            <div className="relative w-full h-auto mb-6">
              {currentGirlfriend && (
                <GirlfriendCard
                  key={currentGirlfriend.id}
                  girlfriend={currentGirlfriend}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onUnlock={handleUnlockModal}
                />
              )}
            </div>
          )}
          
          {/* Browse All */}
          {filteredGirlfriends.length > 0 ? (
            <>
              <h2 className="text-sm font-medium text-gray-500 mb-3 animate-fade-in mt-4">সমস্ত সাথী</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredGirlfriends.map((girlfriend) => (
                  <GirlfriendCard
                    key={girlfriend.id}
                    girlfriend={girlfriend}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onUnlock={handleUnlockModal}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center p-8">
              <p>কোন সাথী পাওয়া যায়নি</p>
            </div>
          )}
        </div>
      </div>
      
      {selectedGirlfriend && (
        <UnlockModal 
          girlfriend={selectedGirlfriend}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUnlock={handleUnlock}
        />
      )}
      
      <Navbar />
    </div>
  );
};

export default Girlfriends;

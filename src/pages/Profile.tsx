import React, { useState } from 'react';
import { Bell, CreditCard, Heart, HelpCircle, LogOut, Settings, Trophy, User, Smartphone, Calendar, Gift, Award, Flame, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import BkashPayment from '@/components/BkashPayment';
import SSLCommerzPayment from '@/components/SSLCommerzPayment';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, format, startOfMonth, startOfWeek, subDays } from 'date-fns';

// Sample streak data
const streakData = [
  { date: subDays(new Date(), 5), completed: true },
  { date: subDays(new Date(), 4), completed: true },
  { date: subDays(new Date(), 3), completed: true },
  { date: subDays(new Date(), 2), completed: false },
  { date: subDays(new Date(), 1), completed: true },
  { date: new Date(), completed: true },
];

// Sample achievements data
const achievements = [
  { id: 1, name: "প্রথম কথোপকথন", icon: <Trophy className="w-8 h-8 text-yellow-500" />, description: "মারিয়ার সাথে প্রথম কথোপকথন সম্পন্ন" },
  { id: 2, name: "৫ দিনের স্ট্রিক", icon: <Flame className="w-8 h-8 text-orange-500" />, description: "৫ দিন টানা ইংরেজি অনুশীলন" },
  { id: 3, name: "চকোলেট গিফট", icon: <Gift className="w-8 h-8 text-pink-500" />, description: "মারিয়া থেকে পাওয়া প্রথম উপহার" },
  { id: 4, name: "বেসিক শব্দভান্ডার", icon: <Award className="w-8 h-8 text-blue-500" />, description: "১০০টি বেসিক শব্দ শিখেছেন" },
];

const StreakCalendar = () => {
  const today = new Date();
  const startDate = subDays(today, 20); // Show last 3 weeks
  
  // Generate dates for the calendar
  const calendarDates = [];
  let currentDate = startDate;
  
  while (currentDate <= today) {
    calendarDates.push({
      date: new Date(currentDate),
      day: format(currentDate, 'd'),
      isActive: streakData.some(
        sd => format(sd.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd') && sd.completed
      )
    });
    currentDate = addDays(currentDate, 1);
  }
  
  // Group dates by week
  const weeks = [];
  let week = [];
  
  for (let i = 0; i < calendarDates.length; i++) {
    week.push(calendarDates[i]);
    if (week.length === 7 || i === calendarDates.length - 1) {
      weeks.push([...week]);
      week = [];
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm justify-between mb-2">
        <div className="flex items-center space-x-1">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="font-medium">৩ দিনের স্ট্রিক চলছে</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Calendar className="h-4 w-4" />
              <span className="sr-only">কাস্টম ক্যালেন্ডার দেখুন</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="rounded-md border">
              <div className="grid grid-cols-7 gap-1 p-2">
                {['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'].map((day, i) => (
                  <div key={i} className="text-center text-xs font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {weeks.map((week, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`h-7 w-7 p-0 text-center text-xs rounded-full flex items-center justify-center ${
                          day.isActive
                            ? 'bg-gradient-to-r from-girlfriend-pink to-girlfriend-lavender text-white'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex space-x-1 overflow-x-auto pb-2">
        {calendarDates.slice(-7).map((day, i) => (
          <div key={i} className="flex flex-col items-center min-w-[2.5rem]">
            <div className="text-xs text-gray-500">{format(day.date, 'E')}</div>
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs mt-1 ${
                day.isActive 
                  ? 'bg-gradient-to-r from-girlfriend-pink to-girlfriend-lavender text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              {day.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showBkashDialog, setShowBkashDialog] = useState(false);
  const [showSSLCommerzDialog, setShowSSLCommerzDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(100);
  const { toast } = useToast();

  const handlePaymentMethodClick = () => {
    setShowPaymentDialog(true);
  };

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowPaymentDialog(false);
    
    if (method === 'বিকাশ') {
      setShowBkashDialog(true);
    } else if (method === 'এসএসএল কমার্জ') {
      setShowSSLCommerzDialog(true);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('Payment successful:', data);
    setShowBkashDialog(false);
    setShowSSLCommerzDialog(false);
    toast({
      title: "সাফল্য!",
      description: "আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-md mx-auto px-4 pb-24 pt-8">
        <h1 className="text-2xl font-bold mb-6 animate-fade-in">প্রোফাইল</h1>
        
        <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-girlfriend-pink to-girlfriend-lavender flex items-center justify-center text-white text-2xl font-bold avatar-glow">
                <User className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white" />
            </div>
            
            <div className="ml-4">
              <h2 className="font-semibold text-lg">ইংলিশ শিক্ষার্থী</h2>
              <p className="text-gray-500 text-sm">beginner@example.com</p>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-girlfriend-pink/10 text-girlfriend-pink px-2 py-0.5 rounded-full">
                  বিগিনার লেভেল
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Streak Calendar Card */}
        <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
          <h2 className="font-medium mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-girlfriend-pink" />
            দৈনিক স্ট্রিক
          </h2>
          
          <StreakCalendar />
        </div>
        
        <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
          <h2 className="font-medium mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-girlfriend-pink" />
            আপনার প্রগ্রেস
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">ইংরেজি স্কিল</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <Progress value={30} className="h-2 bg-gray-200" glowing />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">অনলক করা সাথী</span>
                <span className="text-sm font-medium">1/12</span>
              </div>
              <Progress value={8} className="h-2 bg-gray-200" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">দৈনিক স্ট্রিক</span>
                <span className="text-sm font-medium">3 দিন</span>
              </div>
              <Progress value={60} className="h-2 bg-gray-200" glowing />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">ওভারঅল প্রগ্রেস</span>
                <span className="text-sm font-medium">লেভেল ১ (35%)</span>
              </div>
              <div className="relative">
                <Progress value={35} 
                  className="h-3 bg-gray-200" 
                  glowing
                />
                <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="relative">
                      <div className="absolute w-0.5 h-3 bg-white/50" />
                      <div className="absolute -bottom-5 -translate-x-1/2 text-xs text-gray-500">
                        {level}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in">
          <h2 className="font-medium mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-girlfriend-pink" />
            অর্জন এবং উপহার
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{achievement.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Locked Achievement */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 opacity-50">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">লক করা</p>
                  <p className="text-xs text-gray-500 mt-1">আরও অগ্রগতির জন্য অপেক্ষা করুন</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden mb-6 divide-y divide-gray-100 dark:divide-gray-800 animate-fade-in">
          <div className="p-4">
            <h2 className="font-medium mb-3">অর্জন</h2>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-girlfriend-pink/10 flex items-center justify-center mb-1">
                  <Trophy className="w-6 h-6 text-girlfriend-pink" />
                </div>
                <span className="text-xs text-center">3 দিন স্ট্রিক</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-girlfriend-lavender/10 flex items-center justify-center mb-1">
                  <Heart className="w-6 h-6 text-girlfriend-lavender" />
                </div>
                <span className="text-xs text-center">1 সাথী</span>
              </div>
              
              <div className="flex flex-col items-center opacity-40">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1">
                  <Trophy className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-center">লক করা</span>
              </div>
              
              <div className="flex flex-col items-center opacity-40">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-1">
                  <Trophy className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-xs text-center">লক করা</span>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="font-medium mb-3">সেটিংস</h2>
            
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 font-normal">
                <Bell className="w-5 h-5 mr-3 text-gray-500" />
                নোটিফিকেশন
              </Button>
              
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 dark:text-gray-300 font-normal"
                    onClick={handlePaymentMethodClick}
                  >
                    <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                    পেমেন্ট মেথড {selectedPaymentMethod && `(${selectedPaymentMethod})`}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>পেমেন্ট মেথড বেছে নিন</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div 
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSelectPaymentMethod('বিকাশ')}
                    >
                      <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                        <Smartphone className="w-5 h-5 text-pink-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">বিকাশ</h3>
                        <p className="text-sm text-gray-500">বিকাশ মোবাইল ব্যাংকিং দিয়ে পেমেন্ট করুন</p>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => handleSelectPaymentMethod('এসএসএল কমার্জ')}
                    >
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CreditCard className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">এসএসএল কমার্জ</h3>
                        <p className="text-sm text-gray-500">ক্রেডিট কার্ড, ডেবিট কার্ড, মোবাইল ব্যাংকিং</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showBkashDialog} onOpenChange={setShowBkashDialog}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>বিকাশ পেমেন্ট</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">পরিমাণ নির্বাচন করুন</p>
                      <div className="flex gap-2">
                        {[100, 200, 500, 1000].map((amount) => (
                          <Button 
                            key={amount}
                            variant={paymentAmount === amount ? "default" : "outline"}
                            onClick={() => setPaymentAmount(amount)}
                          >
                            {amount}৳
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <BkashPayment 
                        amount={paymentAmount} 
                        onSuccess={handlePaymentSuccess} 
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showSSLCommerzDialog} onOpenChange={setShowSSLCommerzDialog}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>এসএসএল কমার্জ পেমেন্ট</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">পরিমাণ নির্বাচন করুন</p>
                      <div className="flex gap-2">
                        {[100, 200, 500, 1000].map((amount) => (
                          <Button 
                            key={amount}
                            variant={paymentAmount === amount ? "default" : "outline"}
                            onClick={() => setPaymentAmount(amount)}
                          >
                            {amount}৳
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <SSLCommerzPayment 
                        amount={paymentAmount} 
                        onSuccess={handlePaymentSuccess} 
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 font-normal">
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                অ্যাপ সেটিংস
              </Button>
              
              <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 font-normal">
                <HelpCircle className="w-5 h-5 mr-3 text-gray-500" />
                সাহায্য
              </Button>
              
              <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300 font-normal">
                <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                লগ আউট
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Profile;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Award, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExampleApiUsage from '@/components/ExampleApiUsage';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-md mx-auto px-4 pb-20 pt-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">ইংরেজি গার্লফ্রেন্ড</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            ইংরেজি শিখুন আপনার কাল্পনিক সাথীর সাথে
          </p>
        </div>
        
        <div className="relative h-64 mb-8 animate-float">
          <div className="absolute inset-0 bg-gradient-to-r from-girlfriend-pink/20 to-girlfriend-lavender/20 rounded-3xl blur-3xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/placeholder.svg"
              alt="Girlfriend Avatar"
              className="h-64 object-contain"
            />
          </div>
        </div>
        
        <div className="glass-card rounded-3xl p-6 mb-8 shadow-lg animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">
            ইংরেজি শেখার নতুন উপায়
          </h2>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-girlfriend-pink/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-girlfriend-pink" />
              </div>
              <div>
                <h3 className="font-medium">সহজ কথোপকথন</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  দৈনন্দিন পরিস্থিতিতে কিভাবে ইংরেজি ব্যবহার করবেন তা শিখুন
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-girlfriend-lavender/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Users className="w-4 h-4 text-girlfriend-lavender" />
              </div>
              <div>
                <h3 className="font-medium">বিভিন্ন সাথীর সাথে শিখুন</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  বিভিন্ন বিষয়ে বিশেষজ্ঞ সাথীরা আপনাকে আলাদা আলাদা পরিস্থিতি সম্পর্কে শিখাবে
                </p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-girlfriend-mint/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Award className="w-4 h-4 text-girlfriend-mint" />
              </div>
              <div>
                <h3 className="font-medium">গেমিফিকেশন</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  পয়েন্ট অর্জন করে নতুন সাথীদের আনলক করুন
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="glass-card rounded-3xl p-6 mb-8 shadow-lg animate-fade-in">
          <ExampleApiUsage />
        </div>
        
        <Button 
          onClick={() => navigate('/girlfriends')}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium animate-fade-in"
        >
          শুরু করুন
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Index;

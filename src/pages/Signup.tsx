import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';
import { authService, SignUpData } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const location = useLocation();
  const { fromGoogle, email: googleEmail, name: googleName } = location.state || {};
  
  const [name, setName] = useState(googleName || '');
  const [email, setEmail] = useState(googleEmail || '');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gender) {
      toast.error("ত্রুটি!", {
        description: "দয়া করে আপনার লিঙ্গ নির্বাচন করুন।",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const signupData: SignUpData = {
        email,
        password,
        name,
        phone,
        gender
      };
      
      await authService.signUp(signupData);
      
      // Show success message
      toast("সফল নিবন্ধন!", {
        description: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। দয়া করে ইমেইল ভেরিফাই করুন।",
      });
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      // Toast is shown in the authService
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      toast("গুগল প্রসেসিং...", {
        description: "আপনাকে গুগল লগইন পৃষ্ঠায় রিডাইরেক্ট করা হচ্ছে।",
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup?fromGoogle=true`
        }
      });
      
      if (error) {
        console.error('Google signup error details:', error);
        throw error;
      }
      
      // This is usually not reached as the browser redirects
      console.log('Google signup data:', data);
    } catch (error: any) {
      console.error('Google signup error:', error.message);
      toast.error("সাইন আপ ব্যর্থ!", {
        description: error.message || "গুগল দিয়ে সাইন আপ করতে সমস্যা হয়েছে। সুপাবেজ কনসোলে গুগল প্রোভাইডার সক্রিয় করা আছে কিনা চেক করুন।",
      });
    }
  };
  
  // Check for OAuth return with URL params
  useEffect(() => {
    const checkOAuthReturn = async () => {
      const query = new URLSearchParams(window.location.search);
      const fromGoogle = query.get('fromGoogle');
      
      if (fromGoogle === 'true') {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            setEmail(user.email || '');
            setName(user.user_metadata.full_name || '');
          }
        } catch (error) {
          console.error('OAuth return error:', error);
        }
      } 
    };
    
    checkOAuthReturn();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">ইংরেজি গার্লফ্রেন্ড</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {fromGoogle ? 'আপনার প্রোফাইল সম্পূর্ণ করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>
        
        <div className="glass-card rounded-3xl p-6 mb-6 shadow-lg">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">আপনার নাম</Label>
              <Input
                id="name"
                type="text"
                placeholder="আপনার পূর্ণ নাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল এড্রেস</Label>
              <Input
                id="email"
                type="email"
                placeholder="আপনার ইমেইল"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={fromGoogle}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নাম্বার</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="আপনার ফোন নাম্বার"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {!fromGoogle && (
              <div className="space-y-2">
                <Label htmlFor="password">পাসওয়ার্ড</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="একটি শক্তিশালী পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>আমি একজন</Label>
              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant={gender === 'male' ? 'default' : 'outline'}
                  className={`flex-1 h-12 ${gender === 'male' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => setGender('male')}
                >
                  ছেলে
                </Button>
                <Button
                  type="button"
                  variant={gender === 'female' ? 'default' : 'outline'}
                  className={`flex-1 h-12 ${gender === 'female' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
                  onClick={() => setGender('female')}
                >
                  মেয়ে
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'প্রক্রিয়াকরণ হচ্ছে...' : fromGoogle ? 'প্রোফাইল সম্পূর্ণ করুন' : 'সাইন আপ করুন'}
            </Button>
          </form>
          
          {!fromGoogle && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500">
                    অথবা
                  </span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-12 flex items-center justify-center gap-2"
                onClick={handleGoogleSignup}
              >
                <Globe className="h-5 w-5" />
                গুগল দিয়ে সাইন আপ করুন
              </Button>
            </>
          )}
        </div>
        
        {!fromGoogle && (
          <p className="text-center text-gray-600 dark:text-gray-400">
            ইতিমধ্যে একটি অ্যাকাউন্ট আছে? {' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              লগইন করুন
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;

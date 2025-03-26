import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login({ email, password });
      
      // Show success message
      toast("সফল লগইন!", {
        description: "আপনি সফলভাবে লগইন করেছেন।",
      });
      
      // Redirect to main page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      // Toast is shown in the authService
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast("গুগল প্রসেসিং...", {
        description: "আপনাকে গুগল লগইন পৃষ্ঠায় রিডাইরেক্ট করা হচ্ছে।",
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google login error details:', error);
        throw error;
      }
      
      // This usually doesn't get executed as the browser redirects
      console.log('Google auth data:', data);
    } catch (error: any) {
      console.error('Google login error:', error.message);
      toast.error("লগইন ব্যর্থ!", {
        description: error.message || "গুগল দিয়ে লগইন করতে সমস্যা হয়েছে। সুপাবেজ কনসোলে গুগল প্রোভাইডার সক্রিয় করা আছে কিনা চেক করুন।",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">ইংরেজি গার্লফ্রেন্ড</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            আপনার অ্যাকাউন্টে লগইন করুন
          </p>
        </div>
        
        <div className="glass-card rounded-3xl p-6 mb-6 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল এড্রেস</Label>
              <Input
                id="email"
                type="email"
                placeholder="আপনার ইমেইল"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </a>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={isLoading}
            >
              {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </Button>
          </form>
          
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
            onClick={handleGoogleLogin}
          >
            <Globe className="h-5 w-5" />
            গুগল দিয়ে লগইন করুন
          </Button>
        </div>
        
        <p className="text-center text-gray-600 dark:text-gray-400">
          অ্যাকাউন্ট নেই? {' '}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

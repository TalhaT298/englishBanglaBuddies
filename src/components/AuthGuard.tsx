
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        toast("লগইন সফল", {
          description: "আপনি সফলভাবে লগইন করেছেন।",
        });
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        toast("লগআউট সফল", {
          description: "আপনি সফলভাবে লগআউট করেছেন।",
        });
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && 
        location.pathname !== '/login' && 
        location.pathname !== '/signup') {
      navigate('/login');
    }
    
    if (!isLoading && isAuthenticated && 
        (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  // Public routes accessible without authentication
  if (!isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <>{children}</>;
  }
  
  // Protected routes require authentication
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;

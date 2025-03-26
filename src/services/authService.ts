
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  gender?: 'male' | 'female';
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  signUp: async (data: SignUpData) => {
    try {
      const { email, password, name, gender } = data;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            gender
          }
        }
      });

      if (error) throw error;
      
      return authData;
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      toast.error('Registration failed', {
        description: error.message
      });
      throw error;
    }
  },
  
  login: async (data: LoginData) => {
    try {
      const { email, password } = data;
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return authData;
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error('Login failed', {
        description: error.message
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast.error('Logout failed', {
        description: error.message
      });
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error: any) {
      console.error('Get current user error:', error.message);
      return null;
    }
  },
  
  getProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Get profile error:', error.message);
      return null;
    }
  },
  
  updateProfile: async (profileData: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      toast.error('Profile update failed', {
        description: error.message
      });
      throw error;
    }
  }
};

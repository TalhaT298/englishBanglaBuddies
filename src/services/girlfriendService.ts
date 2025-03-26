
import { supabase } from '@/integrations/supabase/client';
import { GirlfriendProfile } from '@/types/girlfriend';
import { toast } from 'sonner';

export const girlfriendService = {
  getAllGirlfriends: async (): Promise<GirlfriendProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('girlfriends')
        .select('*')
        .order('level', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to GirlfriendProfile interface
      return data.map(item => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        description: item.description,
        personality: item.personality,
        level: item.level,
        topic: item.topic,
        occupation: item.occupation,
        isUnlocked: item.is_unlocked,
        skillLevel: item.skill_level,
        customInstructions: item.custom_instructions,
        geminiPrompt: item.gemini_prompt,
        flirtingStyle: item.flirting_style,
        teachingStyle: item.teaching_style,
        languageLevel: item.language_level as 'beginner' | 'intermediate' | 'advanced' | undefined
      }));
    } catch (error: any) {
      console.error('Get girlfriends error:', error.message);
      toast.error('Failed to load girlfriends', {
        description: error.message
      });
      return [];
    }
  },
  
  getGirlfriendById: async (id: string): Promise<GirlfriendProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('girlfriends')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        avatar: data.avatar,
        description: data.description,
        personality: data.personality,
        level: data.level,
        topic: data.topic,
        occupation: data.occupation,
        isUnlocked: data.is_unlocked,
        skillLevel: data.skill_level,
        customInstructions: data.custom_instructions,
        geminiPrompt: data.gemini_prompt,
        flirtingStyle: data.flirting_style,
        teachingStyle: data.teaching_style,
        languageLevel: data.language_level as 'beginner' | 'intermediate' | 'advanced' | undefined
      };
    } catch (error: any) {
      console.error('Get girlfriend by id error:', error.message);
      return null;
    }
  },

  unlockGirlfriend: async (id: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // In a real app, you'd also check for payment status here
      
      const { error } = await supabase
        .from('girlfriends')
        .update({ is_unlocked: true })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Unlock girlfriend error:', error.message);
      toast.error('Failed to unlock girlfriend', {
        description: error.message
      });
      return false;
    }
  }
};

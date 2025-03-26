import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/components/ChatBubble";
import { toast } from "sonner";
import axios from "axios";

export interface ChatMessage {
  id?: string;
  user_id: string;
  girlfriend_id: string;
  content: string;
  sender: "user" | "girlfriend";
  is_audio?: boolean;
  audio_url?: string;
  created_at?: string;
}

export const chatService = {
  getMessages: async (girlfriendId: string): Promise<Message[]> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .eq("girlfriend_id", girlfriendId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Map database fields to Message interface
      return data.map((message) => ({
        id: message.id || "",
        text: message.content,
        sender: message.sender as "user" | "girlfriend",
        timestamp: new Date(message.created_at || ""),
        isVoice: message.is_audio,
        audioUrl: message.audio_url, // Using audioUrl to match Message interface
      }));
    } catch (error: any) {
      console.error("Get messages error:", error.message);
      return [];
    }
  },

  sendMessage: async (
    girlfriendId: string,
    content: string,
    isAudio: boolean = false,
    audioUrl?: string
  ): Promise<Message | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const newMessage: ChatMessage = {
        user_id: user.id,
        girlfriend_id: girlfriendId,
        content,
        sender: "user",
        is_audio: isAudio,
        audio_url: audioUrl,
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        text: data.content,
        sender: data.sender as "user" | "girlfriend",
        timestamp: new Date(data.created_at),
        isVoice: data.is_audio,
        audioUrl: data.audio_url,
      };
    } catch (error: any) {
      console.error("Send message error:", error.message);
      toast.error("Failed to send message", {
        description: error.message,
      });
      return null;
    }
  },

  simulateAIResponse: async (
    girlfriendId: string,
    userMessage: string
  ): Promise<Message | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");
      console.log(girlfriendId);

      const { data: girlfriendData, error: girlfriendError } = await supabase
        .from("girlfriends")
        .select("*")
        .eq("id", girlfriendId)
        .single();

      if (girlfriendError || !girlfriendData) {
        throw new Error("Girlfriend not found");
      }

      // **Get dynamic values from database**
      const {
        name,
        personality,
        topic,
        occupation,
        flirting_style,
        teaching_style,
        language_level,
        description,
      } = girlfriendData;

      // **Create dynamic prompt based on girlfriend data**
      const prompt = `
        You are ${name}, a ${personality} and her description is ${description} who works as a ${occupation}. 
        Your main topic of conversation is ${topic}. 
        You love to interact with users in a ${flirting_style} way while teaching them in a ${teaching_style} style.
        Assume the user has a ${language_level} level in English.
        Your main goal is to help them learn English phrases related to ${topic} in an engaging and fun way.
        Sometimes mix Bangla and English for better understanding.

        User message: ${userMessage}
      `;

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCKjLgSHWP6LcrOefKmsILCdcTWS9UkhWo",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      if (!response.data) {
        throw new Error("AI response not available");
      }

      const responseFromAi = response.data.candidates[0].content.parts[0].text;

      const aiMessage: ChatMessage = {
        user_id: user.id,
        girlfriend_id: girlfriendId,
        content: responseFromAi,
        sender: "girlfriend",
      };

      const { data, error } = await supabase
        .from("messages")
        .insert(aiMessage)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        text: data.content,
        sender: data.sender as "user" | "girlfriend",
        timestamp: new Date(data.created_at),
        isVoice: false,
        audioUrl: data.audio_url,
      };
    } catch (error: any) {
      console.error("AI response error:", error.message);
      return null;
    }
  },
};

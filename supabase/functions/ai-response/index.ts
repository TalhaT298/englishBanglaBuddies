import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { userMessage, girlfriendId, userId } = await req.json();

    if (!userMessage || !girlfriendId || !userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: userMessage, girlfriendId, and userId are required"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Fetch the girlfriend profile to personalize the response
    const { data: girlfriend, error: girlfriendError } = await supabase
      .from('girlfriends')
      .select('*')
      .eq('id', girlfriendId)
      .single();

    if (girlfriendError) {
      throw new Error(`Error fetching girlfriend: ${girlfriendError.message}`);
    }

    // In a real app, you would call an AI service here with the user message,
    // the girlfriend profile details, and the conversation history.
    // For this demo, we're using a simple response generation logic.

    const responseOptions = [
      "That's great! Let's practice. 'I would like to buy some clothes.' বলুন 'আমি কিছু কাপড় কিনতে চাই।'",
      "Good job! Now try saying 'Excuse me, where is the electronics section?' এটা বলুন, 'এক্সকিউজ মি, ইলেকট্রনিক্স সেকশন কোথায়?'",
      "Excellent! Let's try another one. 'How much does this cost?' বলুন, 'এটার দাম কত?'",
      "Perfect! You're doing great. Now try ordering food at the food court: 'I would like a burger and fries, please.'"
    ];

    const aiResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

    // Store the AI response in the database
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        user_id: userId,
        girlfriend_id: girlfriendId,
        content: aiResponse,
        sender: 'girlfriend'
      })
      .select()
      .single();

    if (messageError) {
      throw new Error(`Error saving AI response: ${messageError.message}`);
    }

    return new Response(
      JSON.stringify({
        id: messageData.id,
        text: messageData.content,
        sender: messageData.sender,
        timestamp: messageData.created_at,
        isVoice: false
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

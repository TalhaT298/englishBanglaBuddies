import ChatBubble, { Message } from "@/components/ChatBubble";
import EmptyChat from "@/components/EmptyChat";
import Navbar from "@/components/Navbar";
import QuickReplies from "@/components/QuickReplies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VoiceMessage from "@/components/VoiceMessage";
import { supabase } from "@/integrations/supabase/client";
import { chatService } from "@/services/chatService";
import { girlfriendService } from "@/services/girlfriendService";
import { GirlfriendProfile } from "@/types/girlfriend";
import { ArrowLeft, Gift, Image, Mic, Phone, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();
  const [showConversationList, setShowConversationList] = useState(true);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedGirlfriend, setSelectedGirlfriend] =
    useState<GirlfriendProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceMessage, setShowVoiceMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [hasGirlfriends, setHasGirlfriends] = useState(false);
  const [isAwaitingVoiceReply, setIsAwaitingVoiceReply] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [girlfriends, setGirlfriends] = useState<GirlfriendProfile[]>([]);

  useEffect(() => {
    const fetchGirlfriends = async () => {
      try {
        const data = await girlfriendService.getAllGirlfriends();
        setGirlfriends(data);
        setHasGirlfriends(data.some((g) => g.isUnlocked));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching girlfriends:", error);
        toast.error("Failed to load girlfriends");
        setIsLoading(false);
      }
    };

    fetchGirlfriends();
  }, []);

  useEffect(() => {
    const storedGirlfriend = localStorage.getItem("selectedGirlfriend");
    if (storedGirlfriend) {
      const girlfriend = JSON.parse(storedGirlfriend);
      setSelectedGirlfriend(girlfriend);
      setShowConversationList(false);

      fetchMessages(girlfriend.id);
    }
  }, []);

  const fetchMessages = async (girlfriendId: string) => {
    try {
      const chatMessages = await chatService.getMessages(girlfriendId);

      if (chatMessages.length > 0) {
        setMessages((prev) => ({
          ...prev,
          [girlfriendId]: chatMessages,
        }));
      } else {
        const welcomeMessage: Message = {
          id: "welcome",
          text: `হাই! আমি ${
            girlfriends.find((g) => g.id === girlfriendId)?.name || "আপনার সাথী"
          }, আমি আপনাকে ইংরেজিতে কথা বলতে সাহায্য করব। আপনি কি শুরু করতে চান?`,
          sender: "girlfriend",
          timestamp: new Date(),
        };

        setMessages((prev) => ({
          ...prev,
          [girlfriendId]: [welcomeMessage],
        }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedGirlfriend]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredGirlfriends = girlfriends.filter(
    (girl) =>
      girl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      girl.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (inputValue.trim() && selectedGirlfriend?.id) {
      const newUserMessage: Message = {
        id: String(Date.now()),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedGirlfriend.id!]: [
          ...(prev[selectedGirlfriend.id!] || []),
          newUserMessage,
        ],
      }));

      setInputValue("");

      try {
        await chatService.sendMessage(selectedGirlfriend.id, inputValue);

        const aiResponse = await chatService.simulateAIResponse(
          selectedGirlfriend.id,
          inputValue
        );

        if (aiResponse) {
          setMessages((prev) => ({
            ...prev,
            [selectedGirlfriend.id!]: [
              ...(prev[selectedGirlfriend.id!] || []),
              aiResponse,
            ],
          }));
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  const handleSelectChat = async (girlfriend: GirlfriendProfile) => {
    setSelectedGirlfriend(girlfriend);
    setShowConversationList(false);
    localStorage.setItem("selectedGirlfriend", JSON.stringify(girlfriend));

    if (!messages[girlfriend.id!]) {
      await fetchMessages(girlfriend.id!);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    localStorage.removeItem("selectedGirlfriend");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handlePlayVoice = (messageId: string) => {
    if (selectedGirlfriend) {
      setMessages((prev) => {
        const currentMessages = prev[selectedGirlfriend.id!] || [];
        return {
          ...prev,
          [selectedGirlfriend.id!]: currentMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, isPlaying: !msg.isPlaying }
              : msg.isPlaying
              ? { ...msg, isPlaying: false }
              : msg
          ),
        };
      });
    }
  };

  const handleQuickReply = async (reply: string) => {
    if (selectedGirlfriend?.id) {
      const newUserMessage: Message = {
        id: String(Date.now()),
        text: reply,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedGirlfriend.id!]: [
          ...(prev[selectedGirlfriend.id!] || []),
          newUserMessage,
        ],
      }));

      try {
        await chatService.sendMessage(selectedGirlfriend.id, reply);

        let buddyResponse: Message;

        if (reply.includes("পরে কথা")) {
          buddyResponse = {
            id: String(Date.now() + 1),
            text: "ঠিক আছে, পরে কথা হবে। বাই!",
            sender: "girlfriend",
            timestamp: new Date(),
          };

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("messages").insert({
              user_id: user.id,
              girlfriend_id: selectedGirlfriend.id,
              content: buddyResponse.text,
              sender: "girlfriend",
            });
          }
        } else {
          buddyResponse = {
            id: String(Date.now() + 1),
            text: "চলো আমরা দোকানে যাবার আগে কিছু ইংলিশ চর্চা করি!",
            sender: "girlfriend",
            timestamp: new Date(),
            isImage: true,
            imageSrc: "/placeholder.svg",
          };

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("messages").insert({
              user_id: user.id,
              girlfriend_id: selectedGirlfriend.id,
              content: buddyResponse.text,
              sender: "girlfriend",
            });
          }

          setMessages((prev) => ({
            ...prev,
            [selectedGirlfriend.id!]: [
              ...(prev[selectedGirlfriend.id!] || []),
              buddyResponse,
            ],
          }));

          setTimeout(async () => {
            const practiceMessage: Message = {
              id: String(Date.now() + 2),
              text: "আমি তোমাকে একটি করে বাক্য বলব। আমি প্রথমে বাংলা বলব, তারপর ইংলিশ বলব। তুমি ইংলিশ শুনে আমাকে ভয়েস মেসেজ দিবে।",
              sender: "girlfriend",
              timestamp: new Date(),
            };

            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("messages").insert({
                user_id: user.id,
                girlfriend_id: selectedGirlfriend.id,
                content: practiceMessage.text,
                sender: "girlfriend",
              });
            }

            setMessages((prev) => ({
              ...prev,
              [selectedGirlfriend.id!]: [
                ...(prev[selectedGirlfriend.id!] || []),
                practiceMessage,
              ],
            }));

            setIsAwaitingVoiceReply(true);
          }, 2000);

          return;
        }

        setMessages((prev) => ({
          ...prev,
          [selectedGirlfriend.id!]: [
            ...(prev[selectedGirlfriend.id!] || []),
            buddyResponse,
          ],
        }));
      } catch (error) {
        console.error("Error processing quick reply:", error);
        toast.error("Failed to process response");
      }
    }
  };

  const handleSendVoice = async () => {
    if (selectedGirlfriend?.id) {
      const newVoiceMessage: Message = {
        id: String(Date.now()),
        text: "",
        sender: "user",
        timestamp: new Date(),
        isVoice: true,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedGirlfriend.id!]: [
          ...(prev[selectedGirlfriend.id!] || []),
          newVoiceMessage,
        ],
      }));

      setShowVoiceMessage(false);

      try {
        await chatService.sendMessage(selectedGirlfriend.id, "", true);

        if (isAwaitingVoiceReply) {
          setIsAwaitingVoiceReply(false);

          setTimeout(async () => {
            const feedbackMessage: Message = {
              id: String(Date.now() + 1),
              text: "Great job! Your pronunciation is getting better. Let's try another one.",
              sender: "girlfriend",
              timestamp: new Date(),
            };

            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (user) {
              await supabase.from("messages").insert({
                user_id: user.id,
                girlfriend_id: selectedGirlfriend.id,
                content: feedbackMessage.text,
                sender: "girlfriend",
              });
            }

            setMessages((prev) => ({
              ...prev,
              [selectedGirlfriend.id!]: [
                ...(prev[selectedGirlfriend.id!] || []),
                feedbackMessage,
              ],
            }));
          }, 2000);
        } else {
          const unavailableMessage: Message = {
            id: String(Date.now() + 1),
            text: "আমি এখন একটু বাহিরে আছি। তুমি কি আমাকে লিখে বলবে?",
            sender: "girlfriend",
            timestamp: new Date(),
          };

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("messages").insert({
              user_id: user.id,
              girlfriend_id: selectedGirlfriend.id,
              content: unavailableMessage.text,
              sender: "girlfriend",
            });
          }

          setMessages((prev) => ({
            ...prev,
            [selectedGirlfriend.id!]: [
              ...(prev[selectedGirlfriend.id!] || []),
              unavailableMessage,
            ],
          }));
        }
      } catch (error) {
        console.error("Error sending voice message:", error);
        toast.error("Failed to send voice message");
      }
    }
  };

  const handleSendImage = async () => {
    if (selectedGirlfriend?.id) {
      const newImageMessage: Message = {
        id: String(Date.now()),
        text: "",
        sender: "user",
        timestamp: new Date(),
        isImage: true,
        imageSrc: "/placeholder.svg",
      };

      setMessages((prev) => ({
        ...prev,
        [selectedGirlfriend.id!]: [
          ...(prev[selectedGirlfriend.id!] || []),
          newImageMessage,
        ],
      }));

      try {
        await chatService.sendMessage(selectedGirlfriend.id, "Sent an image");

        setTimeout(async () => {
          const aiResponse: Message = {
            id: String(Date.now() + 1),
            text: "Nice picture! In English, we would describe this as 'a shopping mall with many people'. Try repeating that.",
            sender: "girlfriend",
            timestamp: new Date(),
          };

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("messages").insert({
              user_id: user.id,
              girlfriend_id: selectedGirlfriend.id,
              content: aiResponse.text,
              sender: "girlfriend",
            });
          }

          setMessages((prev) => ({
            ...prev,
            [selectedGirlfriend.id!]: [
              ...(prev[selectedGirlfriend.id!] || []),
              aiResponse,
            ],
          }));
        }, 1500);
      } catch (error) {
        console.error("Error sending image:", error);
        toast.error("Failed to send image");
      }
    }
  };

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

  if (!hasGirlfriends && showConversationList) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <EmptyChat />
        <Navbar />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleBackToList}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {selectedGirlfriend && (
          <div className="flex items-center flex-1">
            <div className="avatar-glow">
              <img
                src={selectedGirlfriend.avatar}
                alt={selectedGirlfriend.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
            </div>
            <div className="ml-3">
              <h2 className="font-medium">{selectedGirlfriend.name}</h2>
              <p className="text-xs text-gray-500">
                {selectedGirlfriend.occupation} • {selectedGirlfriend.topic}
              </p>
            </div>
          </div>
        )}

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Phone className="h-5 w-5" />
          </Button>
          <Gift className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
        <div className="flex flex-col">
          {selectedGirlfriend &&
            messages[selectedGirlfriend.id!]?.map((message) => (
              <React.Fragment key={message.id}>
                <ChatBubble message={message} onPlayVoice={handlePlayVoice} />
                {message.sender === "girlfriend" &&
                  message.text.includes("দোকানে যাবার আগে") && (
                    <div className="px-4 my-2">
                      <QuickReplies
                        options={[
                          { text: "হ্যাঁ, চলো", type: "starter" },
                          { text: "না, থাক", type: "killer" },
                        ]}
                        onSelect={handleQuickReply}
                      />
                    </div>
                  )}
              </React.Fragment>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sticky bottom-16 z-20">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => setShowVoiceMessage(true)}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={handleSendImage}
          >
            <Image className="h-5 w-5" />
          </Button>

          <Input
            placeholder="মেসেজ লিখুন..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <Button
            variant="ghost"
            size="icon"
            className={`${
              inputValue.trim() ? "text-primary" : "text-gray-400"
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showVoiceMessage && (
        <VoiceMessage
          onSendVoice={handleSendVoice}
          onCancel={() => setShowVoiceMessage(false)}
        />
      )}

      <Navbar />
    </div>
  );
};

export default Chat;

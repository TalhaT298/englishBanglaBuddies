import React from 'react';
import { CheckCheck, Image, Play, Pause } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'girlfriend';
  timestamp: Date;
  isVoice?: boolean;
  isImage?: boolean;
  imageSrc?: string;
  audioUrl?: string;
  isPlaying?: boolean;
}

interface ChatBubbleProps {
  message: Message;
  onPlayVoice: (messageId: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onPlayVoice }) => {
  const isGirlfriend = message.sender === 'girlfriend';
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`max-w-[80%] ${isGirlfriend ? 'self-start' : 'self-end'} mb-3 animate-scale-up`}>
      <div 
        className={`
          relative rounded-2xl p-3
          ${isGirlfriend 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
            : 'bg-primary text-white'}
        `}
      >
        {message.isImage && message.imageSrc && (
          <div className="mb-2">
            <img 
              src={message.imageSrc} 
              alt="Shared image" 
              className="rounded-lg w-full h-auto max-h-60 object-cover"
            />
          </div>
        )}
        
        {message.isVoice ? (
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onPlayVoice(message.id)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isGirlfriend ? 'bg-primary/10 text-primary' : 'bg-white/20 text-white'}`}>
              {message.isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex space-x-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full ${message.isPlaying ? 'animate-pulse-soft' : ''} ${isGirlfriend ? 'bg-primary' : 'bg-white'}`}
                    style={{ 
                      width: `${4 + Math.random() * 12}px`,
                      opacity: message.isPlaying ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs mt-1 opacity-70">0:12</span>
            </div>
          </div>
        ) : (
          <p className={`text-sm ${isGirlfriend ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
            {message.text}
          </p>
        )}
      </div>
      
      <div className={`flex items-center text-xs mt-1 text-gray-500 ${isGirlfriend ? 'justify-start' : 'justify-end'}`}>
        <span>{formatTime(message.timestamp)}</span>
        {!isGirlfriend && (
          <CheckCheck className="w-3 h-3 ml-1 text-primary" />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;

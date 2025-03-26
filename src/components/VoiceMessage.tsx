
import React, { useState } from 'react';
import { Mic, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceMessageProps {
  onSendVoice: () => void;
  onCancel: () => void;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ onSendVoice, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Clear interval after 60 seconds max
    setTimeout(() => {
      clearInterval(interval);
      if (isRecording) {
        setIsRecording(false);
        setIsProcessing(true);
        processRecording();
      }
    }, 60000);

    return () => clearInterval(interval);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    processRecording();
  };

  const processRecording = () => {
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onSendVoice();
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-800 animate-slide-up">
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <p className="text-sm font-medium">
            {isProcessing 
              ? 'প্রসেসিং...' 
              : isRecording 
                ? 'রেকর্ডিং চলছে...' 
                : 'রেকর্ডিং শুরু করুন'}
          </p>
          {(isRecording || isProcessing) && (
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(recordingTime)}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-gray-300"
            onClick={onCancel}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {isProcessing ? (
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : isRecording ? (
            <Button
              className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
              onClick={stopRecording}
            >
              <div className="w-4 h-4 rounded bg-white" />
            </Button>
          ) : (
            <Button
              className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 pulse-animation"
              onClick={startRecording}
            >
              <Mic className="h-8 w-8 text-white" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-gray-300"
            onClick={onSendVoice}
            disabled={!isRecording && !isProcessing}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceMessage;

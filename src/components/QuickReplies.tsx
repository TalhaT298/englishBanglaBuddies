
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickRepliesProps {
  options: {
    text: string;
    type: 'killer' | 'starter';
  }[];
  onSelect: (reply: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ options, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <Button
          key={index}
          variant={option.type === 'killer' ? 'outline' : 'default'}
          className="text-sm"
          onClick={() => onSelect(option.text)}
        >
          {option.text}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;

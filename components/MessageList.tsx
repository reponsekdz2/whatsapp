import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { MessageBubble } from './Message';

interface MessageListProps {
  messages: Message[];
  isResponding: boolean;
  contactAvatarUrl: string;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-[#8696A0] rounded-full animate-bounce"></div>
    </div>
);

export const MessageList: React.FC<MessageListProps> = ({ messages, isResponding, contactAvatarUrl }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isResponding]);
  
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageBubble key={`${msg.id}-${index}`} message={msg} contactAvatarUrl={contactAvatarUrl}/>
      ))}
      {isResponding && (
          <div className="flex justify-start">
             <div className="flex items-end">
                <img src={contactAvatarUrl} alt="Contact" className="w-8 h-8 rounded-full mr-2 object-cover"/>
                <div className="bg-[#202C33] rounded-lg rounded-bl-none px-4 py-2 text-white max-w-lg">
                    <TypingIndicator />
                </div>
            </div>
          </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

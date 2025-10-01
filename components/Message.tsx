import React from 'react';
import type { Message } from '../types';
import { MessageStatus } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { DoubleCheckIcon } from './icons/DoubleCheckIcon';
import { AudioPlayer } from './AudioPlayer';

interface MessageBubbleProps {
  message: Message;
  contactAvatarUrl: string;
}

const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const StatusIcon: React.FC<{ status: MessageStatus }> = ({ status }) => {
    switch (status) {
        case MessageStatus.SENDING:
            return <CheckIcon className="w-4 h-4 text-[#8696A0]" />;
        case MessageStatus.SENT:
            return <CheckIcon className="w-4 h-4 text-[#8696A0]" />;
        case MessageStatus.DELIVERED:
            return <DoubleCheckIcon className="w-4 h-4 text-[#8696A0]" />;
        case MessageStatus.READ:
            return <DoubleCheckIcon className="w-4 h-4 text-[#53bdeb]" />;
        default:
            return null;
    }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, contactAvatarUrl }) => {
  const isUser = message.sender === 'user';

  const bubbleClasses = isUser
    ? 'bg-[#005C4B] text-white rounded-br-none'
    : 'bg-[#202C33] text-white rounded-bl-none';

  const containerClasses = `flex items-end mb-2 ${isUser ? 'justify-end' : 'justify-start'}`;

  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const MessageContent = () => (
    <div className={`rounded-lg px-3 py-2 max-w-md lg:max-w-lg ${bubbleClasses}`}>
        {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded content" className="rounded-md mb-2 max-h-64"/>
        )}
        {message.audioUrl && <AudioPlayer audioUrl={message.audioUrl} />}
        {message.text && <p className="whitespace-pre-wrap">{renderText(message.text)}</p>}
      <div className="flex justify-end items-center mt-1">
        <span className="text-xs text-[#8696A0] mr-1">{formatTimestamp(message.timestamp)}</span>
        {isUser && <StatusIcon status={message.status} />}
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
        {!isUser && (
            <img src={contactAvatarUrl} alt="Contact" className="w-8 h-8 rounded-full mr-2 object-cover"/>
        )}
        <MessageContent />
    </div>
  );
};

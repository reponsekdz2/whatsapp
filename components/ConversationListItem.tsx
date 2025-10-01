import React from 'react';

interface ConversationListItemProps {
  contactName: string;
  contactAvatarUrl: string;
  lastMessage: string;
  lastMessageTimestamp?: string;
  isActive: boolean;
  onClick: () => void;
}

const formatTimestamp = (timestamp: string | undefined): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 3600 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
};

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  contactName,
  contactAvatarUrl,
  lastMessage,
  lastMessageTimestamp,
  isActive,
  onClick,
}) => {
  const itemClasses = `
    flex items-center p-3 cursor-pointer transition-colors duration-200 border-b border-[#222E35]
    ${isActive ? 'bg-[#2A3942]' : 'hover:bg-[#202C33]'}
  `;

  return (
    <div className={itemClasses} onClick={onClick}>
      <img
        src={contactAvatarUrl}
        alt={contactName}
        className="w-12 h-12 rounded-full mr-4 object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="text-md font-semibold text-[#E9EDEF] truncate">{contactName}</p>
          <p className="text-xs text-[#8696A0] flex-shrink-0">{formatTimestamp(lastMessageTimestamp)}</p>
        </div>
        <p className="text-sm text-[#8696A0] truncate">{lastMessage}</p>
      </div>
    </div>
  );
};

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  ERROR = 'error',
}

export interface Message {
  id:string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
  status: MessageStatus;
  imageUrl?: string;
  audioUrl?: string;
  transcript?: string;
}

export interface Conversation {
  id: string;
  contact: User;
  messages: Message[];
  systemInstruction: string;
}

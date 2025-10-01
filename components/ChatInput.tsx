import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { fileToBase64 } from '../services/geminiService';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface ChatInputProps {
  onSendMessage: (text: string, options?: { image?: { data: string; mimeType: string }, audio?: { url: string; } }) => void;
  isResponding: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isResponding }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<{ file: File; previewUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, liveTranscript, startRecording, stopRecording } = useVoiceInput();

  const handleSend = async () => {
    if ((!text.trim() && !image) || isResponding) return;

    if (image) {
      const base64Data = await fileToBase64(image.file);
      onSendMessage(text, { image: { data: base64Data, mimeType: image.file.type } });
    } else {
      onSendMessage(text);
    }
    setText('');
    setImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setImage({ file, previewUrl });
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      const { audioUrl, transcript } = await stopRecording();
      if (audioUrl && transcript) {
        onSendMessage(transcript, { audio: { url: audioUrl } });
      }
    } else {
      startRecording();
    }
  };

  const showMic = !text.trim() && !image;

  if (isRecording) {
    return (
        <div className="p-4 bg-[#202C33] border-t border-[#222E35] flex items-center">
            <div className="flex-1 text-center text-gray-300 italic px-4">
                <span className="text-red-500 animate-pulse mr-2">●</span>
                {liveTranscript || "Listening..."}
            </div>
            <button
                type="button"
                onClick={handleMicClick}
                className="bg-[#00A884] rounded-full p-3 text-white transition-colors"
                aria-label="Stop recording"
            >
                <SendIcon className="w-6 h-6" />
            </button>
        </div>
    );
  }

  return (
    <div className="p-2 bg-[#202C33] border-t border-[#222E35] flex-shrink-0">
      {image && (
        <div className="relative w-24 h-24 mb-2 p-2 bg-slate-800 rounded-md">
          <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover rounded" />
          <button
            onClick={() => setImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleAttachClick}
          className="p-2 text-[#8696A0] hover:text-white transition-colors"
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-[#2A3942] rounded-lg py-2 px-4 text-white placeholder-[#8696A0] focus:outline-none focus:ring-2 focus:ring-[#00A884] resize-none"
          rows={1}
          disabled={isResponding}
        />
        <button
          type="button"
          onClick={showMic ? handleMicClick : handleSend}
          disabled={isResponding && !showMic}
          className="bg-[#00A884] rounded-full p-3 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-[#008a6b] transition-colors"
          aria-label={showMic ? "Record voice message" : "Send message"}
        >
          {showMic ? <MicrophoneIcon className="w-6 h-6" /> : <SendIcon className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

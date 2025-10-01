import React from 'react';

export const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-center bg-[#202C33] p-4">
        <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Gemini Chat</h2>
            <p className="text-[#8696A0]">
                Select a conversation from the sidebar to start chatting with an AI personality.
            </p>
            <div className="mt-8 p-6 bg-[#111B21] rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Powered by Google Gemini</h3>
                <p className="text-sm text-[#E9EDEF]">
                    This application demonstrates real-time, context-aware conversations using the Gemini API. Each contact is an AI with a unique personality.
                </p>
            </div>
        </div>
    </div>
  );
};

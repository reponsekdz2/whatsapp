import React from 'react';

interface AudioPlayerProps {
    audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
    return (
        <div className="my-2">
            <audio controls src={audioUrl} className="w-full h-10">
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode } from '../utils/audioUtils';

// A single AI instance for the entire app
// FIX: Per guidelines, API key must come from environment variables. Added non-null assertion to satisfy TypeScript.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const useVoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    try {
      setLiveTranscript('');
      audioChunksRef.current = [];
      
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      // FIX: Cast to 'any' to handle vendor-prefixed 'webkitAudioContext' for cross-browser compatibility without a TypeScript error.
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        audioChunksRef.current.push(new Float32Array(inputData));

        if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          });
        }
      };

      source.connect(scriptProcessorRef.current);
      scriptProcessorRef.current.connect(audioContextRef.current.destination);

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => console.log('Live session opened'),
          onmessage: (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setLiveTranscript(prev => prev + text);
            }
          },
          onerror: (e: ErrorEvent) => console.error('Live session error:', e),
          onclose: (e: CloseEvent) => console.log('Live session closed'),
        },
        config: {
          // FIX: The Live API requires responseModalities to be set, even for transcription-only use cases.
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
        },
      });
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      // Handle permissions error
    }
  }, [isRecording]);

  const stopRecording = useCallback(async (): Promise<{ audioUrl: string | null; transcript: string | null }> => {
    if (!isRecording) return { audioUrl: null, transcript: null };

    if (sessionPromiseRef.current) {
      const session = await sessionPromiseRef.current;
      session.close();
      sessionPromiseRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      await audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsRecording(false);

    const completeTranscript = liveTranscript;
    setLiveTranscript('');

    const audioBlob = createWavBlob(audioChunksRef.current, 16000);
    const audioUrl = URL.createObjectURL(audioBlob);

    return { audioUrl, transcript: completeTranscript };
  }, [isRecording, liveTranscript]);

  return { isRecording, liveTranscript, startRecording, stopRecording };
};

function createPcmBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function createWavBlob(audioData: Float32Array[], sampleRate: number): globalThis.Blob {
    let buffer = new Float32Array(0);
    audioData.forEach(d => {
        const newBuffer = new Float32Array(buffer.length + d.length);
        newBuffer.set(buffer, 0);
        newBuffer.set(d, buffer.length);
        buffer = newBuffer;
    });

    const wavBuffer = new ArrayBuffer(44 + buffer.length * 2);
    const view = new DataView(wavBuffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + buffer.length * 2, true);
    writeString(view, 8, 'WAVE');
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); // num channels
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * 2, true);

    // PCM data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, buffer[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    
    return new window.Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

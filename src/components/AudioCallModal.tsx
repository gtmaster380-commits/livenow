import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Video,
  MessageCircle
} from 'lucide-react';
import { CreatorProfile } from '../data/creators';
import { playRingtone } from '../utils/soundEffects';

interface AudioCallModalProps {
  creator: CreatorProfile;
  onClose: () => void;
  onOpenVideoCall: () => void;
  onOpenChat: () => void;
}

export const AudioCallModal: React.FC<AudioCallModalProps> = ({
  creator,
  onClose,
  onOpenVideoCall,
  onOpenChat
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [sofiaSpeech, setSofiaSpeech] = useState<string>('');

  // Ringtone and auto-connect
  useEffect(() => {
    const stopRingtone = playRingtone();

    const connectTimeout = setTimeout(() => {
      stopRingtone();
      setCallState('connected');
      setSofiaSpeech(`Hello! Hey there, I can hear you loud and clear 💕 How is your day going?`);
    }, 2800);

    return () => {
      stopRingtone();
      clearTimeout(connectTimeout);
    };
  }, []);

  // Call timer
  useEffect(() => {
    if (callState !== 'connected') return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Dynamic dialogue after 8 seconds
    const talkTimeout = setTimeout(() => {
      setSofiaSpeech(`I love your voice! Whenever you want, we can flip the cam on and see each other too! 📹`);
    }, 9000);

    return () => {
      clearInterval(timer);
      clearTimeout(talkTimeout);
    };
  }, [callState]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4">
      <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-gradient-to-b from-[#120d24] via-[#090714] to-[#04030a] md:rounded-3xl overflow-hidden flex flex-col justify-between p-6 shadow-2xl border border-emerald-500/30">
        
        {/* Top Status */}
        <div className="text-center pt-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {callState === 'ringing' ? 'Connecting...' : 'Call Connected'}
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{creator.name}</h2>
          <p className="text-sm font-mono text-emerald-300">
            {callState === 'ringing' ? `Calling ${creator.name}...` : formatDuration(seconds)}
          </p>
        </div>

        {/* Center Avatar with Pulsating Waves */}
        <div className="relative flex flex-col items-center justify-center my-auto py-6">
          {/* Animated Glow Rings */}
          <div className="absolute w-64 h-64 rounded-full bg-emerald-500/10 animate-ping [animation-duration:3s]" />
          <div className="absolute w-52 h-52 rounded-full bg-emerald-500/20 animate-pulse" />

          <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-600 shadow-2xl shadow-emerald-500/30 z-10">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          {/* Sound Waveform Visualizer */}
          {callState === 'connected' && (
            <div className="flex items-center gap-1.5 mt-8 h-8 z-10">
              {[14, 28, 20, 36, 18, 32, 26, 16, 30, 22, 34, 18, 12].map((height, i) => (
                <span
                  key={i}
                  style={{
                    height: `${height}px`,
                    animation: `pulse 1.2s infinite ease-in-out ${i * 0.1}s`
                  }}
                  className="w-1.5 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Live Voice Caption Bubble */}
          {callState === 'connected' && sofiaSpeech && (
            <div className="mt-6 max-w-xs mx-auto bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3 shadow-xl backdrop-blur-md text-center z-10 animate-in fade-in">
              <p className="text-xs text-slate-100 italic leading-relaxed">
                "{sofiaSpeech}"
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                — {creator.name} (Live Voice)
              </span>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-6 pb-6 z-10">
          {/* Secondary Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                isMuted
                  ? 'bg-red-950/80 border-red-500/50 text-red-300'
                  : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
              }`}
              title="Mute"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all ${
                isSpeakerOn
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900/80 border-slate-700 text-slate-400'
              }`}
              title="Speaker"
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenVideoCall();
              }}
              className="w-13 h-13 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 hover:bg-pink-900 flex items-center justify-center transition-all"
              title="Switch to Video Call"
            >
              <Video className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenChat();
              }}
              className="w-13 h-13 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 hover:bg-purple-900 flex items-center justify-center transition-all"
              title="Open Chat"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Main Hang Up Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl shadow-red-600/40 active:scale-95 transition-all"
              title="End Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

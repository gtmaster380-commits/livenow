import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Heart,
  MessageCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sparkles,
  Send,
  Eye,
  Gift,
  Volume2,
  VolumeX,
  PhoneOff
} from 'lucide-react';
import { CreatorProfile } from '../data/creators';
import { playGiftSound, playMessagePop } from '../utils/soundEffects';

interface LiveVideoModalProps {
  creator: CreatorProfile;
  onClose: () => void;
  onOpenChat: () => void;
  onOpenAudioCall: () => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isCreator?: boolean;
  isUser?: boolean;
}

export const LiveVideoModal: React.FC<LiveVideoModalProps> = ({
  creator,
  onClose,
  onOpenChat,
  onOpenAudioCall
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(245);
  const [viewersCount, setViewersCount] = useState(2418);
  const [isMuted, setIsMuted] = useState(false);
  const [userMicMuted, setUserMicMuted] = useState(false);
  const [userCamEnabled, setUserCamEnabled] = useState(false);
  const [inputText, setInputText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [giftNotification, setGiftNotification] = useState<string | null>(null);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Lucas_99', text: `Hey ${creator.name}! Wow you look incredible tonight 🔥` },
    { id: '2', sender: 'AlexM', text: 'Where are you streaming from right now?' },
    { id: '3', sender: creator.name, text: `Hey everyone! Streaming from ${creator.location}, so excited to see you here 💕`, isCreator: true },
    { id: '4', sender: 'MarcoV', text: 'Sent you 100 stars! ⭐' },
  ]);

  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Viewer count gentle random fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount((prev) => prev + Math.floor(Math.random() * 7) - 3);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle User Cam
  useEffect(() => {
    if (userCamEnabled) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: !userMicMuted })
        .then((stream) => {
          userStreamRef.current = stream;
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera access unavailable or denied, keep simulated state
        });
    } else {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
        userStreamRef.current = null;
      }
    }
    return () => {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [userCamEnabled, userMicMuted]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerHeartReaction = () => {
    const id = Date.now();
    const left = Math.floor(Math.random() * 70) + 15;
    setFloatingHearts((prev) => [...prev, { id, left }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: inputText.trim(),
      isUser: true
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    playMessagePop();

    // Sofia replies after 2 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Aww thank you! That made my day 🥰",
        "I see your message! So happy you stopped by to say hi 💕",
        "Let's do a private room chat if you want to talk 1-on-1! 🔥",
        "You're so sweet! Drop me a private message anytime ✨",
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: creator.name,
          text: randomReply,
          isCreator: true
        }
      ]);
      playMessagePop();
    }, 2200);
  };

  const handleSendGift = (giftName: string, icon: string) => {
    setShowGiftDrawer(false);
    playGiftSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setGiftNotification(`You sent a ${giftName} ${icon} to ${creator.name}!`);
    setTimeout(() => setGiftNotification(null), 4000);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'System',
        text: `🎁 You tipped ${creator.name} with a ${giftName} ${icon}!`
      }
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: creator.name,
          text: `OMG thank you for the ${giftName}! You are incredible! 💖✨`,
          isCreator: true
        }
      ]);
      playMessagePop();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4">
      {/* Container */}
      <div className="relative w-full h-full md:max-w-md md:h-[92vh] bg-slate-950 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-purple-500/30">
        
        {/* Live Stream Main Video / Photo Background */}
        <div className="relative flex-1 bg-black overflow-hidden select-none">
          <img
            src={creator.streamPreviewUrl}
            alt={creator.name}
            className="w-full h-full object-cover object-center"
          />

          {/* Vignette Overlay & ambient glows */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 pointer-events-none" />

          {/* Floating Hearts Container */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {floatingHearts.map((heart) => (
              <div
                key={heart.id}
                style={{ left: `${heart.left}%`, bottom: '90px' }}
                className="absolute text-3xl animate-float-heart"
              >
                ❤️
              </div>
            ))}
          </div>

          {/* Top Live Bar */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-600/90 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
              <div className="bg-black/60 backdrop-blur-md text-white font-mono text-xs px-2.5 py-1 rounded-full border border-white/10">
                {formatTime(secondsElapsed)}
              </div>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-pink-300 text-xs px-2.5 py-1 rounded-full border border-pink-500/20">
                <Eye className="w-3.5 h-3.5 text-pink-400" />
                <span className="font-semibold tabular-nums">{viewersCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md border border-white/10 transition-colors"
                title={isMuted ? 'Unmute Stream' : 'Mute Stream'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-black/60 hover:bg-red-600/80 rounded-full text-white backdrop-blur-md border border-white/10 transition-colors"
                title="Close Stream"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Creator Profile Chip in Stream */}
          <div className="absolute top-16 left-4 z-20 flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-pink-500"
            />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white">{creator.name}</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 font-semibold px-1 rounded">22</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium">● 1-on-1 Cam Active</p>
            </div>
          </div>

          {/* User Self Video Picture-in-Picture */}
          {userCamEnabled && (
            <div className="absolute top-16 right-4 z-20 w-24 h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-pink-500 bg-slate-900">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <div className="absolute bottom-1 right-1 text-[9px] bg-black/70 px-1 py-0.5 rounded text-white font-medium">
                You
              </div>
            </div>
          )}

          {/* Gift Notification Banner */}
          {giftNotification && (
            <div className="absolute top-32 inset-x-4 z-30 flex items-center justify-center">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-2xl animate-bounce flex items-center gap-2 border border-white/30">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>{giftNotification}</span>
              </div>
            </div>
          )}

          {/* Floating Heart Quick Reaction Button */}
          <button
            onClick={triggerHeartReaction}
            className="absolute right-4 bottom-48 z-20 w-12 h-12 rounded-full bg-pink-600/90 hover:bg-pink-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-pink-600/50 backdrop-blur-md transition-all border border-pink-300/40"
            title="Send Heart"
          >
            <Heart className="w-6 h-6 fill-white" />
          </button>

          {/* Live Chat Stream Overlay */}
          <div
            ref={chatScrollRef}
            className="absolute bottom-16 inset-x-0 h-44 overflow-y-auto px-4 space-y-1.5 flex flex-col justify-end z-20 pointer-events-auto"
            style={{ maskImage: 'linear-gradient(to top, black 70%, transparent 100%)' }}
          >
            {messages.slice(-5).map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-1.5 text-xs max-w-[90%] ${
                  msg.isCreator
                    ? 'bg-pink-950/80 border border-pink-500/40 text-pink-200'
                    : msg.isUser
                    ? 'bg-purple-900/80 border border-purple-400/40 text-purple-100'
                    : 'bg-black/50 text-slate-200'
                } backdrop-blur-sm px-2.5 py-1.5 rounded-xl`}
              >
                <span
                  className={`font-bold shrink-0 ${
                    msg.isCreator ? 'text-pink-400' : msg.isUser ? 'text-purple-300' : 'text-slate-400'
                  }`}
                >
                  {msg.sender}:
                </span>
                <span className="break-words">{msg.text}</span>
              </div>
            ))}
            {isTyping && (
              <div className="text-[11px] text-pink-300 font-medium italic animate-pulse flex items-center gap-1">
                <span>{creator.name} is typing response...</span>
              </div>
            )}
          </div>
        </div>

        {/* Gift Selection Drawer */}
        {showGiftDrawer && (
          <div className="bg-slate-900/95 border-t border-purple-500/30 p-3 z-30 flex items-center justify-around gap-2 animate-in slide-in-from-bottom">
            {[
              { name: 'Rose', icon: '🌹', cost: 'Free' },
              { name: 'Diamond Ring', icon: '💎', cost: 'VIP' },
              { name: 'Champagne', icon: '🍾', cost: 'Special' },
              { name: 'Teddy Bear', icon: '🧸', cost: 'Cute' },
            ].map((g) => (
              <button
                key={g.name}
                onClick={() => handleSendGift(g.name, g.icon)}
                className="flex flex-col items-center p-2 rounded-xl bg-purple-950/50 hover:bg-pink-600/30 border border-purple-500/20 active:scale-95 transition-all text-center flex-1"
              >
                <span className="text-2xl mb-1">{g.icon}</span>
                <span className="text-[11px] font-semibold text-white">{g.name}</span>
                <span className="text-[9px] text-pink-300 font-bold">{g.cost}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="bg-slate-950/95 border-t border-slate-800/80 p-3 z-30">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 mb-2.5">
            <button
              type="button"
              onClick={() => setShowGiftDrawer(!showGiftDrawer)}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95 transition-colors"
              title="Send Gift"
            >
              <Gift className="w-5 h-5 text-yellow-300" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type a message to ${creator.name}...`}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white shadow-md active:scale-95 transition-colors"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Call Mode Switching & Devices Action Strip */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/50">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setUserMicMuted(!userMicMuted)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                  userMicMuted
                    ? 'bg-red-950/60 border-red-500/40 text-red-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Toggle Mic"
              >
                {userMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{userMicMuted ? 'Muted' : 'Mic On'}</span>
              </button>

              <button
                onClick={() => setUserCamEnabled(!userCamEnabled)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                  userCamEnabled
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Toggle User Camera"
              >
                {userCamEnabled ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{userCamEnabled ? 'My Cam On' : 'My Cam'}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat();
                }}
                className="p-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Switch to Room Chat"
              >
                <MessageCircle className="w-3.5 h-3.5 text-purple-300" />
                <span className="hidden sm:inline">Room Chat</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenAudioCall();
                }}
                className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-1 transition-colors"
                title="Switch to Audio Call"
              >
                <PhoneOff className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Voice Call</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

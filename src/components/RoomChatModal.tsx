import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Video,
  Phone,
  CheckCheck,
  Sparkles,
  Camera,
  Play,
  Pause
} from 'lucide-react';
import { CreatorProfile } from '../data/creators';
import { playMessagePop } from '../utils/soundEffects';

interface RoomChatModalProps {
  creator: CreatorProfile;
  onClose: () => void;
  onOpenVideoCall: () => void;
  onOpenAudioCall: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'creator';
  text: string;
  timestamp: string;
  isVoiceMemo?: boolean;
  voiceDuration?: string;
  photoUrl?: string;
}

export const RoomChatModal: React.FC<RoomChatModalProps> = ({
  creator,
  onClose,
  onOpenVideoCall,
  onOpenAudioCall
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'creator',
      text: `Hey! 💕 Welcome to my private room. How has your day been so far?`,
      timestamp: 'Just now'
    },
    {
      id: '2',
      sender: 'creator',
      text: `I'm completely free right now. We can text here or jump on a private cam call whenever you're ready! 🔥`,
      timestamp: 'Just now'
    }
  ]);

  const quickReplies = [
    'You look stunning tonight! ✨',
    'Can we start a private cam call? 📹',
    'Where are you from originally?',
    'Send me a quick photo 📸'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    playMessagePop();

    // Trigger realistic Sofia reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      const lower = text.toLowerCase();

      if (lower.includes('call') || lower.includes('cam') || lower.includes('video')) {
        replyText = "Yes! Tap the camera button right at the top, I'm already on cam waiting for you! 💖";
      } else if (lower.includes('photo') || lower.includes('picture') || lower.includes('snap')) {
        replyText = "Just snapped this for you in my room, what do you think? 🥰";
      } else if (lower.includes('where') || lower.includes('live')) {
        replyText = `I live in ${creator.location}! Where are you texting from?`;
      } else if (lower.includes('beautiful') || lower.includes('stunning') || lower.includes('cute')) {
        replyText = "Aww thank you so much! You're making me blush 🥰 Tell me more about you!";
      } else {
        const fallbacks = [
          "Haha totally! I'm really enjoying chatting with you 💕",
          "You have such good vibes! Want to hear my voice on a free call? 📞",
          "I was hoping someone nice like you would come by tonight ✨",
          "Tell me what you're up to tonight! I love late night chats 🔥"
        ];
        replyText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'creator',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          photoUrl: (lower.includes('photo') || lower.includes('picture') || lower.includes('snap'))
            ? creator.streamPreviewUrl
            : undefined
        }
      ]);
      playMessagePop();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4">
      <div className="relative w-full h-full md:max-w-md md:h-[90vh] bg-slate-950 md:rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-purple-500/30">
        
        {/* Header Bar */}
        <div className="p-3.5 bg-slate-900/90 border-b border-purple-500/20 flex items-center justify-between backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-sm">{creator.name}</h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-1.5 py-0.2 rounded">
                  {creator.age}
                </span>
                <span className="text-xs text-pink-400">✓</span>
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenVideoCall();
              }}
              className="p-2 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white transition-colors shadow-md"
              title="Start Live Cam"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAudioCall();
              }}
              className="p-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors shadow-md"
              title="Start Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950 via-[#100d20] to-slate-950">
          
          {/* Privacy Banner */}
          <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-2.5 text-center text-xs text-purple-300/80 flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>End-to-end private room encryption active</span>
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-purple-500/20 text-slate-100 rounded-bl-none'
                }`}
              >
                {msg.photoUrl && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-white/20">
                    <img
                      src={msg.photoUrl}
                      alt="Photo shared by Sofia"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
                
                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            </div>
          ))}

          {/* Sofia Voice Memo Demo */}
          <div className="flex flex-col items-start">
            <div className="max-w-[82%] bg-slate-900 border border-purple-500/20 rounded-2xl rounded-bl-none p-3 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white shrink-0 hover:bg-pink-500 transition-colors"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-1 h-5">
                    {[12, 24, 18, 30, 20, 28, 14, 22, 10, 16, 26, 18, 12, 8].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${isPlayingAudio ? Math.max(6, (h + Math.random() * 10)) : h}px` }}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingAudio ? 'bg-pink-500' : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Voice message from {creator.name}</span>
                    <span>0:14</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <div className="flex gap-1 items-center bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-[11px] text-pink-300 font-medium">
                {creator.name} is typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-purple-950/70 hover:bg-purple-800 text-purple-200 border border-purple-500/30 whitespace-nowrap active:scale-95 transition-all"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-purple-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => handleSend('Send me a picture 📸')}
              className="p-2 text-slate-400 hover:text-pink-400 transition-colors"
              title="Request photo"
            >
              <Camera className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Type a message to ${creator.name}...`}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

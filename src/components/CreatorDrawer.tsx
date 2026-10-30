import React from 'react';
import {
  X,
  Star,
  MapPin,
  Globe,
  Heart,
  Video,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { CreatorProfile } from '../data/creators';

interface CreatorDrawerProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenVideoCall: () => void;
  onOpenChat: () => void;
  onOpenAudioCall: () => void;
}

export const CreatorDrawer: React.FC<CreatorDrawerProps> = ({
  creator,
  isOpen,
  onClose,
  onOpenVideoCall,
  onOpenChat,
  onOpenAudioCall
}) => {
  if (!isOpen) return null;

  const reviews = [
    { name: 'Lucas D.', rating: 5, date: 'Yesterday', text: 'Sofia is so warm and engaging! The private video call felt like talking to a real close friend.' },
    { name: 'Marco V.', rating: 5, date: '2 days ago', text: 'Loved the room chat! Instant replies and great conversation. Highly recommended!' },
    { name: 'David K.', rating: 4.9, date: '3 days ago', text: 'High quality cam stream and great audio connection.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-0 md:p-4">
      <div className="relative w-full max-h-[85vh] md:max-w-md bg-slate-950 rounded-t-3xl md:rounded-3xl border-t md:border border-purple-500/30 overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        
        {/* Grab Handle */}
        <div className="pt-3 pb-2 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700 cursor-pointer" onClick={onClose} />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>{creator.name}</span>
              <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-md">
                {creator.age}
              </span>
              <ShieldCheck className="w-4 h-4 text-pink-500" />
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Rating</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-white tabular-nums">{creator.rating}</span>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Followers</span>
              <span className="text-sm font-bold text-pink-400 block mt-0.5 tabular-nums">{creator.followers}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Call Mins</span>
              <span className="text-sm font-bold text-emerald-400 block mt-0.5 tabular-nums">{creator.callMinutes}</span>
            </div>
          </div>

          {/* About Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">About Me</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80">
              {creator.bio}
            </p>
          </div>

          {/* Details / Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Location: <strong>{creator.location}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Globe className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Languages: {creator.languages.join(', ')}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Passions: {creator.hobbies.join(' · ')}</span>
            </div>
          </div>

          {/* Photo Gallery Previews */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Live Snapshots & Gallery
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-purple-500/30 group">
                <img
                  src={creator.avatarUrl}
                  alt="Gallery 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                  Verified Cam
                </span>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-purple-500/30 group">
                <img
                  src={creator.streamPreviewUrl}
                  alt="Gallery 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-pink-600/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium">
                  Live Stream
                </span>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Member Reviews ({creator.reviewsCount})
              </h4>
              <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400" /> {creator.rating}
              </span>
            </div>

            <div className="space-y-2.5">
              {reviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{rev.name}</span>
                    <span className="text-[10px] text-slate-500">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Quick Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenVideoCall();
            }}
            className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Cam</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenChat();
            }}
            className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Room Chat</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAudioCall();
            }}
            className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Free Call</span>
          </button>
        </div>

      </div>
    </div>
  );
};

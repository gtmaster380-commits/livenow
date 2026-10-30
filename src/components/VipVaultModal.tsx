import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Sparkles,
  Eye,
  Heart,
  Download,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CreatorProfile } from '../data/creators';
import { playGiftSound } from '../utils/soundEffects';

interface VipVaultModalProps {
  creator: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const VipVaultModal: React.FC<VipVaultModalProps> = ({
  creator,
  isOpen,
  onClose
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = () => {
    setIsUnlocked(true);
    playGiftSound();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#19112e] via-[#0d091d] to-[#080514] rounded-3xl border border-pink-500/40 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900/80 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
              {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {creator.name}'s VIP Photo Vault
              </h3>
              <p className="text-[10px] text-pink-300 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{creator.viewsCount} views · Exclusive Content</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Unlock Banner */}
          {!isUnlocked ? (
            <div className="bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/30 rounded-2xl p-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center mx-auto text-pink-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Exclusive Gallery Locked</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Gain instant access to {creator.name}'s private camera snaps, behind-the-scenes shoots, and candid lifestyle pictures.
                </p>
              </div>

              <button
                onClick={handleUnlock}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs tracking-wide shadow-lg shadow-pink-600/40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Unlock VIP Vault Now (Free Access)</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>VIP Access Unlocked! Enjoy exclusive high-res photos.</span>
            </div>
          )}

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3">
            {creator.vaultPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() => isUnlocked && setSelectedPhoto(photo)}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden border border-purple-500/30 cursor-pointer group ${
                  !isUnlocked ? 'filter blur-[4px]' : ''
                }`}
              >
                <img
                  src={photo}
                  alt={`Vault photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                    <Lock className="w-6 h-6 text-pink-400 mb-1" />
                    <span className="text-[10px] font-bold">Locked</span>
                  </div>
                )}

                {isUnlocked && (
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Selected Photo Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="relative max-w-sm max-h-[85vh] rounded-2xl overflow-hidden border border-white/20">
              <img
                src={selectedPhoto}
                alt="Enlarged Vault Photo"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

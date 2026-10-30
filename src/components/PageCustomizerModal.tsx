import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Sliders,
  Link,
  Sparkles,
  User,
  MessageSquare
} from 'lucide-react';
import { CreatorProfile } from '../data/creators';

interface PageCustomizerModalProps {
  currentProfile: CreatorProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CreatorProfile) => void;
  onReset: () => void;
}

export const PageCustomizerModal: React.FC<PageCustomizerModalProps> = ({
  currentProfile,
  isOpen,
  onClose,
  onSave,
  onReset
}) => {
  const [formData, setFormData] = useState<CreatorProfile>({ ...currentProfile });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-slate-950 rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-white text-base">Customize Page & Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="bg-purple-950/30 p-3 rounded-2xl border border-purple-500/20 text-xs text-purple-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <span>Customize any field below to tailor this landing page to your exact creator or branding!</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Creator Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Reviews Count
              </label>
              <input
                type="text"
                value={formData.reviewsCount}
                onChange={(e) => setFormData({ ...formData, reviewsCount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Live Views Count
              </label>
              <input
                type="text"
                value={formData.viewsCount}
                onChange={(e) => setFormData({ ...formData, viewsCount: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Status Quote / Bio Banner
            </label>
            <textarea
              rows={2}
              value={formData.statusMessage}
              onChange={(e) => setFormData({ ...formData, statusMessage: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">LIVE NOW Badge</span>
              <span className="text-[11px] text-slate-400">Display neon green live indicator</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isLive}
              onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
              className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 accent-pink-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block">
              Smart Links (CPA / Affiliate)
            </span>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Link 1: JOIN FREE CALL
              </label>
              <input
                type="url"
                value={formData.smartLink1 || ''}
                onChange={(e) => setFormData({ ...formData, smartLink1: e.target.value })}
                placeholder="https://auctionr.org/4/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Link 2: ROOM CHAT
              </label>
              <input
                type="url"
                value={formData.smartLink2 || ''}
                onChange={(e) => setFormData({ ...formData, smartLink2: e.target.value })}
                placeholder="https://auctionr.org/4/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Link 3: FREE CALL & VIP VAULT
              </label>
              <input
                type="url"
                value={formData.smartLink3 || ''}
                onChange={(e) => setFormData({ ...formData, smartLink3: e.target.value })}
                placeholder="https://auctionr.org/4/..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/30 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

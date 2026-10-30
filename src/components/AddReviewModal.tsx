import React, { useState } from 'react';
import { X, Star, Sparkles, Send } from 'lucide-react';
import { ReviewItem } from '../data/creators';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: ReviewItem) => void;
  creatorName: string;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  creatorName
}) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [verifiedType, setVerifiedType] = useState<'Verified Call' | 'Verified Room Chat'>('Verified Call');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    const bgColors = ['bg-[#f43f5e]', 'bg-[#8b5cf6]', 'bg-[#06b6d4]', 'bg-[#10b981]', 'bg-[#f59e0b]'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newReview: ReviewItem = {
      id: Date.now().toString(),
      author: author.trim(),
      initial: author.trim().charAt(0).toUpperCase() || 'U',
      avatarBg: randomBg,
      verifiedType,
      rating,
      timeAgo: 'Just now',
      likes: 1,
      content: content.trim()
    };

    onSubmitReview(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-slate-950 rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Add Feedback for {creatorName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Your Name or Nickname
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Brandon K."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
              Star Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-yellow-400 ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Experience Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerifiedType('Verified Call')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  verifiedType === 'Verified Call'
                    ? 'bg-pink-600 text-white border-pink-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                📹 Verified Call
              </button>
              <button
                type="button"
                onClick={() => setVerifiedType('Verified Room Chat')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  verifiedType === 'Verified Room Chat'
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                💬 Verified Room Chat
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Your Review
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Tell others about your experience with ${creatorName}...`}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500 leading-relaxed"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Review</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

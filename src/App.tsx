/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Video,
  MessageSquare,
  Phone,
  ArrowRight,
  Star,
  Eye,
  CheckCircle2,
  Lock,
  MapPin,
  Sparkles,
  Plus,
  ThumbsUp,
  Share2,
  Sliders,
  ChevronDown,
  Globe
} from 'lucide-react';
import { INITIAL_CREATORS, INITIAL_REVIEWS, CreatorProfile, ReviewItem } from './data/creators';
import { LiveVideoModal } from './components/LiveVideoModal';
import { RoomChatModal } from './components/RoomChatModal';
import { AudioCallModal } from './components/AudioCallModal';
import { VipVaultModal } from './components/VipVaultModal';
import { AddReviewModal } from './components/AddReviewModal';
import { PageCustomizerModal } from './components/PageCustomizerModal';
import {
  fetchSupabaseReviews,
  insertSupabaseReview,
  likeSupabaseReview,
  saveSupabaseProfile,
  checkSupabaseHealth
} from './lib/supabase';

export default function App() {
  const [creators, setCreators] = useState<CreatorProfile[]>(INITIAL_CREATORS);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>('olivia');
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5star'>('all');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isSupabaseSynced, setIsSupabaseSynced] = useState<boolean>(true);

  // Modals state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeCreator = creators.find((c) => c.id === selectedCreatorId) || creators[0];

  // Load reviews from Supabase on mount
  React.useEffect(() => {
    fetchSupabaseReviews().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setReviews(loaded);
      }
    });
    checkSupabaseHealth().then((res) => {
      setIsSupabaseSynced(res.connected);
    });
  }, []);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveCustomProfile = (updated: CreatorProfile) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    saveSupabaseProfile(updated);
  };

  const handleResetProfile = () => {
    setCreators(INITIAL_CREATORS);
  };

  const handleToggleLike = (id: string) => {
    setLikedReviews((prev) => {
      const isCurrentlyLiked = !!prev[id];
      const newLiked = !isCurrentlyLiked;
      
      setReviews((all) =>
        all.map((r) => {
          if (r.id === id) {
            const updatedLikes = r.likes + (newLiked ? 1 : -1);
            likeSupabaseReview(id, updatedLikes);
            return { ...r, likes: updatedLikes };
          }
          return r;
        })
      );
      
      return { ...prev, [id]: newLiked };
    });
  };

  const handleAddNewReview = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
    insertSupabaseReview(newReview);
  };

  const filteredReviews = reviewFilter === '5star'
    ? reviews.filter((r) => r.rating >= 5)
    : reviews;

  return (
    <div className="min-h-screen bg-[#070512] text-white flex flex-col items-center justify-start py-2 sm:py-6 px-0 sm:px-4 select-none relative overflow-x-hidden font-sans">
      
      {/* Background Decorative Ambient Radial Glows */}
      <div className="fixed top-20 -left-32 w-96 h-96 bg-purple-700/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Quick Utility Strip */}
      <div className="w-full max-w-md px-4 py-2 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-500/20">
            <span className="text-[11px] text-slate-400">Model:</span>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.name} ({c.age}) {c.isLive ? '🔴' : '🟢'}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${
              isSupabaseSynced
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title="Supabase Database Connected"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseSynced ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>Supabase Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-1 bg-purple-900/40 hover:bg-purple-800/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-500/30 text-[11px] font-semibold text-purple-200 transition-colors"
            title="Edit page content"
          >
            <Sliders className="w-3 h-3 text-pink-400" />
            <span>Customize</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-purple-500/20 text-slate-300 transition-colors"
            title="Copy link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="fixed top-14 z-50 bg-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-emerald-500/40">
          Link copied to clipboard!
        </div>
      )}

      {/* Main Responsive Smartphone Card Container */}
      <main className="w-full sm:max-w-[420px] bg-gradient-to-b from-[#130f28] via-[#0d091d] to-[#070512] sm:rounded-[36px] sm:border sm:border-purple-500/30 p-5 sm:p-6 flex flex-col shadow-2xl relative z-10 sm:my-2">
        
        {/* =========================================================================
            SECTION 1: HERO & ACTION BUTTONS (from Screenshot 1)
        ========================================================================= */}
        <div className="flex flex-col items-center pt-2 sm:pt-4 text-center">
          
          {/* Avatar Ring Section */}
          <div className="relative mb-3 flex flex-col items-center">
            
            {/* "Online" Pill Badge at Top of Avatar */}
            <div className="absolute -top-3 z-20 flex items-center gap-1.5 bg-[#0e1626]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Online</span>
            </div>

            {/* Glowing Circular Avatar with Double Neon Ring */}
            <div className="relative w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-purple-600 shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-[#0d091d]">
                <img
                  src={activeCreator.avatarUrl}
                  alt={activeCreator.name}
                  className="w-full h-full rounded-full object-cover object-top"
                />
              </div>
            </div>

            {/* "LIVE NOW" Pill Badge at Bottom of Avatar */}
            {activeCreator.isLive && (
              <div className="absolute -bottom-3 z-20 flex items-center gap-1.5 bg-[#00e676] text-slate-950 text-xs font-black px-3.5 py-1 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                <span className="tracking-wide uppercase">LIVE NOW</span>
              </div>
            )}
          </div>

          {/* Name & Age & Verified Badge */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeCreator.name}
            </h1>
            
            {/* Pink Checkmark Verified Badge */}
            <div className="w-5 h-5 rounded-full bg-[#f43f5e] flex items-center justify-center text-white shadow-sm shadow-pink-500/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>

            {/* Age Pill Box */}
            <div className="bg-[#1b1730] border border-white/10 text-slate-300 font-bold text-xs px-2 py-0.5 rounded-md shadow-sm">
              {activeCreator.age}
            </div>
          </div>

          {/* Ratings & Views Row */}
          <div className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{activeCreator.rating}</span>
              <span className="text-slate-400 font-normal">({activeCreator.reviewsCount} reviews)</span>
            </div>

            <span className="text-slate-600 font-bold" aria-hidden="true">•</span>

            <div className="flex items-center gap-1 text-pink-400 font-semibold">
              <Eye className="w-3.5 h-3.5 text-pink-400" />
              <span className="tabular-nums">{activeCreator.viewsCount} views</span>
            </div>
          </div>

          {/* Status Message Quote Box */}
          <div className="mt-4 w-full bg-[#16122d]/90 border border-purple-500/20 rounded-2xl p-3.5 shadow-md backdrop-blur-sm">
            <div className="flex items-start justify-center gap-2 text-xs text-slate-200 leading-relaxed font-medium">
              <MessageSquare className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <span>"{activeCreator.statusMessage}"</span>
            </div>
          </div>

        </div>

        {/* The Three Primary Gradient Action Buttons */}
        <div className="mt-5 space-y-3.5 w-full">
          
          {/* Button 1: JOIN FREE CALL (Smart Link 1) */}
          <a
            href={activeCreator.smartLink1 || 'https://auctionr.org/4/6aa43a312f95a6b31bfcb5dc6e435ceb'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-18 p-3.5 rounded-2xl bg-gradient-to-r from-[#e91e63] via-[#ff2975] to-[#f43f5e] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between shadow-xl shadow-pink-600/30 group text-left cursor-pointer border border-white/10 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide leading-tight">
                  JOIN FREE CALL
                </h2>
                <p className="text-[11px] text-white/90 font-medium">
                  Start Live Private Cam Stream
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </a>

          {/* Button 2: ROOM CHAT (Smart Link 2) */}
          <a
            href={activeCreator.smartLink2 || 'https://auctionr.org/4/b88cd54096b427eb256f444c858e4061'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-18 p-3.5 rounded-2xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between shadow-xl shadow-purple-600/30 group text-left cursor-pointer border border-white/10 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide leading-tight">
                  ROOM CHAT
                </h2>
                <p className="text-[11px] text-white/90 font-medium">
                  Private Instant Messaging
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </a>

          {/* Button 3: FREE CALL (Smart Link 3) */}
          <a
            href={activeCreator.smartLink3 || 'https://auctionr.org/4/f93469376ce9310b596779d65b28dde3'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-18 p-3.5 rounded-2xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between shadow-xl shadow-emerald-600/30 group text-left cursor-pointer border border-white/10 no-underline"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-wide leading-tight">
                  FREE CALL
                </h2>
                <p className="text-[11px] text-white/90 font-medium">
                  1-on-1 Direct Audio Connection
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </a>

        </div>

        {/* Scroll Divider with Indicator (from screenshot 2 top) */}
        <div className="pt-8 pb-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-medium">
            <span>Scroll for reviews & vault</span>
            <ChevronDown className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent mt-3" />
        </div>

        {/* =========================================================================
            SECTION 2: ABOUT SOFIA & VIP PHOTO VAULT (from Screenshot 2)
        ========================================================================= */}
        <div className="w-full bg-[#120e26] border border-purple-500/20 rounded-3xl p-5 shadow-lg space-y-4 mb-6">
          
          {/* Header: ✨ About Sofia */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              About {activeCreator.name}
            </h2>
          </div>

          {/* Bio text */}
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeCreator.bio}
          </p>

          {/* Location & Languages tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-[#18152b] border border-purple-500/20 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-medium">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>{activeCreator.location}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#18152b] border border-purple-500/20 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-medium">
              <span className="text-purple-400 text-xs">🍇</span>
              <span>{activeCreator.languages.join(', ')}</span>
            </div>
          </div>

          {/* Unlock VIP Photo Vault Button */}
          <a
            href={activeCreator.smartLink3 || 'https://auctionr.org/4/f93469376ce9310b596779d65b28dde3'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#34112e]/80 hover:bg-[#4a163e] border border-pink-500/40 text-pink-300 font-semibold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer no-underline"
          >
            <Lock className="w-4 h-4 text-pink-400" />
            <span>Unlock VIP Photo Vault ({activeCreator.viewsCount} views)</span>
          </a>
        </div>

        {/* =========================================================================
            SECTION 3: FAN FEEDBACK & REVIEWS (from Screenshot 2)
        ========================================================================= */}
        <div className="w-full space-y-4">
          
          {/* Header Row: Fan Feedback & Reviews (1842) + Add Review */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Fan Feedback & Reviews</span>
                <span className="text-xs text-purple-300 font-normal">({activeCreator.reviewsCount})</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Verified 1-on-1 calls and room experiences
              </p>
            </div>

            <button
              onClick={() => setIsAddReviewModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#2d1b4e] hover:bg-[#3d2568] border border-purple-500/40 text-purple-200 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Review</span>
            </button>
          </div>

          {/* 4.9 Rating Breakdown Card */}
          <div className="w-full bg-[#100d22] border border-purple-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-amber-400 tabular-nums">
                {activeCreator.rating}
              </span>

              <div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  98% positive satisfaction rate
                </span>
              </div>
            </div>

            {/* Filter Tabs: All / 5★ Only */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setReviewFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  reviewFilter === 'all'
                    ? 'bg-[#f43f5e] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setReviewFilter('5star')}
                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                  reviewFilter === '5star'
                    ? 'bg-[#f43f5e] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5★ Only
              </button>
            </div>
          </div>

          {/* Review Items List */}
          <div className="space-y-3 pt-1">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#100d22] border border-purple-500/20 rounded-2xl p-4 space-y-2 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Left: Author Avatar & Name */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full ${rev.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-sm`}
                    >
                      {rev.initial}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{rev.author}</span>
                        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                          ✓ {rev.verifiedType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span>·</span>
                        <span>{rev.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Thumbs Up Like Button */}
                  <button
                    onClick={() => handleToggleLike(rev.id)}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${
                      likedReviews[rev.id]
                        ? 'bg-pink-950/80 border-pink-500/50 text-pink-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Helpful review"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${likedReviews[rev.id] ? 'fill-pink-400' : ''}`} />
                    <span className="tabular-nums font-semibold">{rev.likes}</span>
                  </button>
                </div>

                {/* Review Text */}
                <p className="text-xs text-slate-200 leading-relaxed pt-1">
                  {rev.content}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-purple-500/20 text-center text-[11px] text-slate-500">
          <span>100% Private & Confidential Stream</span>
          <span className="mx-2">·</span>
          <span>256-bit SSL Encrypted</span>
        </div>

      </main>

      {/* =========================================================================
          INTERACTIVE MODALS
      ========================================================================= */}
      
      {/* 1. Live Video Stream Modal */}
      {isVideoModalOpen && (
        <LiveVideoModal
          creator={activeCreator}
          onClose={() => setIsVideoModalOpen(false)}
          onOpenChat={() => setIsChatModalOpen(true)}
          onOpenAudioCall={() => setIsAudioModalOpen(true)}
        />
      )}

      {/* 2. Room Chat Modal */}
      {isChatModalOpen && (
        <RoomChatModal
          creator={activeCreator}
          onClose={() => setIsChatModalOpen(false)}
          onOpenVideoCall={() => setIsVideoModalOpen(true)}
          onOpenAudioCall={() => setIsAudioModalOpen(true)}
        />
      )}

      {/* 3. Free Audio Call Modal */}
      {isAudioModalOpen && (
        <AudioCallModal
          creator={activeCreator}
          onClose={() => setIsAudioModalOpen(false)}
          onOpenVideoCall={() => setIsVideoModalOpen(true)}
          onOpenChat={() => setIsChatModalOpen(true)}
        />
      )}

      {/* 4. VIP Photo Vault Modal */}
      <VipVaultModal
        creator={activeCreator}
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
      />

      {/* 5. Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewModalOpen}
        onClose={() => setIsAddReviewModalOpen(false)}
        onSubmitReview={handleAddNewReview}
        creatorName={activeCreator.name}
      />

      {/* 6. Page Customizer Modal */}
      <PageCustomizerModal
        currentProfile={activeCreator}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleSaveCustomProfile}
        onReset={handleResetProfile}
      />

    </div>
  );
}

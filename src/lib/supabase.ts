import { createClient } from '@supabase/supabase-js';
import { CreatorProfile, ReviewItem, INITIAL_CREATORS, INITIAL_REVIEWS } from '../data/creators';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qgdsylbxovfgwlapmtio.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_57Z_CgGxNRWeVdeTvurTxg_7EH7Tzeb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Check connection health to Supabase
 */
export async function checkSupabaseHealth(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('reviews').select('id').limit(1);
    if (!error) {
      return { connected: true, message: 'Connected to Supabase database (table active)' };
    }
    if (error.code === '42P01' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
      return { connected: true, message: 'Connected to Supabase project (tables ready to create)' };
    }
    return { connected: true, message: `Connected to Supabase: ${error.message}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, message: msg };
  }
}

/**
 * Fetch reviews from Supabase with fallback to local state
 */
export async function fetchSupabaseReviews(): Promise<ReviewItem[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const stored = localStorage.getItem('olivia_reviews');
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    }

    return data.map((item) => ({
      id: item.id?.toString() || Date.now().toString(),
      author: item.author || 'Anonymous',
      initial: item.initial || item.author?.charAt(0).toUpperCase() || 'U',
      avatarBg: item.avatar_bg || 'bg-[#f43f5e]',
      verifiedType: item.verified_type || 'Verified Call',
      rating: Number(item.rating) || 5,
      timeAgo: item.time_ago || 'Recently',
      likes: Number(item.likes) || 0,
      content: item.content || ''
    }));
  } catch {
    const stored = localStorage.getItem('olivia_reviews');
    return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
  }
}

/**
 * Insert a new review into Supabase and persist
 */
export async function insertSupabaseReview(review: ReviewItem): Promise<void> {
  try {
    // Save to local storage for immediate offline reliability
    const stored = localStorage.getItem('olivia_reviews');
    const existing = stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    localStorage.setItem('olivia_reviews', JSON.stringify([review, ...existing]));

    // Attempt cloud insert
    await supabase.from('reviews').insert([
      {
        id: review.id,
        author: review.author,
        initial: review.initial,
        avatar_bg: review.avatarBg,
        verified_type: review.verifiedType,
        rating: review.rating,
        time_ago: review.timeAgo,
        likes: review.likes,
        content: review.content
      }
    ]);
  } catch (err) {
    console.warn('Supabase review insert fallback:', err);
  }
}

/**
 * Like a review in Supabase
 */
export async function likeSupabaseReview(id: string, newLikes: number): Promise<void> {
  try {
    await supabase
      .from('reviews')
      .update({ likes: newLikes })
      .eq('id', id);
  } catch (err) {
    console.warn('Supabase like update fallback:', err);
  }
}

/**
 * Fetch creator profile from Supabase with fallback
 */
export async function fetchSupabaseProfile(id: string): Promise<CreatorProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      age: Number(data.age) || 22,
      isLive: Boolean(data.is_live),
      isOnline: Boolean(data.is_online),
      rating: Number(data.rating) || 4.9,
      reviewsCount: data.reviews_count || '1842',
      viewsCount: data.views_count || '2.4k',
      verified: Boolean(data.verified),
      statusMessage: data.status_message || '',
      avatarUrl: data.avatar_url,
      streamPreviewUrl: data.stream_preview_url || data.avatar_url,
      vaultPhotos: data.vault_photos || [],
      location: data.location || 'Miami, Florida',
      bio: data.bio || '',
      languages: data.languages || ['English'],
      hobbies: data.hobbies || [],
      followers: data.followers || '148k',
      callMinutes: data.call_minutes || '4,200+'
    };
  } catch {
    return null;
  }
}

/**
 * Save creator profile to Supabase
 */
export async function saveSupabaseProfile(profile: CreatorProfile): Promise<void> {
  try {
    await supabase.from('profiles').upsert([
      {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        is_live: profile.isLive,
        is_online: profile.isOnline,
        rating: profile.rating,
        reviews_count: profile.reviewsCount,
        views_count: profile.viewsCount,
        verified: profile.verified,
        status_message: profile.statusMessage,
        avatar_url: profile.avatarUrl,
        location: profile.location,
        bio: profile.bio
      }
    ]);
  } catch (err) {
    console.warn('Supabase profile save fallback:', err);
  }
}

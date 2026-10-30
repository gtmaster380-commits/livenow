-- Supabase schema for Olivia Love Landing Page & Stream App
-- You can run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/qgdsylbxovfgwlapmtio/sql

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER DEFAULT 22,
  is_live BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT true,
  rating NUMERIC DEFAULT 4.9,
  reviews_count TEXT DEFAULT '1842',
  views_count TEXT DEFAULT '2.4k',
  verified BOOLEAN DEFAULT true,
  status_message TEXT,
  avatar_url TEXT,
  stream_preview_url TEXT,
  location TEXT DEFAULT 'Miami, Florida',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  initial TEXT,
  avatar_bg TEXT DEFAULT 'bg-[#f43f5e]',
  verified_type TEXT DEFAULT 'Verified Call',
  rating NUMERIC DEFAULT 5,
  time_ago TEXT DEFAULT 'Just now',
  likes INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Row Level Security (RLS) & Public Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reviews" ON public.reviews FOR UPDATE USING (true);

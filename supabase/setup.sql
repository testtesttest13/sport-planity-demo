-- =============================================
-- SPORT PLANITY - SUPABASE SETUP
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. ENABLE EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CREATE TABLES
-- =============================================

-- Clubs Table
create table if not exists public.clubs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text,
  city text not null,
  sport text check (sport in ('tennis', 'padel', 'equitation')),
  cover_url text,
  logo_url text,
  description text,
  verified boolean default false,
  rating numeric default 0,
  review_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Profiles Table (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'client' check (role in ('admin', 'coach', 'client')),
  club_id uuid references public.clubs(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Coaches Table (extended profile data for coaches)
create table if not exists public.coaches (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null unique,
  club_id uuid references public.clubs(id) on delete cascade not null,
  speciality text,
  bio text,
  age integer,
  rating numeric default 0,
  review_count integer default 0,
  hourly_rate integer default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Coach Availability (weekly schedule)
create table if not exists public.coach_availability (
  id uuid default gen_random_uuid() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  day_of_week integer check (day_of_week >= 0 and day_of_week <= 6), -- 0=Sunday, 6=Saturday
  time_slot time not null,
  is_available boolean default true,
  created_at timestamptz default now(),
  unique(coach_id, day_of_week, time_slot)
);

-- Bookings Table
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  club_id uuid references public.clubs(id) on delete cascade not null,
  booking_date date not null,
  time_slot time not null,
  duration_minutes integer default 60,
  status text default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price integer not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(coach_id, booking_date, time_slot)
);

-- Invitations Table
create table if not exists public.invitations (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  club_id uuid references public.clubs(id) on delete cascade not null,
  invited_by uuid references public.profiles(id) on delete cascade not null,
  role text default 'coach' check (role in ('coach', 'admin')),
  status text default 'pending' check (status in ('pending', 'accepted', 'expired')),
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Reviews Table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null unique,
  author_id uuid references public.profiles(id) on delete cascade not null,
  coach_id uuid references public.coaches(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now()
);

-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.clubs enable row level security;
alter table public.profiles enable row level security;
alter table public.coaches enable row level security;
alter table public.coach_availability enable row level security;
alter table public.bookings enable row level security;
alter table public.invitations enable row level security;
alter table public.reviews enable row level security;

-- Public read access for clubs
create policy "Clubs are viewable by everyone" 
  on public.clubs for select 
  using (true);

-- Public read access for profiles
create policy "Profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

-- Users can update their own profile
create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Public read access for coaches
create policy "Coaches are viewable by everyone" 
  on public.coaches for select 
  using (true);

-- Public read access for coach availability
create policy "Coach availability is viewable by everyone" 
  on public.coach_availability for select 
  using (true);

-- Coaches can manage their own availability
create policy "Coaches can manage own availability" 
  on public.coach_availability for all 
  using (
    exists (
      select 1 from public.coaches 
      where coaches.id = coach_availability.coach_id 
      and coaches.profile_id = auth.uid()
    )
  );

-- Users can view their own bookings
create policy "Users can view own bookings" 
  on public.bookings for select 
  using (
    auth.uid() = client_id or 
    exists (
      select 1 from public.coaches 
      where coaches.id = bookings.coach_id 
      and coaches.profile_id = auth.uid()
    ) or
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.club_id = bookings.club_id
    )
  );

-- Clients can create bookings
create policy "Clients can create bookings" 
  on public.bookings for insert 
  with check (auth.uid() = client_id);

-- Users can update their own bookings (cancel)
create policy "Users can update own bookings" 
  on public.bookings for update 
  using (auth.uid() = client_id);

-- Admins can view invitations for their club
create policy "Admins can view club invitations" 
  on public.invitations for select 
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
      and profiles.club_id = invitations.club_id
    )
  );

-- Admins can create invitations
create policy "Admins can create invitations" 
  on public.invitations for insert 
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Public read access for reviews
create policy "Reviews are viewable by everyone" 
  on public.reviews for select 
  using (true);

-- Users can create reviews for their completed bookings
create policy "Users can create reviews" 
  on public.reviews for insert 
  with check (
    exists (
      select 1 from public.bookings
      where bookings.id = reviews.booking_id
      and bookings.client_id = auth.uid()
      and bookings.status = 'completed'
    )
  );

-- 4. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'client')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger handle_updated_at before update on public.clubs
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.coaches
  for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at before update on public.bookings
  for each row execute procedure public.handle_updated_at();

-- 5. STORAGE
-- =============================================

-- Create avatars bucket
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true) 
on conflict (id) do nothing;

-- Storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (auth.uid()::text = (storage.foldername(name))[1]);

-- 6. SEED DATA (Demo Club)
-- =============================================

-- Insert demo club
insert into public.clubs (id, name, address, city, sport, cover_url, logo_url, description, verified, rating, review_count)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Country Club Lyon',
  '45 Avenue de la Plaine, 69005 Lyon',
  'Lyon',
  'tennis',
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2000',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=200',
  'Le Country Club Lyon est un club de tennis et padel premium situé dans le 5ème arrondissement.',
  true,
  4.9,
  120
) on conflict (id) do nothing;

-- =============================================
-- IMPORTANT: After running this script
-- =============================================
-- 1. Go to Supabase Dashboard > Authentication > Providers
-- 2. Enable Google OAuth
-- 3. Add your Google Client ID and Secret
-- 4. Set Redirect URL: http://localhost:3000/auth/callback (and production URL later)
-- 5. Enable Email provider
-- =============================================

-- SUCCESS! Your database is ready 🎉


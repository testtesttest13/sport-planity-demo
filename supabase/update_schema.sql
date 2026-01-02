-- ============================================
-- SCHEMA UPDATE - ONBOARDING & CLUB CODES
-- ============================================
-- Execute ce script dans Supabase SQL Editor
-- ============================================

-- 1. MISE A JOUR DE LA TABLE CLUBS

ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS siret TEXT;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS amenities TEXT[];
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS join_code TEXT UNIQUE;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.clubs ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. MISE A JOUR DE LA TABLE PROFILES

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS club_id UUID REFERENCES public.clubs(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sport TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS discovery_source TEXT;

-- 3. GENERER UN JOIN_CODE POUR LES CLUBS EXISTANTS

UPDATE public.clubs 
SET join_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5))
WHERE join_code IS NULL;

-- ============================================
-- 4. POLICIES RLS - CLUBS
-- ============================================

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read clubs" ON public.clubs;
CREATE POLICY "Anyone can read clubs" ON public.clubs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create clubs" ON public.clubs;
CREATE POLICY "Authenticated users can create clubs" ON public.clubs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can update their club" ON public.clubs;
CREATE POLICY "Admins can update their club" ON public.clubs FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ============================================
-- 5. POLICIES RLS - PROFILES (SIMPLE - PAS DE RECURSION)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes policies pour eviter les conflits
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read club profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Policies simples sans recursion
CREATE POLICY "Users can read own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permettre de lire tous les profils (necessaire pour afficher les noms des clients/coachs)
CREATE POLICY "Authenticated can read all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ============================================
-- 6. POLICIES RLS - COACHES
-- ============================================

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read coaches" ON public.coaches;
DROP POLICY IF EXISTS "Users can create own coach entry" ON public.coaches;
DROP POLICY IF EXISTS "Coaches can update own entry" ON public.coaches;
DROP POLICY IF EXISTS "Admins can manage club coaches" ON public.coaches;

-- Tout le monde peut lire les coaches
CREATE POLICY "Anyone can read coaches" ON public.coaches 
  FOR SELECT USING (true);

-- Les utilisateurs peuvent creer leur propre entree coach
CREATE POLICY "Users can create own coach entry" ON public.coaches 
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Les coaches peuvent mettre a jour leur profil
CREATE POLICY "Coaches can update own entry" ON public.coaches 
  FOR UPDATE USING (auth.uid() = profile_id);

-- Les coaches peuvent supprimer leur profil
CREATE POLICY "Coaches can delete own entry" ON public.coaches 
  FOR DELETE USING (auth.uid() = profile_id);

-- ============================================
-- 7. POLICIES RLS - COACH_AVAILABILITY
-- ============================================

ALTER TABLE public.coach_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read availability" ON public.coach_availability;
DROP POLICY IF EXISTS "Coaches can manage own availability" ON public.coach_availability;

CREATE POLICY "Anyone can read availability" ON public.coach_availability 
  FOR SELECT USING (true);

CREATE POLICY "Coaches can insert availability" ON public.coach_availability 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_availability.coach_id AND coaches.profile_id = auth.uid())
  );

CREATE POLICY "Coaches can update availability" ON public.coach_availability 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_availability.coach_id AND coaches.profile_id = auth.uid())
  );

CREATE POLICY "Coaches can delete availability" ON public.coach_availability 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.coaches WHERE coaches.id = coach_availability.coach_id AND coaches.profile_id = auth.uid())
  );

-- ============================================
-- 8. POLICIES RLS - BOOKINGS
-- ============================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Clients can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can read club bookings" ON public.bookings;

-- Les utilisateurs peuvent voir leurs propres reservations
CREATE POLICY "Users can read own bookings" ON public.bookings 
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = coach_id);

-- Les clients peuvent creer des reservations
CREATE POLICY "Clients can create bookings" ON public.bookings 
  FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Les utilisateurs peuvent modifier leurs reservations
CREATE POLICY "Users can update own bookings" ON public.bookings 
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = coach_id);

-- Les utilisateurs peuvent annuler leurs reservations
CREATE POLICY "Users can delete own bookings" ON public.bookings 
  FOR DELETE USING (auth.uid() = client_id);

-- ============================================
-- 9. VERIFICATION
-- ============================================

SELECT '=== SCHEMA ET RLS MIS A JOUR ===' as status;
SELECT 'Clubs avec join_code:' as info, name, join_code FROM public.clubs;

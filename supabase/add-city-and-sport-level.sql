-- ============================================
-- SCHEMA UPDATE - ADD CITY AND SPORT_LEVEL
-- ============================================
-- Execute ce script dans Supabase SQL Editor
-- ============================================

-- Ajouter colonne city (ville) dans profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;

-- Ajouter colonne sport_level (niveau sportif 1-10) dans profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sport_level INTEGER CHECK (sport_level IS NULL OR (sport_level >= 1 AND sport_level <= 10));

SELECT '=== COLONNES city ET sport_level AJOUTEES A profiles ===' as status;


-- ============================================
-- NETTOYER LES DISPONIBILITES COACH
-- ============================================
-- Execute ce script dans Supabase SQL Editor
-- pour supprimer toutes les disponibilités et recommencer à zéro
-- ============================================

-- Supprimer toutes les disponibilités
DELETE FROM public.coach_availability;

-- Verification
SELECT '=== DISPONIBILITES NETTOYEES ===' as status;
SELECT COUNT(*) as total_restant FROM public.coach_availability;


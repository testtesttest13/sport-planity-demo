-- ============================================
-- CORRECTION RLS - COACH_AVAILABILITY
-- ============================================
-- Execute ce script dans Supabase SQL Editor
-- pour corriger les politiques RLS de coach_availability
-- ============================================

DROP POLICY IF EXISTS "Coaches can insert availability" ON public.coach_availability;
DROP POLICY IF EXISTS "Coaches can update availability" ON public.coach_availability;
DROP POLICY IF EXISTS "Coaches can delete availability" ON public.coach_availability;

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

SELECT '=== POLITIQUES RLS MISES A JOUR ===' as status;


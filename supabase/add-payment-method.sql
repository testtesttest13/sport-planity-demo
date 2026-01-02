-- ============================================
-- AJOUT COLONNE PAYMENT_METHOD
-- ============================================
-- Execute ce script dans Supabase SQL Editor
-- ============================================

-- Ajouter la colonne payment_method à la table bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Comment: 
-- - 'on_site' = Paiement sur place
-- - 'online' = Paiement en ligne par carte
-- - NULL = Anciennes réservations (rétrocompatibilité)

SELECT '=== COLONNE PAYMENT_METHOD AJOUTEE ===' as status;


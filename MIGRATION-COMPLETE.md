# 🚀 PLAN DE MIGRATION COMPLÈTE VERS SUPABASE

## ✅ ÉTAT ACTUEL

### Pages déjà migrées vers Supabase :
- ✅ `app/page.tsx` - Clubs depuis Supabase
- ✅ `app/club/[id]/page.tsx` - Clubs et coaches depuis Supabase  
- ✅ `app/account/page.tsx` - Profil depuis Supabase
- ✅ `app/account/edit/page.tsx` - Édition depuis Supabase
- ✅ `app/onboarding/page.tsx` - Onboarding vers Supabase
- ✅ `app/login/page.tsx` - Auth Supabase
- ✅ `app/auth/callback/route.ts` - Callback OAuth

### Pages encore avec mock-data :
- ❌ `app/my-bookings/page.tsx` - Utilise `useStore` et `mockClubs/mockCoaches`
- ❌ `components/booking-drawer.tsx` - Utilise `useStore` pour sauvegarder
- ⚠️ `app/admin/page.tsx` - À vérifier
- ⚠️ `app/coach/page.tsx` - À vérifier
- ⚠️ `app/coach/schedule/page.tsx` - À vérifier

---

## 📋 TÂCHES PRIORITAIRES

### 1. Créer les comptes démo (FAIT)
- Script SQL créé : `supabase/create-demo-accounts.sql`
- Instructions créées : `INSTRUCTIONS-COMPTES-DEMO.md`
- **Action requise** : Utilisateur doit créer les comptes via l'interface puis exécuter le script

### 2. Migrer "Mes Cours" (`app/my-bookings/page.tsx`)
**Problèmes actuels** :
- Utilise `useStore()` pour les bookings
- Utilise `mockClubs` et `mockCoaches` pour afficher les infos
- Ne charge rien depuis Supabase

**Solution** :
- Charger les bookings depuis `public.bookings` avec jointures
- Charger les infos coach/club depuis Supabase
- Remplacer `cancelBooking` du store par une suppression dans Supabase

### 3. Migrer "Booking Drawer" (`components/booking-drawer.tsx`)
**Problèmes actuels** :
- Utilise `useStore().addBooking()` pour sauvegarder
- Les bookings sont seulement en mémoire locale
- Ne persiste pas dans la DB

**Solution** :
- Créer les bookings dans `public.bookings` via Supabase
- Charger les disponibilités depuis `public.coach_availability`
- Vérifier les créneaux disponibles depuis la DB

### 4. Barre de recherche (Page accueil)
**Problème actuel** :
- Juste décorative, pas de fonctionnalité

**Solution** :
- Pour MVP : Garder décorative (filtres par catégories fonctionnent déjà)
- Ou : Implémenter recherche par ville/nom de club

---

## 🔑 IDs DES COMPTES DÉMO

Pour obtenir les IDs, exécutez dans Supabase SQL Editor :

```sql
SELECT email, id, role, full_name, club_id
FROM public.profiles 
WHERE email LIKE 'demo.%@sportplanity.com'
ORDER BY email;
```

Les IDs seront affichés. **Vous ne pouvez pas connaître les IDs à l'avance** car ils sont générés par Supabase Auth lors de la création des comptes.

---

## ⚠️ IMPORTANT

1. **Les comptes doivent être créés D'ABORD** via l'interface Auth (Supabase Dashboard ou l'app)
2. **Ensuite** exécuter `create-demo-accounts.sql` pour mettre à jour les profils
3. Les IDs sont des UUIDs générés automatiquement - impossible de les prévoir


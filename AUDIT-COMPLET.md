# 🔍 AUDIT COMPLET - Migration vers Supabase

## ❌ PROBLÈMES IDENTIFIÉS

### 1. Barre de recherche (Page Accueil)
- ❌ **Status**: Décorative seulement, pas de fonctionnalité
- **Fichier**: `app/page.tsx` ligne 129-165
- **Action**: La barre de recherche est juste un div cliquable sans action

### 2. Page "Mes Cours" (`app/my-bookings/page.tsx`)
- ❌ **Status**: Utilise encore `useStore` et `mockClubs/mockCoaches`
- **Ligne 15-16**: `import { useStore } from '@/lib/store'` et `mockClubs, mockCoaches`
- **Ligne 23**: `const { currentUser, bookings, cancelBooking } = useStore()`
- **Ligne 151-152**: Utilise `mockCoaches.find()` et `mockClubs.find()`
- **Action**: Migrer vers Supabase pour charger les bookings réels

### 3. Booking Drawer (`components/booking-drawer.tsx`)
- ❌ **Status**: Utilise `useStore` pour sauvegarder les bookings
- **Ligne 12**: `import { useStore } from '@/lib/store'`
- **Ligne 30**: `const { addBooking, currentUser, bookings } = useStore()`
- **Ligne 92**: `addBooking(booking)` - sauvegarde dans le store local
- **Action**: Sauvegarder dans Supabase table `bookings`

### 4. Comptes Démo
- ❌ **Status**: Pas créés dans la DB
- **Problème**: Les comptes doivent être créés via l'interface Auth d'abord
- **Action**: Créer script SQL pour mettre à jour les profils après création

---

## ✅ FICHIERS DÉJÀ MIGRÉS

- ✅ `app/page.tsx` - Clubs depuis Supabase
- ✅ `app/club/[id]/page.tsx` - Clubs et coaches depuis Supabase
- ✅ `app/account/page.tsx` - Profil depuis Supabase
- ✅ `app/account/edit/page.tsx` - Édition depuis Supabase
- ✅ `app/onboarding/page.tsx` - Onboarding vers Supabase

---

## 📋 PLAN D'ACTION

### Priorité 1: Comptes Démo
1. Créer les comptes via l'interface Supabase Auth (ou via l'app)
2. Exécuter `supabase/create-demo-accounts.sql`
3. Vérifier les IDs des comptes

### Priorité 2: Booking System
1. Migrer `components/booking-drawer.tsx` vers Supabase
2. Migrer `app/my-bookings/page.tsx` vers Supabase
3. Tester création et affichage des bookings

### Priorité 3: Barre de Recherche
1. Implémenter la fonctionnalité de recherche (filtres)

### Priorité 4: Autres Pages
1. Vérifier `app/admin/page.tsx`
2. Vérifier `app/coach/page.tsx`
3. Vérifier `app/coach/schedule/page.tsx`

---

## 🔑 IDS DES COMPTES DÉMO

Pour obtenir les IDs, exécutez dans Supabase SQL Editor:
```sql
SELECT id, email, role FROM public.profiles 
WHERE email LIKE 'demo.%@sportplanity.com';
```

Les IDs seront générés automatiquement par Supabase Auth.


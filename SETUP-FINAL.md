# 🚀 SETUP FINAL - BASE PROPRE

## 📋 ÉTAPES

### 1. Exécuter le script SQL de reset

Dans **Supabase Dashboard > SQL Editor**, exécutez :
**`supabase/RESET-COMPLET.sql`**

Ce script va :
- ✅ Vider toutes les tables (bookings, reviews, coaches, availability, clubs, profiles)
- ✅ Créer un seul club (Tennis Club Elite Paris)
- ✅ Laisser la base propre pour repartir de zéro

---

### 2. Créer un compte CLIENT

1. Allez sur l'app en local : `http://localhost:3000`
2. Cliquez sur "Connexion" ou "S'inscrire"
3. Créez un compte avec un email (ex: `client@test.com`)
4. Complétez l'onboarding
5. ✅ Votre compte client est créé !

---

### 3. Créer un compte COACH

1. Déconnectez-vous si vous êtes connecté
2. Créez un nouveau compte avec un email différent (ex: `coach@test.com`)
3. Complétez l'onboarding
4. **IMPORTANT** : Pour l'instant, c'est un compte client. Il faut le convertir en coach.

---

### 4. Convertir le compte en COACH

Dans **Supabase Dashboard > SQL Editor**, exécutez ce script en remplaçant `coach@test.com` par l'email que vous avez utilisé :

```sql
-- Mettre à jour le profil coach
UPDATE public.profiles 
SET role = 'coach', club_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE email = 'coach@test.com';

-- Créer l'entrée coach
INSERT INTO public.coaches (profile_id, club_id, speciality, bio, hourly_rate, rating, review_count)
SELECT id, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tennis', 'Coach certifié depuis 10 ans', 65, 4.9, 0
FROM public.profiles WHERE email = 'coach@test.com';
```

---

### 5. Tester le flow complet

#### A. En tant que COACH
1. Connectez-vous avec `coach@test.com`
2. Allez dans **"Disponibilités"** dans le menu du bas
3. Sélectionnez vos créneaux disponibles (ex: Lundi-Vendredi, 9h-18h)
4. Cliquez sur **"Enregistrer"**
5. ✅ Vos disponibilités sont sauvegardées !

#### B. En tant que CLIENT
1. Déconnectez-vous
2. Connectez-vous avec `client@test.com`
3. Allez sur la page d'accueil
4. Cliquez sur **"Tennis Club Elite Paris"**
5. Vous devriez voir le coach
6. Cliquez sur **"Réserver"**
7. Sélectionnez une date et un créneau
8. Confirmez la réservation
9. ✅ Votre réservation est créée !

#### C. Vérifier en tant que COACH
1. Déconnectez-vous
2. Connectez-vous avec `coach@test.com`
3. Allez dans **"Gestion"** dans le menu du bas
4. Cliquez sur l'onglet **"Réservations"**
5. ✅ Vous devriez voir la réservation du client !

---

## ✅ CHECKLIST

- [ ] Script RESET-COMPLET.sql exécuté
- [ ] Compte client créé (`client@test.com`)
- [ ] Compte coach créé (`coach@test.com`)
- [ ] Script SQL de conversion coach exécuté
- [ ] Coach peut créer ses disponibilités
- [ ] Client peut réserver un cours
- [ ] Coach peut voir ses réservations

---

## 🎉 TOUT EST PRÊT !

L'application fonctionne maintenant de A à Z avec 1 compte client et 1 compte coach.


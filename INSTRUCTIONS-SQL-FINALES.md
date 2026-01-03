# 📋 INSTRUCTIONS SQL FINALES - TOUT EN UN

## 🎯 UN SEUL SCRIPT À EXÉCUTER

**Fichier** : `supabase/COMPLETE-SETUP.sql`

Ce script fait **TOUT** dans le bon ordre :
1. ✅ Nettoie les données existantes
2. ✅ Crée les 5 clubs (tennis, padel, yoga, boxe, fitness)
3. ✅ Met à jour le profil Mathis (si le compte existe)
4. ✅ Crée l'entrée coach pour Mathis (si le profil existe)
5. ✅ Crée les disponibilités pour tous les coaches (9h-18h, lundi-vendredi)
6. ✅ Affiche les vérifications

---

## 📝 ÉTAPES

### 1. Ouvrir Supabase SQL Editor
- Allez sur https://supabase.com/dashboard
- Votre projet → **SQL Editor** (menu de gauche)
- Cliquez sur **New Query**

### 2. Copier-coller le script complet
- Ouvrez le fichier `supabase/COMPLETE-SETUP.sql`
- **Copiez TOUT le contenu**
- Collez-le dans l'éditeur SQL de Supabase

### 3. Exécuter
- Cliquez sur **Run** (ou `Cmd/Ctrl + Enter`)
- Attendez la fin de l'exécution

### 4. Vérifier les résultats
À la fin, vous devriez voir **5 résultats** :
1. ✅ Clubs créés (5 clubs)
2. ✅ Coaches créés (1 coach = Mathis, si le compte existe)
3. ✅ Disponibilités créées (total)
4. ✅ Disponibilités par coach (détail)
5. ✅ Profil Mathis (confirmation)

---

## ⚠️ IMPORTANT

### Si "Coaches créés" est vide :
Cela signifie que le compte `demo.coach@sportplanity.com` n'existe pas encore dans `auth.users`.

**Solution** :
1. Créez le compte via l'interface d'inscription de l'app (`/login`)
2. Ou créez-le via Supabase Dashboard → Authentication → Users
3. Puis réexécutez le script (ou juste la partie coach)

### Si "Disponibilités créées" = 0 :
Cela signifie qu'il n'y a pas de coaches dans la table `coaches`.

**Solution** :
1. Assurez-vous que le compte Mathis existe
2. Réexécutez le script complet

---

## 🔍 VÉRIFICATIONS APRÈS EXÉCUTION

### Vérifier que tout est OK :
```sql
-- Vérifier les clubs
SELECT COUNT(*) FROM public.clubs; -- Doit retourner 5

-- Vérifier les coaches
SELECT COUNT(*) FROM public.coaches; -- Doit retourner au moins 1 (Mathis)

-- Vérifier les disponibilités
SELECT COUNT(*) FROM public.coach_availability; -- Doit retourner au moins 45 (9 créneaux × 5 jours)
```

---

## ✅ RÉSULTAT ATTENDU

Après exécution, vous devriez avoir :
- ✅ **5 clubs** créés
- ✅ **1 coach** (Mathis) dans le club de tennis
- ✅ **45 disponibilités** pour Mathis (9 créneaux × 5 jours)
- ✅ Tout prêt pour tester les réservations !

---

## 🚀 PROCHAINES ÉTAPES

Une fois le script exécuté :
1. Testez la page d'accueil → Vous devriez voir les 5 clubs
2. Cliquez sur le club de tennis → Vous devriez voir Mathis comme coach
3. Cliquez sur "Réserver" → Vous devriez voir les créneaux disponibles
4. Réservez un cours → Il devrait être sauvegardé dans la DB
5. Allez dans "Mes cours" → Vous devriez voir votre réservation


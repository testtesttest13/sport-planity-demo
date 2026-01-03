# 📋 INSTRUCTIONS : Exécuter le Script SQL

## ⚠️ IMPORTANT - LISEZ-MOI D'ABORD

Avant de continuer avec le rebranding et les nouvelles fonctionnalités, vous **DEVEZ** exécuter le script SQL suivant dans votre Supabase SQL Editor.

---

## 📝 ÉTAPES

### 1. Ouvrez votre Dashboard Supabase
Allez sur : https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

### 2. Cliquez sur "SQL Editor"
Dans le menu de gauche, cliquez sur **"SQL Editor"**

### 3. Créez une Nouvelle Requête
Cliquez sur **"New Query"**

### 4. Copiez le Script
Ouvrez le fichier `supabase/update_schema.sql` et **copiez TOUT son contenu**

### 5. Collez dans SQL Editor
Collez le script dans l'éditeur SQL

### 6. Exécutez
Cliquez sur **"Run"** (ou appuyez sur Cmd/Ctrl + Enter)

### 7. Vérifiez le Résultat
Vous devriez voir :
- `Schema update completed! ✅`
- `total_clubs | 6`
- Liste des 6 clubs insérés

---

## ✅ Ce que fait le Script

1. **Ajoute les colonnes manquantes** à `profiles` :
   - `sport` (text)
   - `discovery_source` (text)
   - Note: `phone` existe déjà

2. **Met à jour la contrainte** sur `clubs.sport` pour accepter :
   - tennis, padel, yoga, boxe, fitness, equitation

3. **Nettoie les données existantes** :
   - Vide `bookings` et `reviews`
   - Supprime tous les clubs existants

4. **Insère 6 nouveaux clubs style Airbnb** :
   - The Blue Court (Tennis, Paris)
   - Zen Loft (Yoga, Lyon)
   - Power Arena (Fitness, Paris)
   - Golden Padel (Padel, Marseille)
   - Fight Club (Boxe, Bordeaux)
   - Elite Tennis (Tennis, Paris)

---

## ❌ En cas d'erreur

- **Erreur de contrainte** : C'est normal, le script gère ça avec `drop constraint if exists`
- **Erreur de permissions** : Vérifiez que vous êtes bien connecté à votre projet Supabase

---

**Une fois terminé, vous pouvez continuer avec le reste du rebranding ! ✅**


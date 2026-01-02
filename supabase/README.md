# Scripts SQL Supabase

## Fichiers disponibles

### `update_schema.sql`
Script principal pour mettre à jour le schéma de la base de données :
- Ajoute les colonnes nécessaires (join_code, siret, amenities, etc.)
- Configure les politiques RLS pour toutes les tables

### `clear-availability.sql`
**Utilise ce script pour nettoyer toutes les disponibilités et recommencer à zéro.**

Supprime toutes les entrées de `coach_availability` pour que tu puisses recréer tes disponibilités depuis le début.

### `fix-coach-availability-rls.sql`
**Utilise ce script si tu as des erreurs RLS lors de la sauvegarde des disponibilités coach.**

Corrige les politiques RLS pour `coach_availability` en vérifiant correctement que le coach appartient à l'utilisateur via la table `coaches`.

### `add-payment-method.sql`
**Ajoute la colonne `payment_method` à la table `bookings`.**

Permet de stocker la méthode de paiement choisie par le client lors de la réservation ('on_site' pour sur place, 'online' pour en ligne).

---

## Comment utiliser

1. Ouvrir **Supabase Dashboard > SQL Editor**
2. Copier/coller le contenu du script souhaité
3. Cliquer sur **Run**

---

## Nouveau flow d'onboarding

L'onboarding demande maintenant à l'utilisateur son rôle :

### 1. Élève (Client)
- Prénom/Nom
- Sport favori
- Source de découverte
- → Redirige vers l'accueil

### 2. Coach
- Entre un code à 5 caractères
- Le code correspond à un club
- → Redirige vers le dashboard coach

### 3. Admin (Créateur de club)
- Prénom/Nom
- Infos club (nom, adresse, SIRET)
- Équipements (badges)
- Photo + description
- → Génère un code à 5 caractères pour les coachs
- → Redirige vers le dashboard admin

---

## Codes de club

Chaque club a un `join_code` unique de 5 caractères (ex: "AB123").
Les coachs utilisent ce code pour rejoindre un club lors de l'onboarding.

---

## Gestion des réservations annulées

✅ Les réservations annulées (status = 'cancelled') n'apparaissent plus dans les créneaux disponibles.
✅ Quand un coach ou un client annule une réservation, le créneau redevient automatiquement disponible.
✅ Le système utilise `.neq('status', 'cancelled')` pour exclure les réservations annulées de la liste des créneaux occupés.

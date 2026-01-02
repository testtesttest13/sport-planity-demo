# ✅ Fonctionnalités Simpl. - Liste Complète

**Version:** 1.0  
**Date:** Décembre 2024  
**Statut:** Prêt pour déploiement

---

## 🎯 Vue d'ensemble

Simpl. est une plateforme complète de réservation de cours de sport qui permet aux clients de réserver des créneaux avec des coachs, aux coachs de gérer leurs disponibilités et aux administrateurs de gérer leurs clubs.

---

## 🔐 Authentification & Onboarding

### ✅ Inscription / Connexion
- **Page de connexion** (`/login`)
  - Connexion par email/mot de passe
  - Inscription par email/mot de passe
  - Connexion Google OAuth
  - Validation des emails avec confirmation
  - Redirection automatique après connexion
  - Messages d'erreur clairs

### ✅ Onboarding multi-rôles (`/onboarding`)
- **Client (Élève)**
  - Formulaire prénom/nom
  - Sélection du sport favori (Tennis, Padel, Yoga, Boxe, Fitness)
  - Choix de la source de découverte (Google, Amis, Publicité, Autre)
  - Redirection vers l'accueil

- **Coach**
  - Saisie d'un code club (5 caractères)
  - Validation du code et association au club
  - Création automatique de l'entrée coach
  - Redirection vers le dashboard coach

- **Admin (Créateur de club)**
  - Formulaire prénom/nom
  - Informations du club (nom, adresse, ville, code postal, SIRET)
  - Sélection des équipements/amenities (badges)
  - Upload de photo de couverture et logo
  - Description du club
  - Génération automatique d'un code d'invitation (5 caractères)
  - Redirection vers le dashboard admin

---

## 🏠 Espace Client

### ✅ Page d'accueil (`/`)
- Recherche de clubs par ville (barre de recherche fonctionnelle)
- Filtrage par catégorie de sport (Tennis, Padel, Yoga, Boxe, Fitness)
- Affichage des clubs avec :
  - Photo de couverture
  - Nom et ville
  - Note et nombre d'avis
  - Navigation vers la page du club

### ✅ Page Club (`/club/[id]`)
- **Header avec image de couverture**
  - Logo du club
  - Nom et adresse
  - Bouton "Partager" (Web Share API ou copie dans le presse-papiers)
  - Note et nombre d'avis
  - Description du club
  - Équipements/amenities affichés en badges

- **Onglet Coaches**
  - Grille 2x2 des coachs
  - Carte coach avec :
    - Photo
    - Nom et âge
    - Spécialité
    - Bio
    - Note et nombre d'avis
    - Tarif horaire
    - Bouton "Réserver"

- **Onglet Informations**
  - Adresse complète
  - Téléphone
  - Équipements disponibles

### ✅ Réservation (`components/booking-drawer.tsx`)
- **Sélection de date**
  - Calendrier horizontal (7 prochains jours)
  - Dates passées désactivées
  - Date du jour mise en évidence

- **Sélection d'horaire**
  - Créneaux disponibles uniquement (basés sur les disponibilités du coach)
  - Exclusion automatique des créneaux déjà réservés
  - Filtrage des heures passées pour le jour sélectionné
  - Format d'affichage "14h" au lieu de "14:00:00"

- **Méthode de paiement**
  - Choix entre "Sur place" et "En ligne (carte bancaire)"
  - Interface visuelle avec icônes
  - Bouton adaptatif selon le choix

- **Confirmation**
  - Récapitulatif (coach, date, heure, prix)
  - Animation de succès
  - Prévention des double-réservations (vérification avant insertion)

### ✅ Mes cours (`/my-bookings`)
- **Onglet "À venir"**
  - Liste des réservations futures
  - Card avec :
    - Photo du coach
    - Nom du coach
    - Date et heure (format français)
    - Club et adresse
    - Prix
    - Statut (Confirmé)
    - Bouton "Ajouter au calendrier" (export Google Calendar)
    - Bouton "Annuler"

- **Onglet "Passés"**
  - Historique des cours passés
  - Même format de card
  - Bouton "Réserver à nouveau" sur chaque cours passé

- **Annulation**
  - Dialog de confirmation
  - Le créneau redevient disponible automatiquement
  - Toast de confirmation

### ✅ Mon compte (`/account`)
- Affichage du profil :
  - Photo de profil (avatar)
  - Nom complet
  - Email
  - Téléphone (si renseigné)
  - Sport favori (pour les clients)
  - Nom du club (pour les coachs/admins)
  - Source de découverte
- Bouton "Modifier" vers `/account/edit`
- Bouton "Déconnexion"

### ✅ Édition du profil (`/account/edit`)
- Formulaire pour modifier :
  - Nom complet
  - Téléphone
  - Photo de profil (upload Supabase Storage)
  - Sport favori
  - Source de découverte
- Sauvegarde avec validation

---

## 🎾 Espace Coach

### ✅ Dashboard (`/coach`)
- **Statistiques**
  - Nombre de réservations à venir
  - Tarif horaire
  - Nombre d'avis
  - Note moyenne

- **Onglet "Planning"**
  - Vue hebdomadaire du planning
  - Grille jour/heure
  - Statut des créneaux :
    - Disponible (vert)
    - Réservé (bleu)
    - Indisponible (gris)
  - Informations des réservations au survol

- **Onglet "Réservations"**
  - Liste des réservations à venir
  - Card avec :
    - Photo du client (avatar)
    - Nom du client
    - Email et téléphone du client
    - Date et heure complètes
    - Prix
    - Méthode de paiement
    - Bouton "Annuler" avec dialog
  - Annulation avec raison obligatoire
  - Le créneau redevient disponible après annulation

- **Onglet "Paramètres"**
  - **Gestion du tarif horaire**
    - Affichage du prix actuel
    - Bouton "Modifier"
    - Formulaire avec validation
    - Sauvegarde dans la base de données
    - Toast de confirmation

### ✅ Disponibilités (`/coach/schedule`)
- **Toggle de vue**
  - Vue "Semaine" (grille hebdomadaire)
  - Vue "Calendrier" (mois complet)

- **Vue Semaine**
  - Navigation entre les semaines (flèches précédent/suivant)
  - Sélection du jour de la semaine
  - Jours passés désactivés
  - Jour actuel mis en évidence
  - Compteur de créneaux par jour
  - Actions rapides "Tout" / "Rien" pour sélectionner/désélectionner tous les créneaux d'un jour
  - Grille de créneaux horaires (7h-20h)
  - Sélection multiple de créneaux
  - Feedback visuel (créneaux sélectionnés en vert avec coche)
  - Bouton "Enregistrer" qui apparaît quand il y a des changements

- **Vue Calendrier**
  - Navigation mensuelle (précédent/suivant)
  - Grille calendrier complète
  - Indicateurs visuels pour les jours avec disponibilités (point vert)
  - Clic sur un jour pour sélectionner et basculer vers la vue semaine
  - Jours passés désactivés
  - Jour actuel mis en évidence
  - Légende explicative

- **Fonctionnalités communes**
  - Horaires récurrents (s'appliquent à toutes les semaines)
  - Sauvegarde avec sync base de données
  - Toast de confirmation
  - Bouton d'aide interactif (HelpTour) avec guide étape par étape

---

## 🏢 Espace Admin

### ✅ Dashboard (`/admin`)
- **Statistiques globales**
  - Nombre de coachs
  - Réservations (semaine/mois/année/période personnalisée)
  - Revenus (semaine/mois/année/période personnalisée)
  - Note moyenne du club
  - Graphiques de tendances (flèches haut/bas)

- **Navigation**
  - Onglets vers : Dashboard, Équipe, Réservations, Paramètres

### ✅ Gestion de l'équipe (`/admin/team`)
- Liste complète des coachs du club
- Card coach avec :
  - Photo de profil
  - Nom
  - Spécialité
  - Statistiques individuelles :
    - Nombre de réservations totales
    - Revenus générés
    - Note moyenne
    - Nombre d'avis
  - Bouton "Voir détails"

- **Invitation de coachs**
  - Formulaire avec email
  - Envoi d'email d'invitation (Resend)
  - Affichage du code d'invitation avec bouton copier
  - Partage du code d'invitation

### ✅ Gestion des réservations (`/admin/bookings`)
- Liste complète des réservations du club
- Filtres par période (semaine/mois/année/personnalisé)
- Détails de chaque réservation :
  - Coach
  - Client
  - Date et heure
  - Prix
  - Statut
  - Méthode de paiement

### ✅ Paramètres du club (`/admin/settings`)
- Informations du club :
  - Nom
  - Adresse, ville, code postal
  - SIRET
  - Description
  - Photo de couverture
  - Logo
  - Équipements/amenities
- Modification et sauvegarde
- Code d'invitation affiché avec bouton copier

---

## 🔧 Fonctionnalités Techniques

### ✅ Base de données (Supabase)
- **Tables principales :**
  - `clubs` (informations des clubs)
  - `profiles` (profils utilisateurs avec rôles)
  - `coaches` (entrées coachs liées aux clubs)
  - `coach_availability` (disponibilités récurrentes par jour de semaine)
  - `bookings` (réservations avec statut, prix, méthode de paiement)

- **Row Level Security (RLS)**
  - Politiques de sécurité configurées
  - Accès contrôlé selon les rôles
  - Coaches peuvent gérer leurs propres disponibilités
  - Clients peuvent voir leurs propres réservations
  - Admins peuvent gérer leur club

### ✅ Authentification (Supabase Auth)
- Gestion des sessions
- Tokens JWT
- OAuth Google
- Confirmation d'email
- Middleware de protection des routes

### ✅ Storage (Supabase Storage)
- Upload d'avatars utilisateurs
- Upload de photos de clubs (couverture, logo)
- URLs publiques sécurisées

### ✅ Email (Resend)
- Envoi d'emails d'invitation pour les coachs
- Templates d'emails personnalisés

### ✅ UI/UX
- Design responsive (mobile-first)
- Bottom navigation adaptative selon le rôle
- Toast notifications (Sonner) au lieu d'alertes natives
- Animations Framer Motion
- Components Shadcn UI
- Images optimisées (Next.js Image)
- Loading states
- Error handling

### ✅ Navigation
- **Client non connecté :**
  - Connexion

- **Client connecté :**
  - Rechercher (accueil)
  - Mes cours
  - Compte

- **Coach connecté :**
  - Gestion (dashboard)
  - Disponibilités
  - Compte

- **Admin connecté :**
  - Dashboard
  - Équipe
  - Réservations
  - Club (paramètres)

---

## 📱 Responsive Design

### ✅ Mobile
- Layout adaptatif
- Touch targets optimisés (minimum 44px)
- Grilles adaptatives (2 colonnes → 3 → 4 → 7)
- Textes adaptatifs (cachés si nécessaire)
- Espacements optimisés
- Bottom navigation fixe

### ✅ Tablette
- Grilles intermédiaires
- Meilleure utilisation de l'espace

### ✅ Desktop
- Layout centré avec max-width
- Grilles complètes
- Hover states
- Meilleure lisibilité

---

## 🎨 Design System

### ✅ Couleurs
- Bleu/Indigo pour les actions principales
- Vert pour les disponibilités/succès
- Rouge pour les actions destructives
- Gris pour les éléments neutres

### ✅ Typographie
- Hiérarchie claire (titres, sous-titres, texte)
- Tailles adaptatives
- Poids de police variés

### ✅ Composants réutilisables
- Button (variants, sizes)
- Card
- Badge
- Avatar
- Dialog
- Tabs
- Toast
- Input
- Drawer (Vaul)

---

## 🔒 Sécurité

### ✅ Protection des routes
- Middleware Next.js pour vérifier l'authentification
- Redirection automatique si non authentifié
- Vérification des rôles

### ✅ Validation
- Validation côté client
- Validation côté serveur (RLS)
- Protection contre les double-réservations
- Validation des formulaires

### ✅ Gestion des erreurs
- Messages d'erreur clairs
- Fallbacks UI
- Logs d'erreur console
- Toast notifications pour les erreurs

---

## 📊 Fonctionnalités Avancées

### ✅ Export Google Calendar
- Génération de liens Google Calendar
- Format correct (dates, heures, descriptions)
- Ouverture dans nouvelle fenêtre

### ✅ Partage
- Web Share API (mobile)
- Fallback copie dans le presse-papiers (desktop)
- Feedback visuel "Copié !"

### ✅ Recherche et filtres
- Recherche par ville (temps réel)
- Filtrage par sport
- Tri par note

### ✅ Statistiques
- Calculs automatiques (semaine/mois/année)
- Périodes personnalisées (admin)
- Tendances avec indicateurs visuels

---

## 🚀 Performance

### ✅ Optimisations
- Images optimisées (Next.js Image)
- Lazy loading
- Code splitting
- Dynamic imports si nécessaire

### ✅ État
- Gestion d'état locale (useState)
- Context API pour l'authentification
- Requêtes Supabase optimisées

---

## 📝 Notes importantes

### ⚠️ Avant le déploiement

1. **Variables d'environnement à configurer sur Vercel :**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL de production)

2. **Configuration Supabase :**
   - Exécuter tous les scripts SQL dans `supabase/`
   - Configurer les URLs de redirection OAuth
   - Configurer les templates d'email Resend
   - Vérifier les politiques RLS

3. **Configuration Google OAuth :**
   - URLs de redirection autorisées
   - Domaine autorisé

4. **Tests recommandés :**
   - Flux complet client (inscription → recherche → réservation)
   - Flux coach (onboarding → disponibilités → voir réservations)
   - Flux admin (création club → invitation coach → voir statistiques)
   - Responsive sur différents appareils
   - Vérification des emails (confirmation, invitations)

---

## ✅ Checklist de déploiement

- [x] Code compilé sans erreurs
- [x] Linter sans erreurs critiques
- [x] Toutes les routes fonctionnelles
- [x] Authentification complète
- [x] Base de données configurée
- [x] RLS policies configurées
- [x] Storage configuré
- [x] Emails configurés
- [x] Design responsive
- [x] Gestion d'erreurs
- [x] Toast notifications
- [x] Export Google Calendar
- [x] Partage fonctionnel
- [x] Statistiques calculées
- [ ] Variables d'environnement configurées (Vercel)
- [ ] URLs de redirection configurées (Supabase)
- [ ] Templates d'email configurés (Resend)
- [ ] Tests finaux en production

---

**Dernière mise à jour :** Décembre 2024  
**Version de l'application :** 1.0.0


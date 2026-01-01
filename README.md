# 🎾 Sport Planity - Premium Sports Booking Platform

Une plateforme de réservation de coachs sportifs haut de gamme, construite avec Next.js 14, offrant une expérience native iOS pour réserver des cours de tennis, padel et équitation.

## ✨ Fonctionnalités Principales

### 🎯 Pour les Clients
- ✅ **Recherche de clubs** par ville avec résultats en temps réel
- ✅ **Réservation intelligente** - Les créneaux réservés disparaissent automatiquement
- ✅ **Mes cours** - Voir tous vos cours à venir et passés
- ✅ **Export calendrier** - Ajoutez vos cours à Google Calendar en un clic
- ✅ **Annulation** - Annulez vos réservations facilement
- ✅ **Profil utilisateur** - Gérez vos informations personnelles

### 🎾 Pour les Coachs
- ✅ **Planning visuel** - Vue hebdomadaire avec créneaux disponibles/réservés
- ✅ **Éditeur de disponibilités** - Créez votre semaine type en quelques clics
- ✅ **Gestion des réservations** - Voir tous vos élèves et leurs horaires
- ✅ **Export calendrier** - Synchronisez avec Google Calendar
- ✅ **Statistiques** - Nombre de cours, revenus, note moyenne

### 🏢 Pour les Admins
- ✅ **Dashboard complet** - Vue d'ensemble du club
- ✅ **Gestion d'équipe** - Liste détaillée de tous les coachs
- ✅ **Invitations** - Envoyez des invitations par email aux nouveaux coachs
- ✅ **Statistiques** - Revenus, réservations, notes

### 📱 UX Mobile Premium
- ✅ **Bottom Navigation** - Navigation adaptative selon le rôle (comme Airbnb)
- ✅ **Bottom Drawers** - Modales natives avec Vaul
- ✅ **Animations fluides** - Framer Motion partout
- ✅ **Glassmorphism** - Effets de verre modernes
- ✅ **Active States** - Feedback tactile sur tous les boutons

## 🚀 Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **State Management**: Zustand (avec persistance LocalStorage)
- **Mobile UX**: Vaul (Bottom Drawers)
- **Date Handling**: date-fns (locale française)
- **Icons**: Lucide React

## 🏃 Démarrage Rapide

1. **Installer les dépendances**:
```bash
npm install
```

2. **Lancer le serveur de développement**:
```bash
npm run dev
```

3. **Ouvrir votre navigateur**:
Naviguez vers [http://localhost:3000](http://localhost:3000)

## 🎭 Mode Démo

Sur la page d'accueil, connectez-vous en tant que:

- **👤 Sophie (Cliente)**: Recherchez et réservez des cours
- **🎾 Mathis (Coach)**: Gérez votre planning et vos élèves
- **🏢 Pierre (Admin)**: Administrez votre club

## 📱 Pages & Routes

### Client
- `/` - Page d'accueil avec recherche
- `/club/[id]` - Profil du club avec liste des coachs
- `/my-bookings` - Mes cours (à venir et passés)
- `/account` - Mon compte

### Coach
- `/coach` - Dashboard avec planning hebdomadaire
- `/coach/schedule` - Éditeur de disponibilités (semaine type)
- `/account` - Mon compte

### Admin
- `/admin` - Dashboard du club
- `/admin/team` - Gestion de l'équipe
- `/account` - Mon compte

## 🎨 Principes de Design

### Mobile-First
- Tous les éléments sont accessibles au pouce
- Minimum 48px pour les zones tactiles
- Navigation en bas de l'écran

### Style iOS Natif
- `rounded-3xl` pour les cards (style Apple)
- `active:scale-95` sur tous les boutons
- Transitions fluides (300ms)
- Glassmorphism avec backdrop-blur

### Typographie
- Font: Inter (clean, moderne)
- Headlines: Bold, concises
- Body: Regular, lisible

## 📦 Structure du Projet

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── my-bookings/          # Mes cours (client)
│   ├── account/              # Profil utilisateur
│   ├── club/[id]/            # Page club
│   ├── coach/
│   │   ├── page.tsx          # Dashboard coach
│   │   └── schedule/         # Éditeur de planning
│   └── admin/
│       ├── page.tsx          # Dashboard admin
│       └── team/             # Gestion équipe
├── components/
│   ├── ui/                   # Shadcn UI components
│   ├── bottom-nav.tsx        # Navigation adaptative
│   ├── coach-card.tsx        # Card coach
│   └── booking-drawer.tsx    # Flux de réservation
├── lib/
│   ├── utils.ts              # Utilitaires
│   ├── store.ts              # Zustand store
│   └── mock-data.ts          # Données réalistes
└── types/
    └── index.ts              # Définitions TypeScript
```

## 🎯 Fonctionnalités Détaillées

### Système de Réservation
1. **Sélection du coach** - Parcourez les coachs avec photos et spécialités
2. **Choix de la date** - Calendrier horizontal (7 jours)
3. **Sélection de l'heure** - Grille de créneaux colorés
4. **Confirmation** - Résumé avec prix total
5. **Paiement** - Simulation Apple Pay
6. **Succès** - Animation de confirmation

### Gestion des Disponibilités (Coach)
- Interface visuelle pour créer sa semaine type
- Sélection/désélection de créneaux par jour
- Actions rapides (tout sélectionner/désélectionner)
- Résumé hebdomadaire avec total d'heures

### Export Google Calendar
- Génère un lien Google Calendar avec:
  - Titre du cours
  - Date et heure (durée: 1h)
  - Lieu (adresse du club)
  - Description

## 🔧 Développement

### Mock Data
- 6 coachs avec photos réelles (Unsplash)
- 3 clubs avec détails complets
- Bios réalistes en français
- Reviews authentiques

### State Management
- Zustand pour l'état global
- Persistance dans LocalStorage
- Pas de backend (MVP)

### Responsive
- Mobile: Navigation en bas
- Tablet: Layout adaptatif
- Desktop: Centré avec max-width

## 🚀 Prochaines Étapes

- [ ] Backend API (Node.js/Supabase)
- [ ] Authentification réelle (OAuth)
- [ ] Paiement Stripe
- [ ] Notifications push
- [ ] Chat coach/client
- [ ] Système de reviews
- [ ] Multi-sport avancé

## 📝 License

MIT


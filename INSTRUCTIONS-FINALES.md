# 🚀 INSTRUCTIONS FINALES

## 📋 ÉTAPE 1 : METTRE À JOUR LE SCHÉMA

Dans **Supabase Dashboard > SQL Editor**, copie/colle et exécute :

**`supabase/update_schema.sql`**

Ce script ajoute les colonnes nécessaires pour le nouveau système d'onboarding.

---

## 📋 ÉTAPE 2 : TESTER LE NOUVEL ONBOARDING

### Créer un Admin (Propriétaire de club)

1. Va sur `http://localhost:3000`
2. Crée un nouveau compte (inscription)
3. Dans l'onboarding, choisis **"J'inscris mon Club"**
4. Remplis les infos :
   - Prénom/Nom
   - Nom du club, Adresse, Ville
   - Équipements (Wifi, Parking, etc.)
   - Photo + Description
5. ✅ Un **code à 5 caractères** est généré (ex: "AB123")
6. **Note ce code !** Tu en auras besoin pour les coachs.

### Créer un Coach

1. Déconnecte-toi
2. Crée un nouveau compte
3. Dans l'onboarding, choisis **"Je suis un Coach"**
4. Entre le **code à 5 caractères** de ton club
5. ✅ Tu rejoins le club et arrives sur le dashboard coach

### Créer un Client

1. Déconnecte-toi
2. Crée un nouveau compte
3. Dans l'onboarding, choisis **"Je suis un Élève"**
4. Remplis tes infos
5. ✅ Tu arrives sur l'accueil

---

## ✅ NOUVEAU FLOW D'ONBOARDING

```
┌─────────────────────────────────────┐
│     Bienvenue sur Simpl.           │
│     Qui êtes-vous ?                │
├─────────────────────────────────────┤
│  [👤 Je suis un Élève]             │
│  [🏋️ Je suis un Coach]             │
│  [🏢 J'inscris mon Club]           │
└─────────────────────────────────────┘
         │         │         │
         ▼         ▼         ▼
      CLIENT    COACH     ADMIN
       Flow     Flow      Flow
```

### Flow CLIENT
1. Prénom / Nom
2. Sport favori
3. Source de découverte
4. ✅ Succès → Accueil

### Flow COACH
1. Entrer le code club (5 caractères)
2. Confirmer le club
3. ✅ Succès → Dashboard Coach

### Flow ADMIN
1. Prénom / Nom
2. Infos club (nom, siret, adresse)
3. Équipements (badges)
4. Photo + Description
5. ✅ Succès → Code généré → Dashboard Admin

---

## 🎉 FONCTIONNALITÉS

| Fonctionnalité | Statut |
|----------------|--------|
| Choix du rôle au départ | ✅ |
| Flow Client complet | ✅ |
| Flow Coach avec code | ✅ |
| Flow Admin avec création club | ✅ |
| Génération code 5 caractères | ✅ |
| Badges équipements | ✅ |
| Upload photo club | ✅ |

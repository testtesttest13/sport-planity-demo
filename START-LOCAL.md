# 🚀 Lancer en Local - Instructions Rapides

## ✅ Votre Setup est Prêt !

- ✅ `.env.local` existe
- ✅ `node_modules` installé
- ✅ SQL exécuté dans Supabase

---

## 🎯 COMMANDES À EXÉCUTER

### 1. Lancer le serveur

```bash
npm run dev
```

### 2. Ouvrir dans le navigateur

👉 **http://localhost:3000**

---

## 🧪 FLOW DE TEST COMPLET

### 1. Créer un compte
- Allez sur http://localhost:3000/login
- Mode "Créer un compte"
- Email : `test@example.com`
- Mot de passe : `Test123!`
- Cliquez "Créer un compte"

### 2. Valider l'email
- Vérifiez votre boîte mail
- Cliquez sur le lien de confirmation Supabase
- Redirection automatique vers `/onboarding`

### 3. Onboarding (6 étapes)
1. **Prénom + Nom** → Continuer
2. **Téléphone** (facultatif) → Continuer ou Passer
3. **Photo** (facultatif) → Continuer ou Passer
4. **Sport favori** (obligatoire) → Choisir Tennis/Padel/Yoga/Boxe/Fitness
5. **Source** (obligatoire) → Choisir Google/Amis/Pub/Autre
6. **Success** → Redirection vers `/account`

### 4. Vérifier le profil
- Vérifiez que toutes les infos s'affichent :
  - Nom ✅
  - Email ✅
  - Téléphone ✅
  - Sport favori ✅
  - Source de découverte ✅

### 5. Tester la page d'accueil
- Menu du bas → "Rechercher"
- Voir les 6 clubs depuis Supabase
- Tester le filtre par catégorie

### 6. Modifier le profil
- `/account` → "Modifier"
- Changer nom, téléphone, photo, mot de passe
- Sauvegarder

---

## ⚡ COMMANDE RAPIDE

```bash
npm run dev
```

Puis ouvrez : **http://localhost:3000**

🎉 **C'est tout !**


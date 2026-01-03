# 🚀 Lancer l'Application en Local

## ⚡ Setup Rapide

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la **racine du projet** avec ce contenu :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ivzvjwqvqvunkiyyyrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODM4MTYsImV4cCI6MjA4Mjg1OTgxNn0.Iw7dvSXO2I-oARDAKE-BzcOaATH-MKnY_K7NkWiMOEE

# Resend (optionnel pour les invitations)
RESEND_API_KEY=re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry

# App URL (localhost pour développement local)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT** : Le fichier `.env.local` est dans `.gitignore`, donc il ne sera pas commité (c'est normal et sécurisé).

---

### 2. Installer les dépendances (si pas déjà fait)

```bash
npm install
```

---

### 3. Lancer le serveur de développement

```bash
npm run dev
```

---

### 4. Ouvrir dans le navigateur

Une fois lancé, vous verrez :

```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - ready in Xs
```

👉 **Ouvrez** : http://localhost:3000

---

## 🧪 Tester les Features

### 1. Créer un Compte

1. Allez sur http://localhost:3000/login
2. Cliquez sur **"Créer un compte"** (ou changez le mode)
3. Entrez :
   - Email : `votre@email.com`
   - Mot de passe : `VotreMotDePasse123`
4. Cliquez **"Créer un compte"**

### 2. Valider l'Email

1. Allez sur votre boîte email
2. Cherchez l'email de confirmation Supabase
3. Cliquez sur le lien de confirmation
4. Vous serez redirigé vers `/onboarding`

### 3. Compléter l'Onboarding (6 étapes)

1. **Étape 1** : Prénom + Nom
2. **Étape 2** : Téléphone (facultatif)
3. **Étape 3** : Photo (facultatif)
4. **Étape 4** : Sélectionner un sport
5. **Étape 5** : Comment vous nous avez connu
6. **Étape 6** : Success → Redirection vers `/account`

### 4. Vérifier le Profil

1. Vous arrivez sur `/account`
2. Vérifiez que toutes vos infos s'affichent :
   - Nom complet ✅
   - Email ✅
   - Téléphone ✅
   - Sport favori ✅
   - Source de découverte ✅

### 5. Tester la Page d'Accueil

1. Cliquez sur **"Rechercher"** dans le menu du bas
2. Vous devriez voir les **6 clubs** depuis Supabase :
   - The Blue Court (Tennis, Paris)
   - Zen Loft (Yoga, Lyon)
   - Power Arena (Fitness, Paris)
   - Golden Padel (Padel, Marseille)
   - Fight Club (Boxe, Bordeaux)
   - Elite Tennis (Tennis, Paris)
3. Testez le filtre par catégorie

### 6. Modifier le Profil

1. Allez dans `/account`
2. Cliquez **"Modifier"** (en haut à droite)
3. Modifiez :
   - Nom complet
   - Téléphone
   - Photo
   - Mot de passe
4. Sauvegardez

---

## ⚠️ Problèmes Courants

### Port 3000 déjà utilisé

Si vous voyez :
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution** : Changez le port
```bash
PORT=3001 npm run dev
```

Puis ouvrez : http://localhost:3001

---

### Variables d'environnement non chargées

Si vous voyez :
```
Error: Your project's URL and Key are required to create a Supabase client!
```

**Solution** :
1. Vérifiez que `.env.local` existe à la **racine** du projet
2. Vérifiez que les clés sont correctes (sans espaces avant/après)
3. **Redémarrez** le serveur (`Ctrl+C` puis `npm run dev`)

---

### Erreur de build TypeScript

Si vous voyez des erreurs TypeScript :

```bash
npm run lint
```

Corrigez les erreurs ou demandez de l'aide.

---

## ✅ Checklist de Test

- [ ] `.env.local` créé avec les bonnes clés
- [ ] `npm install` exécuté sans erreur
- [ ] `npm run dev` lance le serveur
- [ ] http://localhost:3000 s'ouvre
- [ ] Page login s'affiche
- [ ] Création de compte fonctionne
- [ ] Email de confirmation reçu
- [ ] Lien de confirmation redirige vers onboarding
- [ ] Onboarding 6 étapes complet
- [ ] Profil affiche toutes les infos
- [ ] Page d'accueil affiche les 6 clubs
- [ ] Filtre par catégorie fonctionne
- [ ] Édition de profil fonctionne

---

## 🎉 C'est parti !

Une fois que tout fonctionne, vous pouvez tester toutes les features en local ! 🚀


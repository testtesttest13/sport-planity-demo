# 🔗 Configuration des URLs pour Vercel

**Domaine Vercel :** `https://sport-planity-demo-jwbw.vercel.app`

---

## ✅ 1. VERCEL - Variables d'environnement

**Où :** Vercel Dashboard > Settings > Environment Variables

### Variable à configurer/modifier :

**`NEXT_PUBLIC_APP_URL`**
- ❌ **Ancienne valeur :** `http://localhost:3000`
- ✅ **Nouvelle valeur :** `https://sport-planity-demo-jwbw.vercel.app`
- **Environnements :** Production ✅ Preview ✅ Development (optionnel)

**Comment faire :**
1. Allez dans Vercel > Votre projet > Settings > Environment Variables
2. Trouvez `NEXT_PUBLIC_APP_URL`
3. Cliquez sur "Edit"
4. Remplacez par : `https://sport-planity-demo-jwbw.vercel.app`
5. Cochez Production et Preview
6. Save
7. **Redéployez** (Deployments > ... > Redeploy)

---

## ✅ 2. SUPABASE - Site URL et Redirect URLs

**Où :** Supabase Dashboard > Settings > Authentication

### Site URL

**Valeur actuelle :** `http://localhost:3000`  
**Nouvelle valeur :** `https://sport-planity-demo-jwbw.vercel.app`

**Comment faire :**
1. Supabase Dashboard > Settings (⚙️) > Authentication
2. Section "Site URL"
3. Remplacez par : `https://sport-planity-demo-jwbw.vercel.app`
4. Save

### Redirect URLs (Additional)

**Ajoutez :**
```
https://sport-planity-demo-jwbw.vercel.app/**
```

**Comment faire :**
1. Même page (Authentication Settings)
2. Section "Redirect URLs"
3. Cliquez "Add URL"
4. Ajoutez : `https://sport-planity-demo-jwbw.vercel.app/**`
5. Save

**Note :** Le `/**` permet tous les chemins (callback, onboarding, etc.)

---

## ✅ 3. GOOGLE CLOUD CONSOLE - OAuth Redirect URIs

**Où :** Google Cloud Console > APIs & Services > Credentials > Votre OAuth Client

### Authorized JavaScript origins

**Ajoutez :**
```
https://sport-planity-demo-jwbw.vercel.app
```

**Supprimez (si présent) :**
```
❌ http://localhost:3000
```

### Authorized redirect URIs

**Vérifiez que vous avez :**
```
✅ https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback
```

**Ajoutez (optionnel, pour double sécurité) :**
```
✅ https://sport-planity-demo-jwbw.vercel.app/auth/callback
```

**Supprimez (si présent) :**
```
❌ http://localhost:3000/auth/callback
❌ http://localhost:3000/**
❌ Toute URL avec localhost
```

**Comment faire :**
1. https://console.cloud.google.com/
2. Sélectionnez votre projet
3. Menu (☰) > APIs & Services > Credentials
4. Trouvez votre OAuth 2.0 Client ID
5. Cliquez dessus pour éditer
6. Modifiez "Authorized JavaScript origins" et "Authorized redirect URIs"
7. Save

---

## 📋 RÉCAPITULATIF COMPLET

### ✅ Vercel Environment Variables
- [ ] `NEXT_PUBLIC_APP_URL` = `https://sport-planity-demo-jwbw.vercel.app`

### ✅ Supabase Authentication Settings
- [ ] Site URL = `https://sport-planity-demo-jwbw.vercel.app`
- [ ] Redirect URLs = `https://sport-planity-demo-jwbw.vercel.app/**`

### ✅ Google Cloud Console
- [ ] Authorized JavaScript origins = `https://sport-planity-demo-jwbw.vercel.app`
- [ ] Authorized redirect URIs = `https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback`
- [ ] Pas de localhost dans les URIs

---

## 🚀 Après Configuration

### Redéployer sur Vercel

1. Vercel > Deployments
2. Dernier déploiement > "..." (menu)
3. **Redeploy**
4. Décochez "Use existing Build Cache" (optionnel mais recommandé)
5. Redeploy

### Tests à effectuer

#### Test 1 : Google OAuth
```
1. https://sport-planity-demo-jwbw.vercel.app/login
2. Cliquez "Continuer avec Google"
3. Choisissez votre compte
4. ✅ Redirigé vers Vercel (pas localhost)
5. ✅ Page /onboarding s'affiche
```

#### Test 2 : Email Confirmation
```
1. Créez un compte avec email
2. Vérifiez l'email
3. Cliquez sur le lien de confirmation
4. ✅ Redirigé vers https://sport-planity-demo-jwbw.vercel.app (pas localhost)
```

#### Test 3 : Invitation Coach
```
1. Admin envoie invitation coach
2. Coach clique sur le lien d'invitation
3. ✅ Redirigé vers Vercel
```

---

## ⚠️ IMPORTANT

**Tous ces changements sont nécessaires** pour que :
- ✅ Les redirections OAuth fonctionnent
- ✅ Les confirmations d'email redirigent vers Vercel
- ✅ Les invitations fonctionnent
- ✅ Aucune redirection vers localhost

**Ordre recommandé :**
1. Vercel (Environment Variables)
2. Supabase (Site URL + Redirect URLs)
3. Google Cloud Console (OAuth URIs)
4. Redéployer sur Vercel
5. Tester

---

## 🔍 Vérification

### Dans le code

Le code utilise automatiquement :
- `window.location.origin` pour les redirections OAuth (fonctionne automatiquement)
- `process.env.NEXT_PUBLIC_APP_URL` pour les invitations (doit être configuré dans Vercel)
- Supabase Site URL pour les confirmations d'email (doit être configuré dans Supabase)

**Aucune modification de code nécessaire** - tout est géré par les variables d'environnement et configurations !

---

**Dernière mise à jour :** Décembre 2024


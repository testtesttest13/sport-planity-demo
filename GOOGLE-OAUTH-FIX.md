# 🔧 Activer Google OAuth dans Supabase

## ❌ Erreur Actuelle

```
"Unsupported provider: missing OAuth secret"
```

**Cause** : Google OAuth n'est **pas encore activé** dans votre projet Supabase.

---

## ✅ SOLUTION (10 minutes)

### PARTIE 1 : Créer les Credentials Google

#### Étape 1 : Google Cloud Console

1. Allez sur : https://console.cloud.google.com/
2. **Créez un projet** ou sélectionnez-en un existant
3. Dans le menu hamburger (☰), allez dans **"APIs & Services"** > **"Credentials"**

#### Étape 2 : Créer OAuth Client ID

1. Cliquez sur **"Create Credentials"** (en haut)
2. Sélectionnez **"OAuth 2.0 Client ID"**
3. Si demandé, configurez l'écran de consentement OAuth :
   - Type : **"External"**
   - Nom : **"Sport Planity"**
   - Email support : Votre email
   - Logo : Optionnel
   - Cliquez **"Save and Continue"** jusqu'à la fin

#### Étape 3 : Configurer le Client ID

1. **Application type** : Web application
2. **Name** : Sport Planity Auth
3. **Authorized redirect URIs** - Cliquez "Add URI" et ajoutez :
   ```
   https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback
   ```
4. **Cliquez** "Create"
5. **Copiez** :
   - Client ID (ressemble à : `123456789-abc.apps.googleusercontent.com`)
   - Client Secret (ressemble à : `GOCSPX-abcdef123456`)

---

### PARTIE 2 : Activer dans Supabase

#### Étape 1 : Aller dans Supabase

1. https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub
2. Cliquez sur **"Authentication"** (menu gauche)
3. Cliquez sur **"Providers"**

#### Étape 2 : Configurer Google

1. Trouvez **"Google"** dans la liste
2. **Activez** le toggle (Enable)
3. **Collez** :
   - Client ID (depuis Google Cloud Console)
   - Client Secret (depuis Google Cloud Console)
4. **Authorized Client IDs** : Laissez vide (optionnel)
5. **Skip nonce check** : Laissez décoché
6. **Cliquez** "Save"

---

## 🔗 FIX REDIRECT URL

### Mettre à jour dans Vercel

Variable : **NEXT_PUBLIC_APP_URL**

**Valeur actuelle** : `http://localhost:3000`
**Nouvelle valeur** : `https://sport-planity-demo-jwbw.vercel.app`

**Comment faire** :
1. Vercel > Settings > Environment Variables
2. Trouvez `NEXT_PUBLIC_APP_URL`
3. Edit
4. Changez en : `https://sport-planity-demo-jwbw.vercel.app`
5. Save
6. Redéployez

---

## ✅ Après Configuration

### Test Google OAuth
1. Allez sur https://sport-planity-demo-jwbw.vercel.app/login
2. Cliquez "Continuer avec Google"
3. Choisissez votre compte
4. ✅ Connecté !

### Test Email Confirmation
1. Créez un compte avec email
2. Vérifiez l'email
3. Cliquez sur le lien
4. ✅ Redirigé vers votre app Vercel (pas localhost)

---

## 📋 RÉCAP RAPIDE

**Problème 1** : Google OAuth pas configuré
**Solution** : Activer dans Supabase + Ajouter Google credentials

**Problème 2** : Redirects vers localhost
**Solution** : Changer `NEXT_PUBLIC_APP_URL` en Vercel

**Temps** : ~10 minutes

---

## 🎯 ORDRE DES ACTIONS

1. ✅ Créer Google OAuth credentials (Google Cloud Console)
2. ✅ Activer Google dans Supabase (avec Client ID/Secret)
3. ✅ Changer `NEXT_PUBLIC_APP_URL` dans Vercel
4. ✅ Redéployer
5. ✅ Tester !

**Suivez dans l'ordre et ça marchera ! 🚀**


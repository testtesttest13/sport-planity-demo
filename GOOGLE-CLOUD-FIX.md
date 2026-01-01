# 🔧 Configurer Google Cloud Console

## 🚨 Problème

Google OAuth redirige vers `localhost` au lieu de Vercel.

**Cause** : Les **Authorized redirect URIs** dans Google Cloud Console pointent vers localhost.

---

## ✅ SOLUTION (3 minutes)

### Étape 1 : Ouvrir Google Cloud Console

1. https://console.cloud.google.com/
2. Sélectionnez votre projet
3. Menu (☰) > **"APIs & Services"** > **"Credentials"**

### Étape 2 : Modifier votre OAuth Client

1. Trouvez votre OAuth 2.0 Client ID :
   ```
   218192046380-d8302a4j9t7fgcat891da619r7745ka7.apps.googleusercontent.com
   ```

2. **Cliquez dessus** pour l'éditer

### Étape 3 : Authorized redirect URIs

Dans la section **"Authorized redirect URIs"** :

#### Vérifiez que vous avez :
```
✅ https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback
```

#### Ajoutez AUSSI (si pas déjà là) :
```
✅ https://sport-planity-demo-jwbw.vercel.app/auth/callback
```

#### SUPPRIMEZ (si présent) :
```
❌ http://localhost:3000/auth/callback
❌ http://localhost:3000/**
❌ Toute URL avec localhost
```

### Étape 4 : Authorized JavaScript origins

Dans la section **"Authorized JavaScript origins"** :

#### Ajoutez :
```
✅ https://sport-planity-demo-jwbw.vercel.app
```

#### SUPPRIMEZ :
```
❌ http://localhost:3000
```

### Étape 5 : Save

Cliquez **"Save"** en bas.

---

## 📋 Configuration Finale Google Cloud

Votre OAuth Client devrait avoir :

### Authorized JavaScript origins
```
✅ https://sport-planity-demo-jwbw.vercel.app
```

### Authorized redirect URIs
```
✅ https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback
✅ https://sport-planity-demo-jwbw.vercel.app/auth/callback (optionnel)
```

---

## 🧪 TEST IMMÉDIAT

Après avoir sauvegardé dans Google Cloud Console :

```
1. Allez sur https://sport-planity-demo-jwbw.vercel.app/login
2. Cliquez "S'inscrire avec Google"
3. Choisissez votre compte
4. ✅ Redirigé vers Vercel (pas localhost)
5. ✅ Page /onboarding s'affiche
```

**Effet immédiat, pas besoin de redéployer !**

---

## 🎯 Checklist Complète

### Dans Supabase
- [x] Site URL = `https://sport-planity-demo-jwbw.vercel.app` ✅
- [x] Redirect URLs = `https://sport-planity-demo-jwbw.vercel.app/**` ✅
- [x] Google OAuth enabled ✅

### Dans Google Cloud Console
- [ ] ⚠️ Authorized redirect URIs contient Supabase callback
- [ ] ⚠️ Authorized JavaScript origins contient Vercel domain
- [ ] ⚠️ Pas de localhost dans les URIs

### Dans Vercel
- [x] NEXT_PUBLIC_APP_URL = Vercel domain ✅
- [x] NEXT_PUBLIC_SUPABASE_ANON_KEY = JWT token ✅

---

## 💡 Pourquoi ça redirige vers localhost ?

Google OAuth utilise les **Authorized redirect URIs** configurées dans Google Cloud Console.

Si vous avez `http://localhost:3000/auth/callback` dans la liste, Google peut choisir celle-là au lieu de Vercel.

**Solution** : Supprimez TOUTES les URLs localhost de Google Cloud Console !

---

## 🚀 Après Configuration

Google OAuth va :
1. ✅ Rediriger vers Supabase callback
2. ✅ Supabase redirige vers votre Site URL (Vercel)
3. ✅ Votre app redirige vers /onboarding
4. ✅ Tout marche !

**Allez dans Google Cloud Console et supprimez localhost ! 🚫**


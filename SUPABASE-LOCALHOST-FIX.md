# 🔧 FIX : Redirection Email vers Localhost

## ❌ Le Problème

Quand vous cliquez sur le lien de confirmation d'email Supabase, vous êtes redirigé vers Vercel au lieu de localhost.

---

## ✅ SOLUTION : Configurer Supabase pour Localhost

### Étape 1 : Aller dans Supabase Dashboard

**URL** : https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

### Étape 2 : Authentication Settings

1. Cliquez sur **"Authentication"** (menu gauche)
2. Cliquez sur **"URL Configuration"** (ou allez dans Settings > Authentication)

### Étape 3 : Configurer Site URL

**Site URL** :
```
http://localhost:3000
```

⚠️ **Changez temporairement pour le développement local**

### Étape 4 : Configurer Redirect URLs

Dans **"Redirect URLs"**, ajoutez ces URLs (une par ligne) :

```
http://localhost:3000
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/onboarding
https://sport-planity-demo-jwbw.vercel.app
https://sport-planity-demo-jwbw.vercel.app/**
https://sport-planity-demo-jwbw.vercel.app/auth/callback
```

⚠️ **Important** : Gardez les URLs Vercel aussi pour quand vous pusherez !

### Étape 5 : Sauvegarder

Cliquez sur **"Save"**

---

## 🔄 Workflow Recommandé

### Pour Développement Local

1. **Site URL** dans Supabase : `http://localhost:3000`
2. **Redirect URLs** : Inclure localhost ET Vercel
3. Travailler en local
4. Tester les emails de confirmation

### Avant de Push vers Vercel

1. **Site URL** dans Supabase : `https://sport-planity-demo-jwbw.vercel.app`
2. **Redirect URLs** : Garder localhost ET Vercel (comme ci-dessus)
3. Push vers GitHub
4. Vercel déploiera automatiquement

---

## 📝 Configuration Code

Le code dans `app/login/page.tsx` utilise déjà `NEXT_PUBLIC_APP_URL` qui est `http://localhost:3000` en local, donc pas besoin de modifier le code !

Le problème vient uniquement de la configuration Supabase Dashboard.

---

## ✅ Après Configuration

1. Créez un nouveau compte
2. Vérifiez votre email
3. Cliquez sur le lien de confirmation
4. Vous serez redirigé vers `http://localhost:3000/onboarding` ✅

---

**C'est juste une config Supabase à changer, le code est déjà bon !** 🎯


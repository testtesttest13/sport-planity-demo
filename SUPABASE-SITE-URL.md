# 🚨 URGENT : Configurer Site URL dans Supabase

## ❌ PROBLÈME

Quand vous cliquez sur "S'inscrire avec Google", ça vous ramène sur **localhost** au lieu de **Vercel**.

**Cause** : Dans Supabase, la "Site URL" est configurée sur `http://localhost:3000`

---

## ✅ SOLUTION (2 minutes)

### Étape 1 : Aller dans Supabase

https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

### Étape 2 : Configuration > URL Configuration

1. Cliquez sur **"Settings"** (⚙️ en bas à gauche)
2. Cliquez sur **"Authentication"** (pas "API" !)
3. Scrollez jusqu'à **"Site URL"**

### Étape 3 : Changer la Site URL

**Valeur actuelle** : `http://localhost:3000`

**Nouvelle valeur** : 
```
https://sport-planity-demo-jwbw.vercel.app
```

### Étape 4 : Redirect URLs

Dans la même page, section **"Redirect URLs"**, ajoutez :

```
https://sport-planity-demo-jwbw.vercel.app/**
```

Le `/**` permet tous les chemins (callback, onboarding, etc.)

### Étape 5 : Save

Cliquez sur **"Save"** en bas de la page.

---

## ✅ APRÈS CETTE MODIFICATION

### Test Google OAuth
```
1. Allez sur https://sport-planity-demo-jwbw.vercel.app/login
2. Cliquez "S'inscrire avec Google"
3. Choisissez votre compte
4. ✅ Redirigé vers https://sport-planity-demo-jwbw.vercel.app/auth/callback
5. ✅ Puis vers /onboarding
```

### Test Email Confirmation
```
1. Créez un compte avec email
2. Vérifiez l'email
3. Cliquez sur le lien
4. ✅ Redirigé vers https://sport-planity-demo-jwbw.vercel.app (pas localhost)
```

---

## 📋 RÉCAP : Configuration Supabase

### Dans Authentication Settings

**Site URL** :
```
https://sport-planity-demo-jwbw.vercel.app
```

**Redirect URLs** (Additional) :
```
https://sport-planity-demo-jwbw.vercel.app/**
```

**OAuth Providers > Google** :
- ✅ Enabled
- ✅ Client ID configuré
- ✅ Client Secret configuré

---

## 🎯 C'EST ÇA LE PROBLÈME !

Supabase redirige vers la "Site URL" configurée.

Si elle est sur `localhost`, ça redirige vers localhost.

**Changez-la en Vercel et ça marchera ! 🚀**

---

## ⏱️ Timeline

1. **Maintenant** : Changez Site URL dans Supabase (2 min)
2. **Testez** : Google OAuth immédiatement
3. **✅ Ça marche !**

Pas besoin de redéployer Vercel, c'est juste une config Supabase !


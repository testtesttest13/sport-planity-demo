# ✅ FIX : Redirections Localhost vs Vercel

## 🎯 Problème Résolu

Le code utilisait des URLs Vercel **hardcodées** au lieu d'utiliser automatiquement l'URL actuelle (localhost en dev, Vercel en prod).

---

## ✅ Modifications Effectuées

### 1. `app/login/page.tsx`

**Avant** :
```typescript
redirectTo: 'https://sport-planity-demo-jwbw.vercel.app/auth/callback'
emailRedirectTo: 'https://sport-planity-demo-jwbw.vercel.app/onboarding'
```

**Après** :
```typescript
redirectTo: `${window.location.origin}/auth/callback`
emailRedirectTo: `${window.location.origin}/onboarding`
```

✅ **Utilise automatiquement** :
- `http://localhost:3000` en développement local
- `https://sport-planity-demo-jwbw.vercel.app` en production sur Vercel

### 2. `lib/constants.ts`

**Avant** :
```typescript
export const APP_URL = 'https://sport-planity-demo-jwbw.vercel.app'
```

**Après** :
```typescript
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
```

✅ **Utilise la variable d'environnement** `NEXT_PUBLIC_APP_URL` qui vaut :
- `http://localhost:3000` en local (défini dans `.env.local`)
- `https://sport-planity-demo-jwbw.vercel.app` en production (défini dans Vercel)

---

## 🎉 Résultat

### En Développement Local

- ✅ Création de compte → Email de confirmation → Redirige vers `http://localhost:3000/onboarding`
- ✅ Google OAuth → Redirige vers `http://localhost:3000/auth/callback`
- ✅ Toutes les redirections utilisent localhost automatiquement

### En Production (Vercel)

- ✅ Création de compte → Email de confirmation → Redirige vers `https://sport-planity-demo-jwbw.vercel.app/onboarding`
- ✅ Google OAuth → Redirige vers `https://sport-planity-demo-jwbw.vercel.app/auth/callback`
- ✅ Toutes les redirections utilisent Vercel automatiquement

---

## 🔄 Configuration Supabase (Optionnel)

Pour que les emails de confirmation fonctionnent correctement, vous pouvez configurer Supabase pour accepter les deux URLs :

### Dans Supabase Dashboard > Authentication > URL Configuration

**Site URL** : `http://localhost:3000` (pour le dev local)

**Redirect URLs** (ajoutez les deux) :
```
http://localhost:3000/**
https://sport-planity-demo-jwbw.vercel.app/**
```

Le `/**` permet tous les chemins sous ces domaines.

---

## ✅ Plus Besoin de Changer le Code !

Maintenant le code s'adapte automatiquement :
- ✅ **En local** → Utilise `http://localhost:3000`
- ✅ **Sur Vercel** → Utilise l'URL Vercel automatiquement
- ✅ **Pas besoin de modifier le code** avant de pusher !

Vous pouvez travailler en local et pusher vers Vercel sans rien changer ! 🎉


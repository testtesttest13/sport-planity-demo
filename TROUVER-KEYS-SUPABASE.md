# 🔑 TROUVER VOS VRAIES CLÉS SUPABASE

## ❌ VOS CLÉS ACTUELLES SONT FAUSSES

```
sb_secret_nG6DgF9jLciWvY5ESG7brw_Kk_j70w_
sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
```

❌ **Ce format n'est PAS correct pour Supabase !**

Les vraies clés Supabase sont des **JWT tokens** qui commencent par `eyJ...`

---

## ✅ COMMENT TROUVER LES BONNES CLÉS

### 📍 Étape 1 : Aller sur le Dashboard

**URL** : https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

### 📍 Étape 2 : Cliquer sur "Settings"

En bas du menu de gauche, l'icône **engrenage** ⚙️

### 📍 Étape 3 : Cliquer sur "API"

Dans le menu Settings, section **"API"**

### 📍 Étape 4 : Copier les clés

Vous verrez 2 sections :

#### Section "Configuration"
```
Project URL: https://ivzvjwqvqvunkiyyyrub.supabase.co
```
✅ **Copiez cette URL**

#### Section "Project API keys"

Il y a 2 clés :

**1. anon (public)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.XXXXXXXXXXXX
```
✅ **Copiez celle-ci** (cliquez sur "Reveal" puis "Copy")

**2. service_role (secret)**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjc4MTUwOCwiZXhwIjoyMDUyMzU3NTA4fQ.XXXXXXXXXXXX
```
❌ **NE PAS utiliser** (trop de permissions)

---

## 🔧 METTRE À JOUR DANS VERCEL

### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://ivzvjwqvqvunkiyyyrub.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (la VRAIE clé JWT)
Environments: ✅ Production ✅ Preview ✅ Development
```
⚠️ **Remplacez `sb_publishable_...` par le JWT `eyJ...`**

### Variable 3 : RESEND_API_KEY
```
Key: RESEND_API_KEY
Value: re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
Environments: ✅ Production ✅ Preview ✅ Development
```
✅ **Celle-ci est déjà bonne**

### Variable 4 : NEXT_PUBLIC_APP_URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://votre-app.vercel.app (votre URL Vercel)
Environments: ✅ Production ✅ Preview
```

---

## 📋 RÉSUMÉ : DANS VERCEL

Allez dans **Settings > Environment Variables** et modifiez :

**À MODIFIER** :
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
REMPLACER: sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
PAR: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... (depuis Supabase)
```

**À GARDER** :
```
NEXT_PUBLIC_SUPABASE_URL ✅ (déjà bon)
RESEND_API_KEY ✅ (déjà bon)
NEXT_PUBLIC_APP_URL ✅ (déjà bon)
```

---

## 🎯 Après avoir changé la clé

1. Save dans Vercel
2. Redéployez (sans cache)
3. **Ça marchera ! 🎉**

---

## 💡 Note

Les clés au format `sb_publishable_...` et `sb_secret_...` ne sont **pas** des clés Supabase standard.

Les vraies clés sont des **JWT tokens** qui commencent par `eyJ...`

**Allez chercher la clé "anon" dans Supabase Dashboard > Settings > API !**


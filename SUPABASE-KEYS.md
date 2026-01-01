# 🔑 RÉCUPÉRER VOS VRAIES CLÉS SUPABASE

## 🚨 PROBLÈME ACTUEL

La clé `sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9` n'est **PAS** une clé Supabase valide !

Les vraies clés Supabase sont des **JWT tokens** qui commencent par `eyJ...`

---

## ✅ COMMENT RÉCUPÉRER LES BONNES CLÉS

### Étape 1 : Allez sur votre Dashboard Supabase

URL : https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

### Étape 2 : Cliquez sur "Settings" (icône engrenage)

Dans le menu de gauche, tout en bas.

### Étape 3 : Cliquez sur "API"

Vous verrez une page avec plusieurs clés.

### Étape 4 : Copiez les 2 clés

#### 1️⃣ Project URL
```
Section: "Config"
Label: "URL"
Format: https://ivzvjwqvqvunkiyyyrub.supabase.co
```
✅ **Celle-ci est correcte !**

#### 2️⃣ anon public (Clé Publique)
```
Section: "Project API keys"
Label: "anon" ou "public"
Format: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```
❌ **C'est celle-ci qui est FAUSSE dans Vercel !**

---

## 📋 LES 2 CLÉS À COPIER

Sur la page Supabase Dashboard > Settings > API :

### URL (Project URL)
```
https://ivzvjwqvqvunkiyyyrub.supabase.co
```
✅ Correct

### anon key (Project API keys > anon > public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```
⚠️ **Copiez cette clé depuis Supabase !**

Elle devrait ressembler à ça (très longue) :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 🔄 METTRE À JOUR DANS VERCEL

### 1. Allez dans Vercel

Vercel Dashboard > Votre Projet > Settings > Environment Variables

### 2. Modifiez `NEXT_PUBLIC_SUPABASE_ANON_KEY`

1. Cliquez sur la variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Cliquez sur "Edit"
3. **Remplacez** la valeur par la VRAIE clé `eyJ...` (de Supabase)
4. Save

### 3. Redéployez

1. Allez dans Deployments
2. Cliquez "Redeploy"
3. Décochez "Use existing Build Cache"
4. Redeploy

---

## 📸 Screenshot de ce que vous devez voir dans Supabase

Dans Supabase Dashboard > Settings > API :

```
Project API keys
├── anon (public) ← COPIEZ CELLE-CI
│   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
│   [Reveal] [Copy]
│
└── service_role (secret) ← NE PAS UTILISER (secret)
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz...
    [Reveal] [Copy]
```

**Copiez celle marquée "anon" ou "public" !**

---

## ⚠️ ATTENTION

### NE PAS utiliser :
- ❌ `sb_publishable_...` (ce n'est pas une clé anon)
- ❌ `service_role` key (trop de permissions, dangereux)

### Utiliser :
- ✅ `anon` key (commence par `eyJ...`)
- ✅ C'est une clé publique (safe)
- ✅ Elle a les permissions RLS uniquement

---

## 🎯 Résumé Simple

**Problème** : Mauvaise clé dans Vercel  
**Solution** : Récupérez la vraie clé `anon` depuis Supabase  
**Où** : Supabase Dashboard > Settings > API  
**Format** : `eyJhbGc...` (très long JWT)  
**Action** : Mettez à jour dans Vercel et redéployez  

**Ça marchera directement après ! 🚀**


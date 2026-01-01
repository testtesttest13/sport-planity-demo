# 🚨 URGENT : Variables d'Environnement Manquantes

## ❌ Le Problème

Vercel ne trouve PAS les variables Supabase car **vous ne les avez pas ajoutées dans Vercel Dashboard** !

```
Error: Your project's URL and Key are required to create a Supabase client!
```

---

## ✅ LA SOLUTION (5 minutes)

### Étape 1 : Allez dans Vercel Dashboard

1. **Ouvrez** : https://vercel.com/dashboard
2. **Sélectionnez** votre projet `sport-planity-demo`
3. **Cliquez** sur **"Settings"** (en haut)
4. **Cliquez** sur **"Environment Variables"** (menu gauche)

### Étape 2 : Ajoutez les 4 Variables

Cliquez sur **"Add New"** pour chaque variable :

#### Variable 1
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ivzvjwqvqvunkiyyyrub.supabase.co
Environment: Production, Preview, Development (cochez tout)
```

#### Variable 2
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
Environment: Production, Preview, Development (cochez tout)
```

#### Variable 3
```
Name: RESEND_API_KEY
Value: re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
Environment: Production, Preview, Development (cochez tout)
```

#### Variable 4
```
Name: NEXT_PUBLIC_APP_URL
Value: http://localhost:3000
Environment: Development

(Puis ajoutez une autre pour Production avec votre URL Vercel)
```

### Étape 3 : Sauvegarder

Cliquez **"Save"** pour chaque variable.

### Étape 4 : Redéployer

1. **Allez** dans l'onglet **"Deployments"**
2. **Trouvez** le dernier déploiement (celui qui a échoué)
3. **Cliquez** sur les 3 points **"..."**
4. **Cliquez** "Redeploy"
5. **NE COCHEZ PAS** "Use existing Build Cache"
6. **Cliquez** "Redeploy"

---

## 🎯 Pourquoi ça ne marche pas ?

Next.js essaie de **prerender** les pages au moment du build.

Pour prerender, il a besoin des variables d'environnement.

**MAIS** vous ne les avez pas ajoutées dans Vercel !

Donc : **Build échoue** ❌

---

## ✅ Après avoir ajouté les variables

Le build réussira et vous verrez :

```
✓ Generating static pages (14/14)
✓ Build succeeded
```

---

## 📸 Screenshot des Variables dans Vercel

Vous devriez voir 4 lignes comme ça :

```
NEXT_PUBLIC_SUPABASE_URL        https://ivzvjw...    Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY   eyJhbGciOiJ...      Production, Preview, Development  
RESEND_API_KEY                  re_4YRpR5Uj...      Production, Preview, Development
NEXT_PUBLIC_APP_URL             http://local...     Development (+ une pour Production)
```

---

## 🚀 Résumé Simple

**Problème** : Variables pas dans Vercel  
**Solution** : Ajoutez les 4 variables  
**Résultat** : Build réussira  
**Temps** : 5 minutes  

**Action immédiate** : Allez dans Vercel > Settings > Environment Variables !

---

## 📋 Checklist

- [ ] ⚠️ Aller dans Vercel Dashboard
- [ ] ⚠️ Settings > Environment Variables
- [ ] ⚠️ Ajouter NEXT_PUBLIC_SUPABASE_URL
- [ ] ⚠️ Ajouter NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] ⚠️ Ajouter RESEND_API_KEY
- [ ] ⚠️ Ajouter NEXT_PUBLIC_APP_URL
- [ ] ⚠️ Sauvegarder tout
- [ ] ⚠️ Redéployer (sans cache)

**SANS CES VARIABLES, L'APP NE PEUT PAS BUILDER !**


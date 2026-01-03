# 🔧 FIX : Erreur "Invalid API key" sur Localhost

## ❌ Le Problème

L'erreur "Invalid API key" signifie que les clés Supabase dans `.env.local` sont incorrectes ou mal formatées.

---

## ✅ SOLUTION

### Étape 1 : Ouvrir `.env.local`

Ouvrez le fichier `.env.local` à la racine du projet.

### Étape 2 : Vérifier/Corriger le Contenu

Le fichier doit contenir **EXACTEMENT** ceci (sans espaces avant/après) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ivzvjwqvqvunkiyyyrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODM4MTYsImV4cCI6MjA4Mjg1OTgxNn0.Iw7dvSXO2I-oARDAKE-BzcOaATH-MKnY_K7NkWiMOEE
RESEND_API_KEY=re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ⚠️ VÉRIFICATIONS IMPORTANTES

1. **Pas d'espaces** avant ou après les `=`
2. **Pas de guillemets** autour des valeurs
3. **Pas de lignes vides** entre les variables
4. La clé `NEXT_PUBLIC_SUPABASE_ANON_KEY` doit commencer par `eyJ` (JWT token)
5. **Pas de commentaires** sur les mêmes lignes que les variables

### ❌ MAUVAIS FORMAT (à éviter)

```env
# ❌ AVEC ESPACES
NEXT_PUBLIC_SUPABASE_URL = https://ivzvjwqvqvunkiyyyrub.supabase.co

# ❌ AVEC GUILLEMETS
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# ❌ CLÉ INCORRECTE (ne commence pas par eyJ)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
```

### ✅ BON FORMAT

```env
NEXT_PUBLIC_SUPABASE_URL=https://ivzvjwqvqvunkiyyyrub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODM4MTYsImV4cCI6MjA4Mjg1OTgxNn0.Iw7dvSXO2I-oARDAKE-BzcOaATH-MKnY_K7NkWiMOEE
```

---

## 🔍 Si les Clés Ne Fonctionnent Pas

### Option 1 : Vérifier dans Supabase Dashboard

1. Allez sur : https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub
2. **Settings** (⚙️) → **API**
3. Section **"Project API keys"**
4. Cliquez sur **"Reveal"** pour la clé **"anon public"**
5. **Copiez** la clé complète (commence par `eyJ...`)
6. Remplacez dans `.env.local`

### Option 2 : Recréer le Fichier

1. **Supprimez** `.env.local`
2. **Créez** un nouveau fichier `.env.local`
3. **Copiez-collez** exactement le contenu ci-dessus
4. **Sauvegardez**

---

## 🔄 Après Modification

### 1. Arrêter le Serveur

Dans le terminal où `npm run dev` tourne :
- Appuyez sur `Ctrl+C` (ou `Cmd+C` sur Mac)

### 2. Redémarrer

```bash
npm run dev
```

### 3. Tester

- Allez sur http://localhost:3000/login
- L'erreur "Invalid API key" devrait avoir disparu

---

## ✅ Checklist

- [ ] `.env.local` contient exactement les 4 variables
- [ ] Pas d'espaces avant/après les `=`
- [ ] Pas de guillemets autour des valeurs
- [ ] La clé `NEXT_PUBLIC_SUPABASE_ANON_KEY` commence par `eyJ`
- [ ] Le serveur a été redémarré après modification
- [ ] L'erreur "Invalid API key" a disparu

---

**Après avoir corrigé, redémarrez le serveur !** 🔄


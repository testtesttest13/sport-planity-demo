# 🚀 VERCEL - Instructions Finales

## ✅ CE QUI A ÉTÉ PUSHÉ

**Dernier commit** : `85e6e25`

**Contient** :
- ✅ Supabase client/server exports corrects
- ✅ Resend API configuré (`re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry`)
- ✅ Invitations réelles avec vrais emails
- ✅ Google OAuth ready
- ✅ Demo accounts auto-création
- ✅ 0 erreurs de linting
- ✅ Build warnings corrigés

---

## 🎯 OÙ TESTER ?

### ✅ **SUR VERCEL (Recommandé)**

**URL** : Votre domaine Vercel (ex: `sport-planity-demo.vercel.app`)

**Pourquoi sur Vercel ?**
- ✅ Google OAuth **fonctionnera**
- ✅ Resend **enverra les emails**
- ✅ Variables d'env **configurées**
- ✅ Test **réel** de la production
- ✅ Accessible de partout

### ⚠️ **SUR LOCALHOST (Développement uniquement)**

**URL** : `http://localhost:3000`

**Limitations** :
- ❌ Google OAuth ne marchera pas (redirect vers Vercel)
- ❌ Il faut créer `.env.local` manuellement
- ✅ Demo accounts marchent
- ✅ Développement rapide

**➡️ CONCLUSION : TESTEZ SUR VERCEL !**

---

## 📋 Checklist Vercel

### Étape 1 : Vérifier le Déploiement

Dans **Vercel Dashboard > Deployments** :
- [ ] Status = "Ready" ✅
- [ ] Commit = `85e6e25` ou plus récent
- [ ] Build = Success
- [ ] No errors

### Étape 2 : Vérifier les Variables

Dans **Settings > Environment Variables** :
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ✅
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- [ ] `RESEND_API_KEY` = `re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry` ✅
- [ ] `NEXT_PUBLIC_APP_URL` = Votre URL Vercel ✅

### Étape 3 : Exécuter le SQL Setup

**IMPORTANT** : Si pas encore fait !

1. https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub
2. SQL Editor > New Query
3. Copiez **`supabase/reset-and-setup.sql`**
4. Run
5. Attendez "Success! 🎉"

### Étape 4 : Tester !

Allez sur votre URL Vercel et testez tout :
- [ ] Redirect automatique vers /login
- [ ] Bouton Google OAuth visible
- [ ] 3 Demo accounts visibles
- [ ] Formulaire Email/Password visible

---

## 🧪 Tests à Effectuer

### ✅ Test 1 : Google OAuth
```
Temps : 30 secondes
Résultat attendu : Connecté via Google
```

### ✅ Test 2 : Création de Compte
```
Temps : 2 minutes (avec confirmation email)
Résultat : Compte créé, email reçu, connexion OK
```

### ✅ Test 3 : Demo Account
```
Temps : 10 secondes
Résultat : Connecté instantanément
```

### ✅ Test 4 : Invitation Coach + Email
```
Temps : 1 minute
Résultat : Email reçu sur juless13001@gmail.com
Contenu : Bouton "Accepter l'invitation"
```

### ✅ Test 5 : Réservation
```
Temps : 30 secondes
Résultat : Cours réservé, visible dans "Mes cours"
```

---

## 📧 Email d'Invitation - Détails

**De** : `onboarding@resend.dev`  
**À** : Email du coach invité  
**Sujet** : "Invitation à rejoindre [Club Name]"  

**Contient** :
- Header gradient violet/rose
- Message personnalisé avec nom du club
- Bouton CTA "Accepter l'invitation"
- Info expiration (7 jours)
- Footer avec copyright

**Lien** : `https://votre-app.vercel.app/invite/accept?token=...`

---

## 🔧 En Cas de Problème

### Build échoue sur Vercel
➡️ Vérifiez que les 4 env vars sont bien ajoutées
➡️ Cliquez "Redeploy" sans cache

### Google OAuth ne marche pas
➡️ Activez Google dans Supabase > Authentication > Providers
➡️ Ajoutez redirect URI de Vercel

### Emails ne partent pas
➡️ Vérifiez `RESEND_API_KEY` dans Vercel
➡️ Testez avec `juless13001@gmail.com`

### Redirect loops
➡️ Vérifiez que le SQL setup a été exécuté
➡️ Vérifiez la table `profiles` existe

---

## ✨ Résumé

**Pushé** : Commit `85e6e25`  
**Statut** : Prêt pour production  
**Tests** : Sur Vercel uniquement  
**Email** : Resend configuré  
**Google** : OAuth ready  

**Vercel va redéployer automatiquement dans ~2 minutes** ⏱️

---

## 🎯 Action Immédiate

1. ✅ Code pushé (commit 85e6e25)
2. ⏳ Attendez fin du déploiement Vercel
3. ✅ Allez sur votre URL Vercel
4. ✅ Testez tout !

**Tout est prêt ! 🎉**


# ⚡ Setup Rapide - Sport Planity sur Vercel

## 🎯 Ce qui a été fait

✅ **Code pushé sur GitHub**  
✅ **Clé Resend configurée** : `re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry`  
✅ **Auto-redirect vers login** (si pas connecté)  
✅ **Demo switcher** toujours dispo (en bas à droite)  

---

## 🚀 Étapes pour Déployer sur Vercel

### 1. Ajouter les Variables d'Environnement dans Vercel

Allez dans : **Settings > Environment Variables**

#### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
```
https://ivzvjwqvqvunkiyyyrub.supabase.co
```

#### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
```

#### Variable 3 : RESEND_API_KEY
```
re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
```

#### Variable 4 : NEXT_PUBLIC_APP_URL
```
https://votre-app.vercel.app
```
(Vous devrez revenir mettre la vraie URL après le premier déploiement)

---

### 2. Redéployer sur Vercel

Une fois les variables ajoutées, Vercel va rebuild automatiquement.

Ou cliquez sur **"Redeploy"** dans le dashboard.

---

## ✅ Flow de Connexion

### Pour les Nouveaux Utilisateurs :
1. Arrive sur l'app → **Redirect automatique vers /login**
2. Options de connexion :
   - **Google OAuth** (bouton bleu)
   - **Créer un compte** (email/password)
   - **Demo accounts** (3 boutons en bas)

### Demo Switcher (toujours dispo) :
- Flotte en **bas à droite** sur toutes les pages
- Cliquez pour changer de rôle :
  - 👤 Sophie (Cliente)
  - 🎾 Mathis (Coach)
  - 🏢 Pierre (Admin)

---

## 📧 Emails d'Invitation (Resend)

### Status : ✅ CONFIGURÉ

Quand un Admin invite un coach :
1. Email envoyé automatiquement
2. De : `onboarding@resend.dev` (pour l'instant)
3. À : L'email du coach invité
4. Contient : Lien d'invitation avec token

### Pour Personnaliser (Plus tard) :
1. Vérifiez votre domaine sur https://resend.com
2. Changez le "from" dans `app/api/invite/route.ts` :
   ```typescript
   from: 'Sport Planity <noreply@votre-domaine.com>'
   ```

---

## 🧪 Tester en Production

### 1. Créer un Vrai Compte
```
1. Allez sur votre-app.vercel.app
2. Cliquez "Créer un compte"
3. Entrez email/password
4. Vérifiez l'email de confirmation de Supabase
5. Cliquez sur le lien de confirmation
6. Retournez vous connecter
```

### 2. Tester Google OAuth
```
1. Cliquez "Continuer avec Google"
2. Choisissez votre compte Google
3. Acceptez les permissions
4. Vous êtes connecté !
```

### 3. Tester Demo Accounts
```
1. Cliquez sur "Sophie (Cliente)" en bas de /login
2. Premier clic → Création du compte demo
3. Deuxième clic → Connexion automatique
```

### 4. Tester Invitation Coach
```
1. Connectez-vous en Admin (Pierre)
2. Allez dans Dashboard > Inviter
3. Entrez un email (ex: juless13001@gmail.com)
4. Envoyez
5. Vérifiez l'email reçu !
```

---

## ⚠️ IMPORTANT : Exécuter le SQL Setup

Si pas encore fait, dans Supabase :

1. https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub
2. SQL Editor > New Query
3. Copiez **TOUT** `supabase/reset-and-setup.sql`
4. Run

Sans ça, la base de données n'existe pas !

---

## 🎉 C'est Prêt !

Votre app est maintenant :
- ✅ Déployée sur Vercel
- ✅ Auth Google + Email fonctionnelle
- ✅ Emails Resend configurés
- ✅ Demo accounts dispos
- ✅ Auto-redirect vers login

**Testez tout et profitez ! 🚀**

---

## 📚 Docs Complètes

- `VERCEL-DEPLOY.md` - Guide complet déploiement
- `SUPABASE-SETUP.md` - Guide Supabase détaillé
- `NEXT-STEPS.md` - Prochaines étapes

---

**Bon lancement ! 🎾**


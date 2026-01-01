# ✅ CONFIGURATION FINALE VERCEL

## 🎯 Votre Domaine
```
https://sport-planity-demo-jwbw.vercel.app
```

---

## 🔧 VARIABLES À METTRE/VÉRIFIER DANS VERCEL

Allez dans : **Vercel > Settings > Environment Variables**

### Variable 1 : NEXT_PUBLIC_SUPABASE_URL
```
https://ivzvjwqvqvunkiyyyrub.supabase.co
```
✅ Déjà configurée

### Variable 2 : NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODM4MTYsImV4cCI6MjA4Mjg1OTgxNn0.Iw7dvSXO2I-oARDAKE-BzcOaATH-MKnY_K7NkWiMOEE
```
✅ Déjà configurée

### Variable 3 : RESEND_API_KEY
```
re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
```
✅ Déjà configurée

### Variable 4 : NEXT_PUBLIC_APP_URL ⚠️ À CHANGER
```
❌ ENLEVER: http://localhost:3000
✅ METTRE: https://sport-planity-demo-jwbw.vercel.app
```

**Comment faire** :
1. Cliquez sur `NEXT_PUBLIC_APP_URL`
2. Edit
3. Remplacez par : `https://sport-planity-demo-jwbw.vercel.app`
4. Cochez : Production ✅ Preview ✅
5. Save

---

## ✅ GOOGLE OAUTH CONFIGURÉ

Vous avez déjà :
- ✅ Client ID et Secret configurés dans Supabase
- ✅ Redirect URI : `https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback`
- ✅ Activé dans Supabase Authentication > Providers

---

## 🔄 REDÉPLOYER

Après avoir changé `NEXT_PUBLIC_APP_URL` :

1. Allez dans **Deployments**
2. Dernier déploiement > **"..."**
3. **Redeploy**
4. Décochez "Use existing Build Cache"
5. Redeploy

---

## 🧪 TESTS APRÈS REDÉPLOIEMENT

### Test 1 : Google OAuth
```
1. https://sport-planity-demo-jwbw.vercel.app/login
2. Cliquez "Continuer avec Google"
3. Choisissez votre compte
4. ✅ Connecté et redirigé vers l'app !
```

### Test 2 : Email Confirmation
```
1. Créez un compte avec email
2. Vérifiez l'email
3. Cliquez sur le lien
4. ✅ Redirigé vers https://sport-planity-demo-jwbw.vercel.app (pas localhost)
```

### Test 3 : Demo Accounts
```
1. Cliquez "Sophie (Cliente)"
2. ✅ Fonctionne déjà
```

### Test 4 : Invitation Coach
```
1. Connectez en Admin (Pierre)
2. Invitez : juless13001@gmail.com
3. ✅ Email envoyé avec lien vers Vercel (pas localhost)
```

---

## ✅ TOUT EST PRÊT !

**Il ne reste plus qu'à** :
1. Changer `NEXT_PUBLIC_APP_URL` dans Vercel
2. Redéployer
3. Tester !

**Dans 5 minutes, tout marchera ! 🎉**


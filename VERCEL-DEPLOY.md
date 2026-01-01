# 🚀 Déploiement sur Vercel

## ✅ Variables d'Environnement à Ajouter

Allez dans : **Vercel Dashboard > Votre Projet > Settings > Environment Variables**

Ajoutez ces 4 variables :

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://ivzvjwqvqvunkiyyyrub.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2enZqd3F2cXZ1bmtpeXl5cnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3ODE1MDgsImV4cCI6MjA1MjM1NzUwOH0.sb_publishable_3xSuQMe7ENKyXx2F-km6Ug_2ktL65d9
```

### 3. RESEND_API_KEY
```
re_4YRpR5Uj_DsKSpdUsz4ggxJLUfbVwxHry
```

### 4. NEXT_PUBLIC_APP_URL
```
https://votre-app.vercel.app
```
(Remplacez par votre vraie URL Vercel après le premier déploiement)

---

## 🔐 Configurer Google OAuth pour Production

### Dans Supabase :
1. Allez dans **Authentication > Providers > Google**
2. Ajoutez l'URL de callback de production :
   ```
   https://ivzvjwqvqvunkiyyyrub.supabase.co/auth/v1/callback
   ```

### Dans Google Cloud Console :
1. Allez dans vos credentials OAuth
2. Ajoutez l'URL autorisée :
   ```
   https://votre-app.vercel.app
   ```
3. Ajoutez l'URL de callback :
   ```
   https://votre-app.vercel.app/auth/callback
   ```

---

## 📧 Configurer Resend pour Production

### Vérifier votre domaine :
1. Allez sur https://resend.com/domains
2. Ajoutez votre domaine
3. Configurez les DNS records
4. Attendez la vérification

### Modifier l'email "from" :
Une fois le domaine vérifié, dans `app/api/invite/route.ts` :
```typescript
from: 'Sport Planity <noreply@votre-domaine.com>'
```

**Pour l'instant**, Resend fonctionne avec `onboarding@resend.dev` en mode test.

---

## ✅ Checklist de Déploiement

- [ ] SQL setup exécuté dans Supabase
- [ ] 4 variables d'environnement ajoutées dans Vercel
- [ ] Code pushé sur GitHub
- [ ] Vercel build réussi
- [ ] Tester : Google login
- [ ] Tester : Demo accounts
- [ ] Tester : Création de compte email
- [ ] Tester : Invitation coach (email envoyé)

---

## 🎯 Après le Premier Déploiement

1. **Récupérez votre URL Vercel** (ex: `sport-planity-demo.vercel.app`)

2. **Mettez à jour `NEXT_PUBLIC_APP_URL`** dans Vercel

3. **Testez tout** :
   - Page de login
   - Création de compte
   - Google OAuth
   - Demo accounts
   - Invitations

---

## 🐛 Troubleshooting

### Build échoue
- Vérifiez les linter errors : `npm run lint`
- Vérifiez le build local : `npm run build`

### Google OAuth ne marche pas
- Vérifiez les URLs de callback dans Google Cloud Console
- Vérifiez que Google est activé dans Supabase

### Emails ne partent pas
- Vérifiez la clé Resend dans Vercel
- Vérifiez les logs de l'API route : `/api/invite`

---

## 📊 Flow de Connexion en Production

```
1. User arrive sur /
   ↓
2. Pas authentifié → Redirect vers /login
   ↓
3. Options :
   - Google OAuth ✅
   - Email/Password ✅
   - Demo accounts ✅ (en bas de page)
   ↓
4. Après login → Redirect selon rôle
   - Client → /
   - Coach → /coach
   - Admin → /admin
```

---

## ✨ C'est fait !

Votre app est maintenant en production avec :
- ✅ Auth réelle (Google + Email)
- ✅ Base de données Supabase
- ✅ Emails d'invitation (Resend)
- ✅ Demo accounts pour tester

**Bonne chance ! 🚀**


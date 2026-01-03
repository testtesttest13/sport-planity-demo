# 🔧 Variables d'Environnement Vercel - Configuration Requise

**⚠️ IMPORTANT : Ces variables DOIVENT être configurées sur Vercel pour que l'application fonctionne !**

---

## 📍 Où configurer

1. Allez sur **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. Ajoutez toutes les variables ci-dessous

---

## 🔑 Variables Obligatoires

### 1. **Supabase**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-jwt-token
```

**Comment les trouver :**
- Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
- Sélectionnez votre projet
- **Settings** → **API**
- Copiez :
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon/public key** (le token JWT complet qui commence par `eyJ...`) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ Important :**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` doit être le token JWT COMPLET (commence par `eyJ...`)
- Ne pas utiliser la "publishable key" qui commence par `sb_publishable_...`
- Doit être le JWT complet de plusieurs centaines de caractères

### 2. **Resend (Pour les emails)**

```bash
RESEND_API_KEY=re_votre-api-key
```

**Comment l'obtenir :**
- Allez sur [Resend Dashboard](https://resend.com/api-keys)
- Créez ou copiez votre API Key

### 3. **URL de l'application**

```bash
NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
```

**Valeur :**
- Pour Vercel : `https://votre-projet.vercel.app`
- Remplacez `votre-projet` par le nom de votre projet Vercel

---

## 🎯 Configuration par Environnement

### Production
- Configurez toutes les variables pour l'environnement **Production**
- Cochez aussi **Preview** si vous voulez les utiliser dans les preview deployments

### Preview
- Vous pouvez utiliser les mêmes valeurs que Production
- Ou créer des variables spécifiques pour les previews

---

## ✅ Vérification

Après avoir ajouté les variables :

1. **Redeployez** votre application sur Vercel
2. Ou attendez le prochain commit (Vercel redéploie automatiquement)
3. Vérifiez que l'erreur "Your project's URL and Key are required" a disparu

---

## 🐛 Erreur courante

Si vous voyez toujours l'erreur après configuration :

1. ✅ Vérifiez que les noms des variables sont EXACTEMENT comme ci-dessus (sensible à la casse)
2. ✅ Vérifiez que `NEXT_PUBLIC_SUPABASE_ANON_KEY` est le JWT complet (commence par `eyJ...`)
3. ✅ Vérifiez que l'environnement est bien **Production** (ou **Preview** si applicable)
4. ✅ **Redeployez** manuellement depuis Vercel Dashboard

---

## 📝 Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurée
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurée (JWT complet)
- [ ] `RESEND_API_KEY` configurée
- [ ] `NEXT_PUBLIC_APP_URL` configurée
- [ ] Environnement sélectionné (Production)
- [ ] Application redéployée

---

**Une fois toutes ces variables configurées, l'application fonctionnera correctement ! 🚀**


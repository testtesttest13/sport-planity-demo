# 🔧 Fix Détaillé Erreur PKCE OAuth Google

## ❌ Problème

L'erreur `PKCE code verifier not found in storage` se produit quand on essaie de se connecter avec Google, même avec un compte existant.

## 🔍 Analyse

Le code utilise déjà `@supabase/ssr` correctement :
- ✅ `createBrowserClient` côté client (`lib/supabase/client.ts`)
- ✅ `createServerClient` côté serveur (`lib/supabase/server.ts`, `app/auth/callback/route.ts`)

Le problème peut venir de :

1. **Cookies bloqués par le navigateur** (très probable sur mobile)
2. **Domaine différent** entre l'initiation et le callback
3. **Version de `@supabase/ssr`** qui a des bugs connus

## ✅ Solutions à Tester

### Solution 1 : Vérifier les cookies dans le navigateur

1. Ouvrez les DevTools (F12)
2. Allez dans Application > Cookies
3. Vérifiez qu'il y a des cookies `sb-*-auth-token` et `sb-*-code-verifier`
4. Si pas de cookies, c'est que le navigateur les bloque

### Solution 2 : Tester sur le même domaine

Le problème peut venir du fait que l'utilisateur :
- Initie le flow sur `sport-planity-demo-jwbw.vercel.app`
- Mais complète sur un autre domaine (localhost, autre sous-domaine, etc.)

**Solution** : S'assurer que tout se passe sur le même domaine.

### Solution 3 : Mettre à jour @supabase/ssr

Vérifiez la version installée :
```bash
npm list @supabase/ssr
```

Si version < 0.1.0, mettre à jour :
```bash
npm install @supabase/ssr@latest
```

### Solution 4 : Vérifier la configuration Supabase

Dans Supabase Dashboard > Authentication > URL Configuration :

- **Site URL** doit être : `https://sport-planity-demo-jwbw.vercel.app`
- **Redirect URLs** doit contenir : `https://sport-planity-demo-jwbw.vercel.app/**`

### Solution 5 : Nettoyer les cookies et localStorage

Parfois, des données corrompues causent le problème :

```javascript
// Dans la console du navigateur
localStorage.clear()
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
})
```

## 🔄 Workaround Temporaire

Si le problème persiste, on peut essayer d'utiliser `signInWithPassword` pour les comptes Google existants, mais ce n'est pas idéal car ça nécessite que l'utilisateur ait un mot de passe.

## 📚 Documentation

- [Supabase SSR Auth Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [PKCE Flow](https://supabase.com/docs/guides/auth/auth-pkce-flow)
- [OAuth Troubleshooting](https://supabase.com/docs/guides/auth/social-login/auth-google)

## ⚠️ Note

Le code actuel est correct. Le problème est probablement lié à :
- La configuration du navigateur (cookies bloqués)
- Un problème de domaine/redirection
- Un bug dans une version spécifique de `@supabase/ssr`


# 🔧 Fix Erreur PKCE OAuth Google

## ❌ Erreur Actuelle

```
PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.
```

## 🔍 Cause

Le problème vient du fait que `createBrowserClient` de `@supabase/ssr` stocke le code verifier PKCE dans localStorage par défaut, mais lors du callback serveur, il ne peut pas accéder à localStorage.

## ✅ Solution

Pour Next.js avec `@supabase/ssr`, le code verifier **devrait** être stocké automatiquement dans les cookies, mais il semble y avoir un problème.

### Vérifications à faire :

1. **Vérifier que vous utilisez bien `@supabase/ssr`** :
   - Le package `@supabase/ssr` doit être installé
   - `createBrowserClient` doit venir de `@supabase/ssr` (pas `@supabase/supabase-js`)

2. **Vérifier que le callback route handler lit bien les cookies** :
   - Le callback utilise `createServerClient` avec `cookies()` de Next.js
   - Les cookies doivent être lus correctement

3. **Solution temporaire : Utiliser le flow OAuth standard (non-PKCE)** :
   - Cependant, PKCE est recommandé pour la sécurité

## 🔄 Workaround Temporaire

Si le problème persiste, vous pouvez :

1. **Nettoyer les cookies et localStorage** avant de tester
2. **Utiliser le même navigateur/device** pour initier et compléter le flow
3. **Vérifier les logs Vercel** pour voir exactement quelle erreur se produit

## 📚 Documentation Supabase

- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [PKCE Flow](https://supabase.com/docs/guides/auth/auth-pkce-flow)

## ⚠️ Note

Le code actuel utilise déjà `@supabase/ssr` correctement. Le problème peut venir de :
- Cookies bloqués côté client
- Session expirée entre l'initiation et le callback
- Différents domaines (localhost vs Vercel)

**Solution recommandée** : S'assurer que l'utilisateur initie et complète le flow sur le même domaine (pas de changement entre localhost et Vercel pendant le flow).


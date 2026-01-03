# 📋 Instructions pour créer les comptes démo

## Étape 1 : Créer les comptes via l'interface de l'app

Les comptes démo doivent être créés via l'interface d'inscription de l'application ou via Supabase Auth Dashboard.

### Option A : Via l'application
1. Allez sur `/login`
2. Utilisez le formulaire d'inscription pour créer chaque compte avec :
   - **Client** : `demo.client@sportplanity.com` / `Demo123!`
   - **Coach** : `demo.coach@sportplanity.com` / `Demo123!`
   - **Admin** : `demo.admin@sportplanity.com` / `Demo123!`

### Option B : Via Supabase Dashboard
1. Allez sur https://supabase.com/dashboard
2. Votre projet → Authentication → Users
3. Cliquez sur "Add user" → "Create new user"
4. Créez les 3 comptes avec les emails ci-dessus

---

## Étape 2 : Exécuter le script SQL

Une fois les comptes créés, exécutez `supabase/create-demo-accounts.sql` dans Supabase SQL Editor.

Ce script va :
- ✅ Mettre à jour les profils (role, club_id, full_name)
- ✅ Créer l'entrée coach pour Mathis
- ✅ Afficher les IDs des comptes

---

## Étape 3 : Récupérer les IDs

Pour obtenir les IDs des comptes, exécutez cette requête dans Supabase SQL Editor :

```sql
SELECT 
  email,
  id,
  role,
  full_name,
  club_id
FROM public.profiles 
WHERE email LIKE 'demo.%@sportplanity.com'
ORDER BY email;
```

Les IDs seront affichés dans les résultats.

---

## Notes importantes

- Les IDs sont des UUIDs générés automatiquement par Supabase Auth
- Vous ne pouvez pas prévoir les IDs à l'avance
- Une fois créés, les comptes gardent le même ID
- Le script SQL met à jour les profils et crée les coaches seulement si les comptes existent déjà


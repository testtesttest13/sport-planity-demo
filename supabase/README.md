# 🚀 Supabase Setup - Instructions

## ⚡ Étape 1 : Exécuter le script SQL

### Si c'est votre PREMIÈRE fois :
Utilisez le fichier `setup.sql`

### Si vous avez déjà essayé et eu une erreur :
Utilisez le fichier `reset-and-setup.sql` ✅ **(RECOMMANDÉ)**

---

## 📋 Comment faire :

1. **Ouvrez votre dashboard Supabase** :
   https://supabase.com/dashboard/project/ivzvjwqvqvunkiyyyrub

2. **Cliquez sur "SQL Editor"** dans le menu de gauche

3. **Cliquez sur "New Query"**

4. **Copiez TOUT le contenu** de `reset-and-setup.sql`
   - Ouvrez le fichier dans VS Code
   - Sélectionnez tout (Cmd/Ctrl + A)
   - Copiez (Cmd/Ctrl + C)

5. **Collez dans le SQL Editor** de Supabase
   - Cliquez dans l'éditeur
   - Collez (Cmd/Ctrl + V)

6. **Cliquez sur "Run"** (ou appuyez sur Cmd/Ctrl + Enter)

7. **Attendez le message de succès** :
   ```
   Database setup completed successfully! 🎉
   ```

---

## ✅ Ce qui sera créé

### Tables (7)
- `clubs` - Les clubs de sport
- `profiles` - Profils utilisateurs
- `coaches` - Données des coachs
- `coach_availability` - Planning hebdomadaire
- `bookings` - Réservations
- `invitations` - Invitations en attente
- `reviews` - Avis clients

### Sécurité
- Row Level Security (RLS) activée
- Policies pour chaque rôle
- Protection automatique des données

### Automatisations
- Création auto du profil à l'inscription
- Mise à jour auto des timestamps
- Storage pour les avatars

### Données de test
- 1 club démo (Country Club Lyon)

---

## 🔍 Vérifier que ça a marché

Dans Supabase Dashboard :

1. **Allez dans "Table Editor"**
2. Vous devriez voir 7 tables :
   - clubs ✅
   - profiles ✅
   - coaches ✅
   - coach_availability ✅
   - bookings ✅
   - invitations ✅
   - reviews ✅

3. **Cliquez sur `clubs`**
4. Vous devriez voir 1 ligne : "Country Club Lyon"

---

## ❌ En cas d'erreur

### Erreur : "policy already exists"
➡️ Utilisez `reset-and-setup.sql` au lieu de `setup.sql`

### Erreur : "permission denied"
➡️ Vérifiez que vous êtes bien connecté à votre projet Supabase

### Erreur : "syntax error"
➡️ Assurez-vous d'avoir copié **TOUT** le fichier (du début à la fin)

---

## 🎯 Après le setup

Retournez sur votre app :
```
http://localhost:3000/login
```

Testez un compte démo :
- Cliquez sur "Sophie (Cliente)"
- Le compte sera créé automatiquement
- Vous serez connecté !

---

## 📚 Fichiers

- `setup.sql` - Version originale (première installation)
- `reset-and-setup.sql` - Version safe (peut être exécuté plusieurs fois)

**Utilisez `reset-and-setup.sql` si vous avez le moindre doute !**


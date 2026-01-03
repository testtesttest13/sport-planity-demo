# 🎯 CRÉER LE COMPTE MATHIS - SOLUTION RAPIDE

## ❌ PROBLÈME

Le compte `demo.coach@sportplanity.com` n'existe pas dans votre base de données.

## ✅ SOLUTION : 2 OPTIONS

### OPTION 1 : Via l'interface de l'app (LE PLUS SIMPLE)

1. **Ouvrez votre app** : `http://localhost:3000/login`
2. **Cliquez sur le bouton "Se connecter en tant que Coach"**
3. Cela créera automatiquement le compte `demo.coach@sportplanity.com`
4. **Puis réexécutez `FINAL-SETUP.sql`**

### OPTION 2 : Via Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Authentication** → **Users**
3. Cliquez sur **"Add user"** → **"Create new user"**
4. Remplissez :
   - **Email** : `demo.coach@sportplanity.com`
   - **Password** : `Demo123!`
   - **Auto Confirm User** : ✅ (cochez cette case)
5. Cliquez sur **"Create user"**
6. **Puis réexécutez `FINAL-SETUP.sql`**

---

## ✅ APRÈS AVOIR CRÉÉ LE COMPTE

1. Réexécutez **`FINAL-SETUP.sql`**
2. Vous devriez voir :
   - ✅ Clubs créés : 5
   - ✅ Coaches créés : 1
   - ✅ Disponibilités créées : 45

---

## 🧪 TESTER

1. Page d'accueil → Vous devriez voir les 5 clubs
2. Cliquez sur "Tennis Club Elite Paris"
3. Vous devriez voir Mathis comme coach
4. Cliquez sur "Réserver" → Vous devriez voir les créneaux disponibles


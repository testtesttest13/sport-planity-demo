# 🚀 SOLUTION RAPIDE

## 📋 ÉTAPE 1 : DIAGNOSTIC

Exécutez d'abord ce script pour voir ce qui existe :
**`supabase/CHECK-AND-FIX.sql`**

Cela vous dira :
- Combien de clubs existent
- Si le compte Mathis existe
- Si le profil Mathis existe
- Combien de coaches existent

---

## 📋 ÉTAPE 2 : CRÉER LE COMPTE MATHIS

### Option A : Via l'interface de l'app (LE PLUS SIMPLE)
1. Allez sur `http://localhost:3000/login`
2. Cliquez sur le bouton **"Se connecter en tant que Coach"**
3. Cela créera automatiquement le compte `demo.coach@sportplanity.com`
4. **Puis réexécutez `FINAL-SETUP.sql`**

### Option B : Via Supabase Dashboard
1. Allez sur https://supabase.com/dashboard
2. Votre projet → **Authentication** → **Users**
3. Cliquez sur **"Add user"** → **"Create new user"**
4. Email : `demo.coach@sportplanity.com`
5. Password : `Demo123!`
6. Cliquez sur **"Create user"**
7. **Puis réexécutez `FINAL-SETUP.sql`**

---

## 📋 ÉTAPE 3 : RÉEXÉCUTER LE SCRIPT

Une fois le compte créé, réexécutez :
**`supabase/FINAL-SETUP.sql`**

Vous devriez alors voir :
- ✅ Clubs créés : 5
- ✅ Coaches créés : 1
- ✅ Disponibilités créées : 45

---

## 🆘 SI ÇA NE MARCHE TOUJOURS PAS

Exécutez ce script de diagnostic et envoyez-moi les résultats :
```sql
SELECT email, id FROM auth.users WHERE email = 'demo.coach@sportplanity.com';
SELECT email, id, role FROM public.profiles WHERE email = 'demo.coach@sportplanity.com';
SELECT COUNT(*) FROM public.coaches;
```


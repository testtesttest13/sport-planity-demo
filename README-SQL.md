# 🚀 SCRIPT SQL FINAL - INSTRUCTIONS SIMPLES

## 📋 FICHIER À UTILISER

**`supabase/FINAL-SETUP.sql`**

C'est un script SQL pur, sans caractères spéciaux, qui fonctionne à 100%.

---

## ✅ ÉTAPES

1. **Ouvrez Supabase SQL Editor**
   - https://supabase.com/dashboard
   - SQL Editor → New Query

2. **Ouvrez le fichier `supabase/FINAL-SETUP.sql`**
   - Sélectionnez TOUT (Cmd/Ctrl + A)
   - Copiez (Cmd/Ctrl + C)

3. **Collez dans Supabase**
   - Collez dans l'éditeur SQL
   - Cliquez sur **Run**

4. **Vérifiez les résultats**
   - Vous devriez voir 3 résultats :
     - Clubs créés : 5
     - Coaches créés : 1 (si le compte Mathis existe)
     - Disponibilités créées : 45 (si le coach existe)

---

## ⚠️ SI COACHES = 0

Cela signifie que le compte `demo.coach@sportplanity.com` n'existe pas.

**SOLUTION RAPIDE** :
1. Allez sur `http://localhost:3000/login`
2. Cliquez sur **"Se connecter en tant que Coach"**
3. Cela créera le compte automatiquement
4. **Puis réexécutez le script SQL**

---

## ✅ RÉSULTAT ATTENDU

Après exécution :
- ✅ 5 clubs créés
- ✅ 1 coach (Mathis) créé (si le compte existe)
- ✅ 45 disponibilités créées (9 créneaux × 5 jours)

---

## 🧪 TESTER

1. Page d'accueil → Vous devriez voir les 5 clubs
2. Cliquez sur "Tennis Club Elite Paris"
3. Vous devriez voir Mathis comme coach
4. Cliquez sur "Réserver" → Vous devriez voir les créneaux disponibles


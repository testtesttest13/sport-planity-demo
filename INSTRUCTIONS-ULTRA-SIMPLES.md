# 🎯 INSTRUCTIONS ULTRA SIMPLES

## 🔍 ÉTAPE 1 : DIAGNOSTIC

Exécutez ce script dans Supabase SQL Editor :
**`supabase/DIAGNOSTIC-SIMPLE.sql`**

Il vous dira :
- ✅ Combien de clubs existent (devrait être 5)
- ✅ Si le compte Mathis existe (OUI ou NON)
- ✅ Si le profil Mathis existe (OUI ou NON)
- ✅ Combien de coaches existent (devrait être 1 si le compte existe)
- ✅ Combien de disponibilités existent (devrait être 45 si le coach existe)

---

## 🚨 SI LE COMPTE N'EXISTE PAS

Vous verrez : **"NON - Le compte N EXISTE PAS"**

### SOLUTION RAPIDE :

1. **Ouvrez votre app** : `http://localhost:3000/login`
2. **Cliquez sur le bouton "Se connecter en tant que Coach"**
3. Cela créera automatiquement le compte `demo.coach@sportplanity.com`
4. **Puis réexécutez `FINAL-SETUP.sql`**

---

## ✅ SI LE COMPTE EXISTE MAIS PAS DE COACH

Vous verrez : **"OUI - Le compte existe"** mais **"COACHES = 0"**

### SOLUTION :

Réexécutez simplement **`FINAL-SETUP.sql`** - il créera le coach.

---

## 📋 RÉSUMÉ

1. Exécutez `DIAGNOSTIC-SIMPLE.sql` → Regardez les résultats
2. Si "NON - Le compte N EXISTE PAS" → Créez le compte via l'app
3. Réexécutez `FINAL-SETUP.sql`
4. Vérifiez que tout est OK

---

## 🆘 ENVOYEZ-MOI LES RÉSULTATS

Si ça ne marche toujours pas, envoyez-moi les résultats de `DIAGNOSTIC-SIMPLE.sql` et je vous dirai exactement quoi faire.


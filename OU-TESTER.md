# 🧪 Où Tester l'Application ?

## 🎯 Réponse Directe

### Sur VERCEL (Production) ✅ RECOMMANDÉ
**Pourquoi ?**
- ✅ Google OAuth fonctionne (redirect URLs configurés)
- ✅ Resend fonctionne (emails envoyés)
- ✅ Variables d'environnement configurées
- ✅ Accès depuis n'importe où
- ✅ Test réel de la prod

**URL** : Votre URL Vercel (ex: `sport-planity-demo.vercel.app`)

---

### Sur LOCALHOST (Développement) ⚠️ LIMITÉ
**Pourquoi ?**
- ⚠️ Google OAuth ne marchera PAS (redirect vers Vercel)
- ⚠️ Il faut avoir le `.env.local` configuré
- ✅ Développement et tests rapides
- ✅ Demo accounts marchent

**URL** : `http://localhost:3000`

---

## 📋 Checklist de Test

### Étape 1 : Attendez le Nouveau Déploiement
Vercel est en train de redéployer avec le commit `6e1fc3e` (le bon cette fois).

**Comment savoir si c'est prêt ?**
- Allez dans Vercel Dashboard
- Attendez que le statut soit "Ready" ✅
- Commit affiché devrait être : `6e1fc3e` ou `🔄 Force Vercel redeploy`

### Étape 2 : Testez sur Vercel

#### ✅ Test 1 : Création de Compte
```
1. Allez sur votre-app.vercel.app
2. Vous êtes redirigé vers /login
3. Cliquez "Créer un compte" (sous le formulaire)
4. Entrez :
   - Email : test@example.com
   - Password : Test123!
5. Cliquez "Créer un compte"
6. Vous recevrez un email de Supabase
7. Cliquez sur le lien de confirmation
8. Retournez sur l'app et connectez-vous
```

#### ✅ Test 2 : Google OAuth
```
1. Sur /login
2. Cliquez "Continuer avec Google"
3. Choisissez votre compte Google
4. Acceptez les permissions
5. Vous êtes connecté et redirigé !
```

#### ✅ Test 3 : Demo Accounts
```
1. Sur /login, descendez en bas
2. Cliquez sur "Sophie (Cliente)"
3. 1er clic : Création du compte (alerte)
4. Attendez 2 secondes
5. Cliquez à nouveau sur "Sophie (Cliente)"
6. Vous êtes connecté !
```

#### ✅ Test 4 : Invitation Coach (EMAIL RÉEL)
```
1. Connectez-vous en Admin (bouton "Pierre (Admin)")
2. Allez dans Dashboard > Onglet "Inviter un coach"
3. Entrez : juless13001@gmail.com
4. Cliquez "Envoyer l'invitation"
5. ✅ Alerte de succès
6. 📧 Vérifiez votre boîte mail (juless13001@gmail.com)
7. Vous devriez recevoir un email de "onboarding@resend.dev"
8. Cliquez sur "Accepter l'invitation"
9. Créez le compte coach
```

#### ✅ Test 5 : Réservation
```
1. Connecté en Client (Sophie)
2. Cliquez sur un club
3. Choisissez un coach
4. Cliquez "Réserver"
5. Sélectionnez date et heure
6. Confirmez
7. Vérifiez dans "Mes cours" (bottom nav)
```

#### ✅ Test 6 : Planning Coach
```
1. Connecté en Coach (Mathis)
2. Bottom nav > "Disponibilités"
3. Sélectionnez un jour
4. Cliquez sur des créneaux
5. Cliquez "Enregistrer"
6. Retournez au Planning
7. Vos créneaux devraient être mis à jour
```

---

## 🚨 Si Vercel Build Échoue

### Vérifiez les Variables d'Environnement

Dans **Vercel Dashboard > Settings > Environment Variables**, vous devez avoir :

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ RESEND_API_KEY
✅ NEXT_PUBLIC_APP_URL
```

### Forcer un Redéploiement

Si le build montre encore l'ancien commit :
1. Allez dans Vercel Dashboard
2. Onglet "Deployments"
3. Cliquez sur "Redeploy" sur le dernier déploiement
4. Cochez "Use existing Build Cache" = NON
5. Cliquez "Redeploy"

---

## ✅ Commit Actuel à Déployer

```
Commit : 6e1fc3e
Message : 🔄 Force Vercel redeploy with latest fixes
Contient : Tous les fixes Supabase + Resend
```

---

## 🎯 Résumé Simple

| Où ? | Quoi Tester ? | Statut |
|------|---------------|--------|
| **Vercel** | Tout (Google, Resend, Demo) | ✅ RECOMMANDÉ |
| **Localhost** | Demo accounts uniquement | ⚠️ Limité |

**➡️ TESTEZ SUR VERCEL !**

---

## 📧 Pour Recevoir l'Email de Test

**Email de test** : juless13001@gmail.com

L'email viendra de : `onboarding@resend.dev`

**Contenu** :
- Header avec gradient violet
- Message personnalisé
- Bouton "Accepter l'invitation"
- Lien d'invitation avec token

---

## 🚀 Prochaines Actions

1. **Attendez** que Vercel finisse le nouveau déploiement
2. **Vérifiez** que le commit est `6e1fc3e` ou plus récent
3. **Testez** sur votre URL Vercel
4. **Vérifiez** votre email pour l'invitation !

---

**TESTEZ SUR VERCEL PAS SUR LOCALHOST** ✅


# 📅 Instructions - Gestion des Disponibilités

## 🧹 Nettoyer les Disponibilités

Si tu veux tout recommencer à zéro avec tes disponibilités :

1. Va dans **Supabase Dashboard > SQL Editor**
2. Copie/colle le contenu de `supabase/clear-availability.sql`
3. Clique sur **Run**
4. Toutes tes disponibilités seront supprimées

Tu pourras ensuite recréer tes disponibilités depuis `/coach/schedule`

---

## ✅ Fonctionnement des Créneaux

### Format des Horaires
- **En base de données** : `"14:00:00"` (avec secondes)
- **Affichage** : `"14h"` (format utilisateur)
- **Comparaison** : Normalisation automatique (`14:00:00` → `14:00`)

### Réservations Annulées
✅ Quand un coach ou un client annule une réservation :
- Le statut passe à `'cancelled'`
- Le créneau **réapparaît automatiquement** dans les disponibilités
- Le système exclut les réservations annulées avec `.neq('status', 'cancelled')`

### Vérifications Côté Client
✅ Le système vérifie automatiquement :
- Les créneaux disponibles du coach (semaine type)
- Les créneaux déjà réservés (non annulés)
- Les créneaux passés (au moins 1h dans le futur)
- Les conflits avant la réservation finale

---

## 🔍 Dépannage

### Je ne peux pas cliquer sur un créneau (ex: 12h)
**Causes possibles :**
1. Le créneau n'est pas dans tes disponibilités → Vérifie `/coach/schedule`
2. Le créneau est déjà réservé par quelqu'un d'autre
3. Le créneau est dans le passé (si c'est aujourd'hui)

**Solution :**
- Va dans `/coach/schedule`
- Vérifie que le créneau est bien sélectionné (en vert)
- Sauvegarde tes modifications
- Vérifie que le jour de la semaine correspond

### Les créneaux annulés n'apparaissent pas
**Solution :**
- Vérifie que la réservation est bien marquée `status = 'cancelled'` dans Supabase
- Rafraîchis la page (F5)
- Les créneaux annulés réapparaissent automatiquement

---

## 🎯 Test Complet

1. **En tant que Coach :**
   - Va sur `/coach/schedule`
   - Crée tes disponibilités (ex: Lundi 9h-18h)
   - Sauvegarde

2. **En tant que Client :**
   - Va sur un club
   - Clique sur un coach
   - Réserve un créneau (ex: Lundi 10h)
   - Le créneau 10h doit disparaître pour les autres clients

3. **Annulation :**
   - Annule la réservation (coach ou client)
   - Le créneau 10h doit réapparaître immédiatement
   - Un autre client peut le réserver


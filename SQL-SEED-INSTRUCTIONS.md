# 📋 Instructions pour Exécuter le Script SQL

## Étape 1 : Exécuter le Script SQL dans Supabase

1. Ouvrez votre projet Supabase : https://supabase.com/dashboard
2. Allez dans **SQL Editor** (menu de gauche)
3. Cliquez sur **New Query**
4. Copiez-collez le contenu du fichier `supabase/seed-real-data.sql`
5. Cliquez sur **Run** (ou appuyez sur `Cmd/Ctrl + Enter`)

## Ce que le script fait :

✅ **Nettoie** les données existantes (coaches, bookings, reviews, clubs)
✅ **Crée 5 clubs réels** :
   - Tennis Club Elite Paris (tennis)
   - Padel Arena Marseille (padel)
   - Zen Loft Yoga Studio (yoga)
   - Boxing Club Bordeaux (boxe)
   - Fitness Hub Nice (fitness)

✅ **Met à jour le compte démo Mathis** :
   - Le compte `demo.coach@sportplanity.com` devient coach
   - Il est assigné au club de tennis
   - Une entrée coach est créée pour lui

✅ **Affiche les résultats** de vérification

## Important :

- **Les autres clubs n'auront pas de coaches** pour l'instant
- Seul Mathis sera coach dans le club de tennis
- Pour ajouter d'autres coaches, utilisez le système d'invitation admin ou créez-les manuellement

## Après l'exécution :

✅ Vérifiez que les 5 clubs apparaissent dans votre application
✅ Connectez-vous avec le compte `demo.coach@sportplanity.com`
✅ Vérifiez que Mathis apparaît comme coach dans le club de tennis


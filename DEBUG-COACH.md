# 🔍 Debug : Coach Mathis ne s'affiche pas

## Le coach Mathis devrait être dans :
- **Club** : Tennis Club Elite Paris
- **Club ID** : `a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11`

## Vérifications à faire dans Supabase :

### 1. Vérifier que le club existe :
```sql
SELECT id, name, sport FROM public.clubs WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
```

### 2. Vérifier que le profil Mathis existe et est bien configuré :
```sql
SELECT id, email, role, club_id, full_name 
FROM public.profiles 
WHERE email = 'demo.coach@sportplanity.com';
```

### 3. Vérifier que l'entrée coach existe :
```sql
SELECT c.id, c.profile_id, c.club_id, c.speciality, p.full_name, p.email
FROM public.coaches c
JOIN public.profiles p ON c.profile_id = p.id
WHERE p.email = 'demo.coach@sportplanity.com';
```

### 4. Si le coach n'existe pas, l'insérer manuellement :
```sql
-- D'abord, récupérer l'ID du profil Mathis
DO $$
DECLARE
  mathis_profile_id UUID;
BEGIN
  SELECT id INTO mathis_profile_id
  FROM public.profiles
  WHERE email = 'demo.coach@sportplanity.com';
  
  IF mathis_profile_id IS NOT NULL THEN
    INSERT INTO public.coaches (
      profile_id,
      club_id,
      speciality,
      bio,
      hourly_rate,
      rating,
      review_count
    )
    VALUES (
      mathis_profile_id,
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      'Tennis',
      'Ancien joueur professionnel, coach certifié depuis 10 ans. Spécialisé en technique et tactique.',
      65,
      4.9,
      127
    )
    ON CONFLICT (profile_id) DO UPDATE SET
      club_id = EXCLUDED.club_id,
      speciality = EXCLUDED.speciality,
      bio = EXCLUDED.bio;
  END IF;
END $$;
```

### 5. Vérifier tous les coaches par club :
```sql
SELECT c.id, p.full_name, c.club_id, cl.name as club_name
FROM public.coaches c
JOIN public.profiles p ON c.profile_id = p.id
JOIN public.clubs cl ON c.club_id = cl.id
ORDER BY cl.name;
```


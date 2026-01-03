// Niveaux de sport avec indications pour chaque sport

export const sportLevels: Record<string, { label: string; description: string }[]> = {
  tennis: [
    { label: 'Débutant (1-3)', description: 'Premiers pas, apprendre les bases' },
    { label: 'Intermédiaire (4-6)', description: 'Jeux réguliers, bonne maîtrise' },
    { label: 'Avancé (7-8)', description: 'Niveau compétition régional' },
    { label: 'Expert (9-10)', description: 'Niveau compétition national' },
  ],
  padel: [
    { label: 'Débutant (1-3)', description: 'Premiers pas, apprendre les bases' },
    { label: 'Intermédiaire (4-6)', description: 'Jeux réguliers, bonne maîtrise' },
    { label: 'Avancé (7-8)', description: 'Niveau compétition régional' },
    { label: 'Expert (9-10)', description: 'Niveau compétition national' },
  ],
  yoga: [
    { label: 'Débutant (1-3)', description: 'Découverte, postures de base' },
    { label: 'Intermédiaire (4-6)', description: 'Pratique régulière, variété de postures' },
    { label: 'Avancé (7-8)', description: 'Postures complexes, pratique approfondie' },
    { label: 'Expert (9-10)', description: 'Maîtrise totale, enseignement' },
  ],
  boxe: [
    { label: 'Débutant (1-3)', description: 'Apprentissage des bases, enchaînements simples' },
    { label: 'Intermédiaire (4-6)', description: 'Combat léger, bonne technique' },
    { label: 'Avancé (7-8)', description: 'Compétition amateur' },
    { label: 'Expert (9-10)', description: 'Niveau professionnel' },
  ],
  fitness: [
    { label: 'Débutant (1-3)', description: 'Début en salle, apprendre les mouvements' },
    { label: 'Intermédiaire (4-6)', description: 'Pratique régulière, programme structuré' },
    { label: 'Avancé (7-8)', description: 'Performance élevée, objectifs spécifiques' },
    { label: 'Expert (9-10)', description: 'Niveau compétition bodybuilding' },
  ],
}

export const getLevelValue = (sport: string, levelIndex: number): number => {
  // levelIndex 0 = 1-3, 1 = 4-6, 2 = 7-8, 3 = 9-10
  // On prend la valeur médiane pour simplifier
  const values = [2, 5, 7.5, 9.5]
  return Math.round(values[levelIndex])
}


import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { FiltersCard } from '../../components/cards/FiltersCard'
import type { FilterGroup } from '../../components/cards/FiltersCard'
import { QuestionListItem } from '../../components/cards/QuestionListItem'
import { PlayIcon, SparklesIcon } from '../../components/ui/icons'
import styles from './Questoes.module.css'

// TODO: substituir pelos dados reais vindos do backend (listas de questões)
const LISTAS = [
  {
    icon: '📐',
    iconColor: 'purple' as const,
    title: 'Lista: Funções',
    difficulty: 'Médio',
    difficultyColor: 'blue' as const,
    exam: 'ENEM',
    completed: 8,
    total: 15,
    progressColor: 'purple' as const,
  },
  {
    icon: '🌿',
    iconColor: 'green' as const,
    title: 'Lista: Ecologia',
    difficulty: 'Fácil',
    difficultyColor: 'teal' as const,
    exam: 'ENEM',
    completed: 20,
    total: 20,
    progressColor: 'teal' as const,
  },
  {
    icon: '🏛️',
    iconColor: 'blue' as const,
    title: 'Lista: Revolução Industrial',
    difficulty: 'Médio',
    difficultyColor: 'blue' as const,
    exam: 'Fuvest',
    completed: 0,
    total: 12,
    progressColor: 'purple' as const,
  },
]

const VESTIBULAR_OPTIONS = [
  { value: 'enem', label: 'ENEM' },
  { value: 'fuvest', label: 'Fuvest' },
  { value: 'unicamp', label: 'Unicamp' },
  { value: 'ufrj', label: 'UFRJ' },
  { value: 'ufmg', label: 'UFMG' },
]

const DIFICULDADE_OPTIONS = [
  { value: 'facil', label: 'Fácil' },
  { value: 'medio', label: 'Médio' },
  { value: 'dificil', label: 'Difícil' },
]

const MATERIA_OPTIONS = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'fisica', label: 'Física' },
  { value: 'quimica', label: 'Química' },
  { value: 'biologia', label: 'Biologia' },
  { value: 'historia', label: 'História' },
  { value: 'geografia', label: 'Geografia' },
  { value: 'portugues', label: 'Português' },
  { value: 'redacao', label: 'Redação' },
]

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function Questoes() {
  const [vestibulares, setVestibulares] = useState<string[]>(['enem'])
  const [dificuldades, setDificuldades] = useState<string[]>([])
  const [materias, setMaterias] = useState<string[]>([])

  const grupos: FilterGroup[] = [
    {
      label: 'Vestibular',
      options: VESTIBULAR_OPTIONS,
      selected: vestibulares,
      onToggle: (value) => setVestibulares((current) => toggleValue(current, value)),
    },
    {
      label: 'Dificuldade',
      options: DIFICULDADE_OPTIONS,
      selected: dificuldades,
      onToggle: (value) => setDificuldades((current) => toggleValue(current, value)),
    },
    {
      label: 'Matéria',
      options: MATERIA_OPTIONS,
      selected: materias,
      onToggle: (value) => setMaterias((current) => toggleValue(current, value)),
      display: 'list',
    },
  ]

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <TitlePage title="Banco de Questões" subtitle="+12.000 questões do ENEM e vestibulares" />

        <Button pill fullWidth={false} icon={<SparklesIcon />} iconPosition="left">
          Gerar lista com IA
        </Button>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.sideColumn}>
          <FiltersCard
            title="Filtros"
            groups={grupos}
            shortcuts={[{ label: 'Questões erradas' }, { label: 'Questões favoritas' }]}
          />
        </div>

        <div className={styles.mainColumn}>
          <div className={styles.listsHeader}>
            <span className={styles.listsCount}>6 listas disponíveis</span>
            <Button variant="outline" pill fullWidth={false} icon={<PlayIcon />} iconPosition="left">
              Começar lista
            </Button>
          </div>

          <div className={styles.lists}>
            {LISTAS.map((lista) => (
              <QuestionListItem
                key={lista.title}
                icon={lista.icon}
                iconColor={lista.iconColor}
                title={lista.title}
                difficulty={lista.difficulty}
                difficultyColor={lista.difficultyColor}
                exam={lista.exam}
                completed={lista.completed}
                total={lista.total}
                progressColor={lista.progressColor}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

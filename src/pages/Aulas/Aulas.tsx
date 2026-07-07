import { useState } from 'react'
import { TitlePage } from '../../components/ui/TitlePage'
import { Button } from '../../components/ui/Button'
import { AulaCard } from '../../components/cards/AulaCard'
import styles from './Aulas.module.css'

const CATEGORIAS = ['Todas', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Linguagens', 'Redação']

// TODO: substituir pelos dados reais vindos do backend (catálogo de aulas)
const AULAS = [
  {
    icon: '📐',
    iconColor: 'blue' as const,
    title: 'Funcao afim',
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    duration: '45 min',
    difficulty: 'Básico',
    progress: 100,
    status: 'concluida' as const,
    featured: true,
  },
  {
    icon: '📐',
    iconColor: 'blue' as const,
    title: 'Função Quadrática',
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    duration: '35 min',
    difficulty: 'Médio',
    progress: 60,
    status: 'em-andamento' as const,
    featured: true,
  },
  {
    icon: '🌿',
    iconColor: 'green' as const,
    title: 'Ecologia e Biomas',
    subject: 'Biologia',
    subjectColor: 'green' as const,
    duration: '40 min',
    difficulty: 'Médio',
    progress: 25,
    status: 'em-andamento' as const,
  },
  {
    icon: '⚛️',
    iconColor: 'purple' as const,
    title: 'Leis de Newton',
    subject: 'Física',
    subjectColor: 'purple' as const,
    duration: '50 min',
    difficulty: 'Difícil',
    progress: 0,
    status: 'em-andamento' as const,
  },
  {
    icon: '✍️',
    iconColor: 'purple' as const,
    title: 'Repertório sociocultural',
    subject: 'Redação',
    subjectColor: 'purple' as const,
    duration: '30 min',
    difficulty: 'Básico',
    progress: 100,
    status: 'concluida' as const,
  },
  {
    icon: '📜',
    iconColor: 'blue' as const,
    title: 'Revolução Industrial',
    subject: 'História',
    subjectColor: 'red' as const,
    duration: '35 min',
    difficulty: 'Médio',
    progress: 10,
    status: 'em-andamento' as const,
  },
]

export function Aulas() {
  const [categoria, setCategoria] = useState('Todas')

  return (
    <main className={styles.page}>
      <TitlePage title="Biblioteca de Aulas" subtitle="10 aulas disponíveis · 2 concluídas" />

      <div className={styles.filters}>
        {CATEGORIAS.map((item) => (
          <Button
            key={item}
            variant={item === categoria ? 'primary' : 'outline'}
            pill
            fullWidth={false}
            onClick={() => setCategoria(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className={styles.grid}>
        {AULAS.map((aula) => (
          <AulaCard
            key={aula.title}
            icon={aula.icon}
            iconColor={aula.iconColor}
            title={aula.title}
            subject={aula.subject}
            subjectColor={aula.subjectColor}
            duration={aula.duration}
            difficulty={aula.difficulty}
            progress={aula.progress}
            status={aula.status}
            featured={aula.featured}
          />
        ))}
      </div>
    </main>
  )
}

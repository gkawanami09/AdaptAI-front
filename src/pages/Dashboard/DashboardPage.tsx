// import { useOutletContext } from 'react-router-dom'
// import type { UserProfile } from '../../types/auth'
import styles from './DashboardPage.module.css'
import { TitlePage } from '../../components/ui/TitlePage'
import { BubbleInformation } from '../../components/ui/BubbleInformation'
import { ClockIcon, CheckSquareIcon, BoltIcon, FireIcon } from '../../components/ui/icons'
import { TitleSession } from '../../components/ui/TitleSession'
import { ActivityCard } from '../../components/cards/ActivityCard'
import { AlertCard } from '../../components/cards/AlertCard'
import { GraphBars } from '../../components/graph/GraphBars'
import { SubjectProgressList } from '../../components/graph/SubjectProgressList'

// TODO: substituir pelos dados reais vindos do backend (endpoint de resumo do dashboard)
const resumoEstudos = [
  { icon: <ClockIcon />, title: 'Tempo estudado', information: '12h30', variant: 'blue' as const },
  { icon: <CheckSquareIcon />, title: 'Tarefas concluídas', information: '6/9', variant: 'green' as const },
  { icon: <BoltIcon />, title: 'XP da semana', information: '1.240 XP', variant: 'purple' as const },
  { icon: <FireIcon />, title: 'Ofensiva atual', information: '8 dias', variant: 'gold' as const },
]

// TODO: substituir pelos dados reais vindos do backend (endpoint de evolução semanal)
const evolucaoSemanal = [
  { label: 'Seg', value: 65 },
  { label: 'Ter', value: 55 },
  { label: 'Qua', value: 90 },
  { label: 'Qui', value: 60 },
  { label: 'Sex', value: 85 },
  { label: 'Sáb', value: 35 },
  { label: 'Dom', value: 15 },
]

// TODO: substituir pelos dados reais vindos do backend (endpoint de desempenho por matéria)
const desempenhoPorMateria = [
  { label: 'Biologia', value: 78, color: 'teal' as const },
  { label: 'Português', value: 72, color: 'gold' as const },
  { label: 'História', value: 65, color: 'red' as const },
  { label: 'Matemática', value: 58, color: 'blue' as const },
]

// TODO: substituir pelos dados reais vindos do backend (endpoint do plano de estudos do dia)
const planoDeHoje = [
  {
    icon: '✍️',
    subject: 'Redação',
    subjectColor: 'purple' as const,
    status: 'concluido' as const,
    title: 'Repertório sociocultural',
    duration: '30 min',
    progress: 100,
  },
  {
    icon: '🌿',
    subject: 'Biologia',
    subjectColor: 'green' as const,
    status: 'em-andamento' as const,
    title: 'Ecologia',
    duration: '40 min',
    progress: 55,
  },
  {
    icon: '📐',
    subject: 'Matemática',
    subjectColor: 'blue' as const,
    status: 'nao-iniciado' as const,
    title: 'Questões ENEM: 20 questões',
    duration: '50 min',
  },
]

export function DashboardPage() {
  // const perfil = useOutletContext<UserProfile | null>()

  return (
    <main className={styles.page}>
      <TitlePage
        title="E aí, Guilherme! 👋"
        subtitle="Aqui está seu plano de estudos de hoje. Você está indo muito bem!"
      />

      <div className={styles.cardsRow}>
        {resumoEstudos.map((item) => (
          <BubbleInformation
            key={item.title}
            icon={item.icon}
            title={item.title}
            information={item.information}
            variant={item.variant}
          />
        ))}
      </div>

      <div className={styles.overviewRow}>
        <div className={styles.planColumn}>
          <TitleSession title="Plano de hoje" linkTo="/plano-de-estudos" />
          <div className={styles.activityList}>
            {planoDeHoje.map((item) => (
              <ActivityCard
                key={item.title}
                icon={item.icon}
                subject={item.subject}
                subjectColor={item.subjectColor}
                status={item.status}
                title={item.title}
                duration={item.duration}
                progress={item.progress}
              />
            ))}
          </div>
        </div>

        <div className={styles.graphColumn}>
          <GraphBars title="Evolução semanal" data={evolucaoSemanal} />
          <SubjectProgressList title="Evolução semanal" linkTo="/progresso" data={desempenhoPorMateria} />
          <AlertCard
            title="Evolução semanal"
            message="Matemática e Química estão abaixo da meta. Revise esta semana!"
          />
        </div>
      </div>
    </main>
  )
}

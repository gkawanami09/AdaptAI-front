// import { useOutletContext } from 'react-router-dom'
// import type { UserProfile } from '../../types/auth'
import styles from './DashboardPage.module.css'
import { TitlePage } from '../../components/ui/TitlePage'
import { BubbleInformation } from '../../components/ui/BubbleInformation'
import { ClockIcon, CheckSquareIcon, BoltIcon, FireIcon } from '../../components/ui/icons'
import { TitleSession } from '../../components/ui/TitleSession'

// TODO: substituir pelos dados reais vindos do backend (endpoint de resumo do dashboard)
const resumoEstudos = [
  { icon: <ClockIcon />, title: 'Tempo estudado', information: '12h30', variant: 'blue' as const },
  { icon: <CheckSquareIcon />, title: 'Tarefas concluídas', information: '6/9', variant: 'green' as const },
  { icon: <BoltIcon />, title: 'XP da semana', information: '1.240 XP', variant: 'purple' as const },
  { icon: <FireIcon />, title: 'Ofensiva atual', information: '8 dias', variant: 'gold' as const },
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

      <TitleSession title={'Plano de hoje'}/>
    </main>
  )
}

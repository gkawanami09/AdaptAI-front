// import { useOutletContext } from 'react-router-dom'
// import type { UserProfile } from '../../types/auth'
import styles from './DashboardPage.module.css'
import { TitlePage } from '../../components/ui/TitlePage'

export function DashboardPage() {
  // const perfil = useOutletContext<UserProfile | null>()

  return (
    <main className={styles.page}>
      <TitlePage title={"E aí, Guilherme! 👋"} subtitle={"Aqui está seu plano de estudos de hoje. Você está indo muito bem!"}/>
    </main>
  )
}

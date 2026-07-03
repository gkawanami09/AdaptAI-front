import { useOutletContext } from 'react-router-dom'
import type { UserProfile } from '../../types/auth'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const perfil = useOutletContext<UserProfile | null>()

  return (
    <main className={styles.page}>
      <h1>Área logada</h1>
      <p>
        Bem-vindo(a){perfil?.nome ? `, ${perfil.nome}` : ''}! Esta é uma página de exemplo, protegida pelo fluxo de
        autenticação — sirva-se dela como ponto de partida para as telas reais.
      </p>
    </main>
  )
}

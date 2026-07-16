import type { ReactNode } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AdminTopBar } from './AdminTopBar'
import type { UserProfile } from '../../types/auth'
import styles from './AdminPageLayout.module.css'

type AdminPageLayoutProps = {
  children: ReactNode
}

export function AdminPageLayout({ children }: AdminPageLayoutProps) {
  const perfil = useOutletContext<UserProfile | null>()

  return (
    <div className={styles.wrapper}>
      <AdminTopBar perfil={perfil} streak={8} hasNotifications />
      <main className={styles.content}>{children}</main>
    </div>
  )
}

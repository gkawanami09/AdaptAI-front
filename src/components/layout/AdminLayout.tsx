import { Outlet, useOutletContext } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import type { UserProfile } from '../../types/auth'
import styles from './AdminLayout.module.css'

export function AdminLayout() {
  const perfil = useOutletContext<UserProfile | null>()

  return (
    <div className={styles.shell}>
      <AdminSidebar perfil={perfil} />
      <div className={styles.content}>
        <Outlet context={perfil} />
      </div>
    </div>
  )
}

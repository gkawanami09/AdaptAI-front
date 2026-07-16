import { TitlePage } from '../../components/ui/TitlePage'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import styles from './AdminDashboard.module.css'

export function AdminDashboard() {
  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <TitlePage title="Painel Admin" subtitle="Gestão da plataforma AdaptAI" />
      </div>
    </AdminPageLayout>
  )
}

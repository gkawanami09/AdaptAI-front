import { useNavigate, useParams } from 'react-router-dom'
import { AdminPageLayout } from '../../components/layout/AdminPageLayout'
import { Breadcrumb } from '../../components/ui/Breadcrumb'
import { UserDetailPanel } from '../../components/cards/UserDetailPanel'
import styles from './AdminUsuarioDetalhe.module.css'

export function AdminUsuarioDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return null

  return (
    <AdminPageLayout>
      <div className={styles.page}>
        <Breadcrumb items={[{ label: 'Usuários', to: '/admin/usuarios' }, { label: 'Detalhes do usuário' }]} />

        <UserDetailPanel usuarioId={id} onVoltar={() => navigate('/admin/usuarios')} />
      </div>
    </AdminPageLayout>
  )
}

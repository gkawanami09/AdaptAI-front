import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { UserStatusBadge } from './UserStatusBadge'
import { UserAvatar } from './UserAvatar'
import { UserActions } from './UserActions'
import { FireIcon } from '../ui/icons'
import type { UsuarioResumo, UsuarioCargo } from '../../types/usuarios'
import styles from './UsersTable.module.css'

const CARGO_LABEL: Record<UsuarioCargo, string> = {
  aluno: 'Aluno',
  moderador: 'Moderador',
  editor: 'Editor',
  administrador: 'Administrador',
}

const CARGO_BADGE_COLOR: Record<UsuarioCargo, BadgeColor> = {
  aluno: 'gray',
  moderador: 'purple',
  editor: 'gold',
  administrador: 'blue',
}

type UsersTableProps = {
  usuarios: UsuarioResumo[]
  onVisualizar: (usuario: UsuarioResumo) => void
  onEditar: (usuario: UsuarioResumo) => void
  onSuspender: (usuario: UsuarioResumo) => void
  onBanir: (usuario: UsuarioResumo) => void
  onReativar: (usuario: UsuarioResumo) => void
  onResetarSenha: (usuario: UsuarioResumo) => void
  onResetarOfensiva: (usuario: UsuarioResumo) => void
}

export function UsersTable({ usuarios, onVisualizar, onEditar, onSuspender, onBanir, onReativar, onResetarSenha, onResetarOfensiva }: UsersTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Nível</th>
            <th>Ofensiva atual</th>
            <th>XP</th>
            <th>Último acesso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>
                <div className={styles.userCell}>
                  <UserAvatar nome={usuario.nome} avatarUrl={usuario.avatar_url} />
                  <div className={styles.userInfo}>
                    <span className={styles.userName} onClick={() => onVisualizar(usuario)}>
                      {usuario.nome}
                    </span>
                    <span className={styles.userEmail}>{usuario.email}</span>
                  </div>
                </div>
              </td>
              <td>
                <Badge color={CARGO_BADGE_COLOR[usuario.cargo]}>{CARGO_LABEL[usuario.cargo]}</Badge>
              </td>
              <td>
                <UserStatusBadge status={usuario.status} />
              </td>
              <td>{usuario.nivel !== undefined ? usuario.nivel : '—'}</td>
              <td>
                <span className={styles.streakCell}>
                  <FireIcon /> {usuario.ofensiva_atual ?? 0} dias
                </span>
              </td>
              <td>{(usuario.xp ?? 0).toLocaleString('pt-BR')} XP</td>
              <td>{usuario.ultimo_acesso ?? '—'}</td>
              <td>
                <div className={styles.actionsCell}>
                  <UserActions
                    usuario={usuario}
                    onVisualizar={() => onVisualizar(usuario)}
                    onEditar={() => onEditar(usuario)}
                    onSuspender={() => onSuspender(usuario)}
                    onBanir={() => onBanir(usuario)}
                    onReativar={() => onReativar(usuario)}
                    onResetarSenha={() => onResetarSenha(usuario)}
                    onResetarOfensiva={() => onResetarOfensiva(usuario)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

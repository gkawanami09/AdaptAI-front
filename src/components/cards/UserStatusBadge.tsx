import { Badge } from '../ui/Badge'
import type { UsuarioStatus } from '../../types/usuarios'

const STATUS_LABEL: Record<UsuarioStatus, string> = {
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  banido: 'Banido',
}

const STATUS_COLOR: Record<UsuarioStatus, 'teal' | 'gold' | 'red'> = {
  ativo: 'teal',
  suspenso: 'gold',
  banido: 'red',
}

type UserStatusBadgeProps = {
  status: UsuarioStatus
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return <Badge color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Badge>
}

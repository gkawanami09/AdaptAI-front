import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import type { MedidaAdministrativa, MedidaTipo, MedidaStatus } from '../../types/usuarios'
import styles from './AdminMeasureTable.module.css'

const TIPO_LABEL: Record<MedidaTipo, string> = {
  advertencia: 'Advertência',
  suspensao: 'Suspensão',
  banimento: 'Banimento',
}

const TIPO_COLOR: Record<MedidaTipo, BadgeColor> = {
  advertencia: 'gold',
  suspensao: 'red',
  banimento: 'red',
}

const STATUS_LABEL: Record<MedidaStatus, string> = {
  ativa: 'Ativa',
  expirada: 'Expirada',
  revogada: 'Revogada',
}

const STATUS_COLOR: Record<MedidaStatus, BadgeColor> = {
  ativa: 'red',
  expirada: 'gray',
  revogada: 'teal',
}

type AdminMeasureTableProps = {
  medidas: MedidaAdministrativa[]
}

export function AdminMeasureTable({ medidas }: AdminMeasureTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Motivo</th>
            <th>Administrador</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {medidas.map((medida) => (
            <tr key={medida.id}>
              <td>
                <Badge color={TIPO_COLOR[medida.tipo]}>{TIPO_LABEL[medida.tipo]}</Badge>
              </td>
              <td>{medida.motivo}</td>
              <td>{medida.administrador}</td>
              <td>{medida.data}</td>
              <td>
                <Badge color={STATUS_COLOR[medida.status]}>{STATUS_LABEL[medida.status]}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

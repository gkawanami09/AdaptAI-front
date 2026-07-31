import { Badge } from '../ui/Badge'
import type { BadgeColor } from '../ui/Badge'
import { SelectField } from '../ui/SelectField'
import { Switch } from '../ui/Switch'
import type { UsuarioAdmin, UsuarioAdminCargo } from '../../types/configuracoes'
import styles from './PermissionTable.module.css'

const CARGO_LABEL: Record<UsuarioAdminCargo, string> = {
  admin: 'Admin',
  editor: 'Editor',
  suporte: 'Suporte',
  aluno: 'Aluno',
}

const CARGO_BADGE_COLOR: Record<UsuarioAdminCargo, BadgeColor> = {
  admin: 'purple',
  editor: 'blue',
  suporte: 'gold',
  aluno: 'gray',
}

type PermissionTableProps = {
  usuarios: UsuarioAdmin[]
  onAlterarCargo: (usuario: UsuarioAdmin, cargo: UsuarioAdminCargo) => void
  onAlterarStatus: (usuario: UsuarioAdmin, ativo: boolean) => void
}

export function PermissionTable({ usuarios, onAlterarCargo, onAlterarStatus }: PermissionTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className={styles.nome}>{usuario.nome}</td>
              <td className={styles.email}>{usuario.email}</td>
              <td>
                <div className={styles.cargoCell}>
                  <Badge color={CARGO_BADGE_COLOR[usuario.cargo]}>{CARGO_LABEL[usuario.cargo]}</Badge>
                  <SelectField
                    id={`cargo-${usuario.id}`}
                    label=""
                    value={usuario.cargo}
                    onChange={(event) => onAlterarCargo(usuario, event.target.value as UsuarioAdminCargo)}
                  >
                    {Object.entries(CARGO_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </SelectField>
                </div>
              </td>
              <td>
                <div className={styles.statusCell}>
                  <Switch
                    checked={usuario.status === 'ativo'}
                    onChange={(checked) => onAlterarStatus(usuario, checked)}
                    label={`Status de ${usuario.nome}`}
                  />
                  {usuario.status === 'ativo' ? <Badge color="teal">Ativo</Badge> : <Badge color="red">Inativo</Badge>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

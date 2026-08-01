import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { SelectField } from '../ui/SelectField'
import type { UsuarioDetalhe, UsuarioCargo } from '../../types/usuarios'
import styles from './SuspensionModal.module.css'

const CARGO_LABEL: Record<UsuarioCargo, string> = {
  aluno: 'Aluno',
  moderador: 'Moderador',
  editor: 'Editor',
  administrador: 'Administrador',
}

type EditUserModalProps = {
  usuario: UsuarioDetalhe
  salvando?: boolean
  onConfirm: (nome: string, email: string, cargo: UsuarioCargo) => void
  onClose: () => void
}

export function EditUserModal({ usuario, salvando, onConfirm, onClose }: EditUserModalProps) {
  const [nome, setNome] = useState(usuario.nome)
  const [email, setEmail] = useState(usuario.email)
  const [cargo, setCargo] = useState<UsuarioCargo>(usuario.cargo)

  return (
    <Modal title="Editar usuário" onClose={onClose}>
      <div className={styles.field}>
        <TextField id="nome-usuario" label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} />
      </div>

      <div className={styles.field}>
        <TextField id="email-usuario" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      <div className={styles.field}>
        <SelectField id="cargo-usuario" label="Cargo" value={cargo} onChange={(event) => setCargo(event.target.value as UsuarioCargo)}>
          {Object.entries(CARGO_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={salvando}>
          Cancelar
        </Button>
        <Button type="button" fullWidth={false} onClick={() => onConfirm(nome, email, cargo)} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </Modal>
  )
}

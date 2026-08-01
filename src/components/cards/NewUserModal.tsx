import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TextField } from '../ui/TextField'
import { SelectField } from '../ui/SelectField'
import type { UsuarioCargo } from '../../types/usuarios'
import styles from './SuspensionModal.module.css'

const CARGO_LABEL: Record<UsuarioCargo, string> = {
  aluno: 'Aluno',
  moderador: 'Moderador',
  editor: 'Editor',
  administrador: 'Administrador',
}

type NewUserModalProps = {
  criando?: boolean
  onConfirm: (nome: string, email: string, cargo: UsuarioCargo) => void
  onClose: () => void
}

export function NewUserModal({ criando, onConfirm, onClose }: NewUserModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cargo, setCargo] = useState<UsuarioCargo>('aluno')

  return (
    <Modal title="Novo usuário" onClose={onClose}>
      <div className={styles.field}>
        <TextField id="nome-novo-usuario" label="Nome" value={nome} onChange={(event) => setNome(event.target.value)} />
      </div>

      <div className={styles.field}>
        <TextField id="email-novo-usuario" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>

      <div className={styles.field}>
        <SelectField id="cargo-novo-usuario" label="Cargo" value={cargo} onChange={(event) => setCargo(event.target.value as UsuarioCargo)}>
          {Object.entries(CARGO_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectField>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={criando}>
          Cancelar
        </Button>
        <Button type="button" fullWidth={false} onClick={() => onConfirm(nome, email, cargo)} disabled={criando || !nome.trim() || !email.trim()}>
          {criando ? 'Criando...' : 'Criar usuário'}
        </Button>
      </div>
    </Modal>
  )
}

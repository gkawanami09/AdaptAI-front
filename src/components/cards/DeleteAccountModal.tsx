import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import styles from './PasswordChangeModal.module.css'

type DeleteAccountModalProps = {
  onClose: () => void
  onConfirm: (senha: string) => Promise<void>
}

const CONFIRM_WORD = 'EXCLUIR'

export function DeleteAccountModal({ onClose, onConfirm }: DeleteAccountModalProps) {
  const [senha, setSenha] = useState('')
  const [confirmacaoTexto, setConfirmacaoTexto] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')

    if (!senha) {
      setErro('Informe sua senha atual para confirmar a exclusão.')
      return
    }

    if (confirmacaoTexto.trim().toUpperCase() !== CONFIRM_WORD) {
      setErro(`Digite "${CONFIRM_WORD}" para confirmar.`)
      return
    }

    setEnviando(true)
    try {
      await onConfirm(senha)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível excluir a conta.')
      setEnviando(false)
    }
  }

  return (
    <Modal title="Excluir conta" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.errorMessage} style={{ color: 'var(--text-muted)' }}>
          Essa ação é irreversível. Todos os seus dados, progresso e histórico serão permanentemente excluídos.
        </p>

        <TextField
          id="senha-exclusao"
          type="password"
          label="Sua senha"
          labelVariant="caps"
          autoComplete="current-password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          disabled={enviando}
        />

        <TextField
          id="confirmacao-exclusao"
          type="text"
          label={`Digite "${CONFIRM_WORD}" para confirmar`}
          labelVariant="caps"
          value={confirmacaoTexto}
          onChange={(event) => setConfirmacaoTexto(event.target.value)}
          disabled={enviando}
        />

        {erro && <p className={styles.errorMessage}>{erro}</p>}

        <div className={styles.actions}>
          <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth={false} disabled={enviando}>
            {enviando ? 'Excluindo...' : 'Excluir minha conta'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

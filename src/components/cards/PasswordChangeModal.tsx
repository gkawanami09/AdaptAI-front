import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../ui/Modal'
import { TextField } from '../ui/TextField'
import { Button } from '../ui/Button'
import styles from './PasswordChangeModal.module.css'

type PasswordChangeModalProps = {
  onClose: () => void
  onSubmit: (senhaAtual: string, novaSenha: string) => Promise<void>
}

const MIN_LENGTH = 8

export function PasswordChangeModal({ onClose, onSubmit }: PasswordChangeModalProps) {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function validar(): string | null {
    if (!senhaAtual || !novaSenha || !confirmacao) return 'Preencha todos os campos.'
    if (novaSenha.length < MIN_LENGTH) return `A nova senha deve ter pelo menos ${MIN_LENGTH} caracteres.`
    if (novaSenha === senhaAtual) return 'A nova senha deve ser diferente da senha atual.'
    if (novaSenha !== confirmacao) return 'A confirmação não confere com a nova senha.'
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErro('')

    const validacao = validar()
    if (validacao) {
      setErro(validacao)
      return
    }

    setEnviando(true)
    try {
      await onSubmit(senhaAtual, novaSenha)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível alterar a senha.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Modal title="Alterar senha" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          id="senha-atual"
          type="password"
          label="Senha atual"
          labelVariant="caps"
          autoComplete="current-password"
          value={senhaAtual}
          onChange={(event) => setSenhaAtual(event.target.value)}
          disabled={enviando}
        />
        <TextField
          id="nova-senha"
          type="password"
          label="Nova senha"
          labelVariant="caps"
          autoComplete="new-password"
          value={novaSenha}
          onChange={(event) => setNovaSenha(event.target.value)}
          disabled={enviando}
        />
        <TextField
          id="confirmar-senha"
          type="password"
          label="Confirmar nova senha"
          labelVariant="caps"
          autoComplete="new-password"
          value={confirmacao}
          onChange={(event) => setConfirmacao(event.target.value)}
          disabled={enviando}
        />

        {erro && <p className={styles.errorMessage}>{erro}</p>}

        <div className={styles.actions}>
          <Button type="button" variant="outline" fullWidth={false} onClick={onClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth={false} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar nova senha'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

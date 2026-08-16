import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, CheckCircleIcon } from '../../components/ui/icons'
import { redefinirSenha } from '../../services/auth'
import styles from './RedefinirSenhaPage.module.css'

const MIN_LENGTH = 8

export function RedefinirSenhaPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [concluido, setConcluido] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (!token) {
      setErrorMessage('Link de redefinição inválido ou expirado. Solicite um novo link.')
      return
    }

    if (novaSenha.length < MIN_LENGTH) {
      setErrorMessage(`A nova senha deve ter pelo menos ${MIN_LENGTH} caracteres.`)
      return
    }

    if (novaSenha !== confirmacao) {
      setErrorMessage('A confirmação não confere com a nova senha.')
      return
    }

    setIsSubmitting(true)
    try {
      await redefinirSenha(token, novaSenha)
      setConcluido(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Não foi possível redefinir a senha. O link pode ter expirado.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Escolha uma nova senha para acessar sua conta."
      bubbleTitle="Quase lá!"
      bubbleText="Defina uma nova senha e volte a estudar."
    >
      {concluido ? (
        <div className={styles.confirmation}>
          <span className={styles.confirmationIcon}>
            <CheckCircleIcon />
          </span>
          <p className={styles.confirmationText}>Sua senha foi redefinida com sucesso.</p>
          <Link to="/login" className={styles.backLink}>
            Ir para o login
          </Link>
        </div>
      ) : !token ? (
        <div className={styles.confirmation}>
          <p className={styles.confirmationText}>
            Este link de redefinição é inválido ou expirou. Solicite um novo link.
          </p>
          <Link to="/esqueci-senha" className={styles.backLink}>
            Solicitar novo link
          </Link>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            id="nova-senha"
            type="password"
            label="Nova senha"
            placeholder="Sua nova senha"
            autoComplete="new-password"
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
            required
          />
          <TextField
            id="confirmar-senha"
            type="password"
            label="Confirmar nova senha"
            placeholder="Repita a nova senha"
            autoComplete="new-password"
            value={confirmacao}
            onChange={(event) => setConfirmacao(event.target.value)}
            required
          />

          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}

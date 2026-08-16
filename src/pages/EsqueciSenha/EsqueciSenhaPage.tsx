import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, MailIcon } from '../../components/ui/icons'
import { solicitarRecuperacaoSenha } from '../../services/auth'
import styles from './EsqueciSenhaPage.module.css'

export function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await solicitarRecuperacaoSenha(email)
      setEnviado(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível enviar a solicitação.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail para receber as instruções de redefinição."
      bubbleTitle="Sem problemas!"
      bubbleText="Vou te ajudar a voltar aos estudos rapidinho."
    >
      {enviado ? (
        <div className={styles.confirmation}>
          <span className={styles.confirmationIcon}>
            <MailIcon />
          </span>
          <p className={styles.confirmationText}>
            Se este email estiver cadastrado, enviaremos instruções para redefinir sua senha.
          </p>
          <Link to="/login" className={styles.backLink}>
            Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <TextField
              id="email"
              name="email"
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

            <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
            </Button>
          </form>

          <p className={styles.backHint}>
            <Link to="/login">Voltar para o login</Link>
          </p>
        </>
      )}
    </AuthLayout>
  )
}

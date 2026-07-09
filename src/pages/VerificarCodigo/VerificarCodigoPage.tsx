import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { CodeInput } from '../../components/ui/CodeInput'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, CheckIcon } from '../../components/ui/icons'
import { confirmEmail } from '../../services/auth'
import styles from './VerificarCodigoPage.module.css'

const RESEND_COOLDOWN_SECONDS = 30

const steps = [
  { label: 'Conta criada', status: 'done' as const },
  { label: 'Verifique seu e-mail', status: 'current' as const },
  { label: 'Comece a estudar', status: 'pending' as const },
]

function maskEmail(email: string) {
  const [user, domain] = email.split('@')
  if (!user || !domain) return email
  const visible = user.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 2))}@${domain}`
}

export function VerificarCodigoPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email =
    (location.state as { email?: string } | null)?.email ??
    sessionStorage.getItem('adaptai_pending_email') ??
    'seu@email.com'

  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (cooldown === 0) return

    const timer = setInterval(() => {
      setCooldown((value) => Math.max(value - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await confirmEmail(email, code)
      sessionStorage.removeItem('adaptai_pending_email')
      navigate('/login', { replace: true, state: { verifiedEmail: email } })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel verificar o codigo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleResend() {
    if (cooldown > 0) return
    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <AuthLayout
      title="Verifique seu e-mail"
      subtitle={`Enviamos um codigo de 6 digitos para ${maskEmail(email)}`}
      bubbleTitle="Quase la!"
      bubbleText="Confirme o codigo para ativar sua conta e comecar sua jornada de estudos."
      showcaseExtra={
        <ul className={styles.steps}>
          {steps.map((step) => (
            <li
              key={step.label}
              className={`${styles.step}${step.status === 'current' ? ` ${styles['step--current']}` : ''}`}
            >
              <span className={`${styles.stepIcon} ${styles[`stepIcon--${step.status}`] ?? ''}`}>
                {step.status === 'done' ? <CheckIcon /> : null}
              </span>
              <span>{step.label}</span>
            </li>
          ))}
        </ul>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.codeField}>
          <span className={styles.codeLabel}>Codigo de verificacao</span>
          <CodeInput value={code} onChange={setCode} error={Boolean(errorMessage)} />
        </div>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting || code.length < 6}>
          {isSubmitting ? 'Verificando...' : 'Verificar codigo'}
        </Button>
      </form>

      <p className={styles.resendHint}>
        Nao recebeu o codigo?{' '}
        <button type="button" className={styles.resendButton} onClick={handleResend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar codigo'}
        </button>
      </p>

      <p className={styles.backHint}>
        <Link to="/login">Voltar para o login</Link>
      </p>
    </AuthLayout>
  )
}

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { CodeInput } from '../../components/ui/CodeInput'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, CheckIcon } from '../../components/ui/icons'
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
  const email = (location.state as { email?: string } | null)?.email ?? 'seu@email.com'

  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  useEffect(() => {
    if (cooldown === 0) return

    const timer = setInterval(() => {
      setCooldown((value) => Math.max(value - 1, 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    // TODO: conectar ao backend de verificação de código
    // ex: await api.post('/auth/verify-code', { email, code })
    console.log('verify code submit', { email, code })

    setIsSubmitting(false)
  }

  function handleResend() {
    if (cooldown > 0) return

    // TODO: conectar ao backend para reenviar o código
    // ex: await api.post('/auth/resend-code', { email })
    console.log('resend code', { email })

    setCooldown(RESEND_COOLDOWN_SECONDS)
  }

  return (
    <AuthLayout
      title="Verifique seu e-mail"
      subtitle={`Enviamos um código de 6 dígitos para ${maskEmail(email)}`}
      bubbleTitle="Quase lá! 🎉"
      bubbleText="Confirme o código para ativar sua conta e começar sua jornada de estudos."
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
          <span className={styles.codeLabel}>Código de verificação</span>
          <CodeInput value={code} onChange={setCode} />
        </div>

        <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting || code.length < 6}>
          Verificar código
        </Button>
      </form>

      <p className={styles.resendHint}>
        Não recebeu o código?{' '}
        <button type="button" className={styles.resendButton} onClick={handleResend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar código'}
        </button>
      </p>

      <p className={styles.backHint}>
        <Link to="/login">Voltar para o login</Link>
      </p>
    </AuthLayout>
  )
}

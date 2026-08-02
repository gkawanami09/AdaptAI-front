import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, BoltIcon, EyeIcon, EyeOffIcon, FireIcon } from '../../components/ui/icons'
import { loginUser } from '../../services/auth'
import { getOnboarding } from '../../services/onboarding'
import { activateOnboardingFor, setOnboardingActive } from '../../utils/onboarding'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const verifiedEmail = (location.state as { verifiedEmail?: string } | null)?.verifiedEmail ?? ''

  const [email, setEmail] = useState(verifiedEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await loginUser(email, password)
      let shouldStartOnboarding = activateOnboardingFor(email)

      try {
        const response = await getOnboarding()
        shouldStartOnboarding = !response.onboarding.concluido
        setOnboardingActive(shouldStartOnboarding)
      } catch (onboardingError) {
        console.error('Não foi possível consultar o onboarding.', onboardingError)
      }

      navigate(shouldStartOnboarding ? '/onboarding' : '/dashboard', { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel entrar na conta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Continue sua jornada de estudos."
      bubbleTitle="Ola! Sou a Ada"
      bubbleText="Sua tutora de IA. Estou aqui para te ajudar a conquistar sua vaga na universidade!"
      showcaseExtra={
        <div className={styles.adaStats}>
          <span className={styles.adaStatsItem}>
            <FireIcon /> 8 dias de ofensiva
          </span>
          <span className={styles.adaStatsDivider} />
          <span className={styles.adaStatsItem}>
            <BoltIcon /> 1.240 XP
          </span>
        </div>
      }
    >
      <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
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

        <div className={styles.loginFormPassword}>
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            placeholder="Sua senha"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            endAdornment={
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
          <Link className={styles.forgotPassword} to="/esqueci-senha">
            Esqueci minha senha
          </Link>
        </div>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar na conta'}
        </Button>
      </form>

      <p className={styles.signupHint}>
        Nao tem conta? <Link to="/cadastro">Criar conta gratis</Link>
      </p>
    </AuthLayout>
  )
}

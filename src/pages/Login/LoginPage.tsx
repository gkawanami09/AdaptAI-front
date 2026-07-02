import { useState } from 'react'
import type { FormEvent } from 'react'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AdaMascot } from '../../components/AdaMascot'
import { ArrowRightIcon, BoltIcon, EyeIcon, EyeOffIcon, FireIcon } from '../../components/ui/icons'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    // TODO: conectar ao backend de autenticação (endpoint de login)
    // ex: await api.post('/auth/login', { email, password })
    console.log('login submit', { email, password })

    setIsSubmitting(false)
  }

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginPanel}>
        <div className={styles.loginPanelContent}>
          <div className={styles.brand}>
            <span className={styles.brandLogo}>
              <BoltIcon />
            </span>
            <span className={styles.brandName}>AdaptAI</span>
          </div>

          <div className={styles.loginHeading}>
            <h1>Bem-vindo de volta</h1>
            <p>Continue sua jornada de estudos.</p>
          </div>

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
              <a className={styles.forgotPassword} href="/esqueci-senha">
                Esqueci minha senha
              </a>
            </div>

            <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
              Entrar na conta
            </Button>
          </form>

          <p className={styles.signupHint}>
            Não tem conta? <a href="/cadastro">Criar conta grátis</a>
          </p>
        </div>
      </section>

      <section className={styles.showcasePanel}>
        <AdaMascot className={styles.adaMascot} />

        <div className={styles.adaBubble}>
          <p className={styles.adaBubbleTitle}>Olá! Sou a Ada 👋</p>
          <p className={styles.adaBubbleText}>
            Sua tutora de IA. Estou aqui para te ajudar a conquistar sua vaga na universidade!
          </p>
        </div>

        <div className={styles.adaStats}>
          <span className={styles.adaStatsItem}>
            <FireIcon /> 8 dias de ofensiva
          </span>
          <span className={styles.adaStatsDivider} />
          <span className={styles.adaStatsItem}>
            <BoltIcon /> 1.240 XP
          </span>
        </div>
      </section>
    </div>
  )
}

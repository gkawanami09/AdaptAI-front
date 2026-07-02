import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from '../../components/ui/icons'
import styles from './CadastroPage.module.css'

const featureChips = [
  { emoji: '🎯', label: 'Plano personalizado' },
  { emoji: '🤖', label: 'IA tutora 24h' },
  { emoji: '🔥', label: 'Gamificação' },
]

export function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    // TODO: conectar ao backend de cadastro (endpoint de criação de conta)
    // ex: await api.post('/auth/register', { name, email, password })
    console.log('cadastro submit', { name, email, password, confirmPassword })

    setIsSubmitting(false)
  }

  return (
    <AuthLayout
      title="Crie sua conta grátis"
      subtitle="Sem cartão de crédito. Sem pegadinha."
      bubbleTitle="Bora montar seu plano de estudos?"
      bubbleText="Em menos de 2 minutos você terá um cronograma personalizado para o ENEM."
      showcaseExtra={
        <div className={styles.featureChips}>
          {featureChips.map((chip) => (
            <div className={styles.featureChip} key={chip.label}>
              <span className={styles.featureChipIcon}>{chip.emoji}</span>
              <span className={styles.featureChipLabel}>{chip.label}</span>
            </div>
          ))}
        </div>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          id="name"
          name="name"
          type="text"
          label="Nome completo"
          placeholder="Seu nome"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

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

        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Senha"
          placeholder="Sua senha"
          autoComplete="new-password"
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

        <TextField
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
          Entrar na conta
        </Button>
      </form>

      <p className={styles.loginHint}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>

      <p className={styles.terms}>
        Ao criar sua conta, você concorda com nossos <Link to="/termos-de-uso">Termos de Uso</Link> e{' '}
        <Link to="/politica-de-privacidade">Política de Privacidade</Link>.
      </p>
    </AuthLayout>
  )
}

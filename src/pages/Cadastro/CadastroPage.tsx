import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { ArrowRightIcon, EyeIcon, EyeOffIcon, PlusIcon } from '../../components/ui/icons'
import { registerUser } from '../../services/auth'
import { markOnboardingPending } from '../../utils/onboarding'
import styles from './CadastroPage.module.css'

const featureChips = [
  { emoji: '🎯', label: 'Plano personalizado' },
  { emoji: '🤖', label: 'IA tutora 24h' },
  { emoji: '🔥', label: 'Gamificacao' },
]

export function CadastroPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!profilePhoto) {
      setProfilePhotoPreview('')
      return
    }

    const previewUrl = URL.createObjectURL(profilePhoto)
    setProfilePhotoPreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [profilePhoto])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')

    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas nao coincidem.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({
        name,
        school,
        email,
        password,
        confirmPassword,
        profilePhoto,
      })

      markOnboardingPending(email)
      sessionStorage.setItem('adaptai_pending_email', email)
      navigate('/verificar-codigo', { state: { email, password } })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel criar sua conta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Crie sua conta gratis"
      subtitle="Sem cartao de credito. Sem pegadinha."
      bubbleTitle="Bora montar seu plano de estudos?"
      bubbleText="Em menos de 2 minutos voce tera um cronograma personalizado para o ENEM."
      contentClassName={styles.panelContentWide}
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
          id="school"
          name="school"
          type="text"
          label="Escola"
          placeholder="Nome da escola"
          autoComplete="organization"
          value={school}
          onChange={(event) => setSchool(event.target.value)}
          required
        />

        <div className={styles.photoField}>
          <span className={styles.photoLabel}>Foto de perfil</span>
          <label className={styles.photoUpload} htmlFor="profile-photo">
            <span className={styles.photoPreview} aria-hidden="true">
              {profilePhotoPreview ? <img src={profilePhotoPreview} alt="" /> : <PlusIcon />}
            </span>
            <span className={styles.photoContent}>
              <span className={styles.photoAction}>Escolher foto</span>
              <span className={styles.photoHint}>{profilePhoto ? profilePhoto.name : 'PNG, JPG ou WEBP ate 5 MB'}</span>
            </span>
          </label>
          <input
            id="profile-photo"
            className={styles.photoInput}
            name="profilePhoto"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setProfilePhoto(event.target.files?.[0] ?? null)}
          />
        </div>

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

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <Button type="submit" icon={<ArrowRightIcon />} disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Entrar na conta'}
        </Button>
      </form>

      <p className={styles.loginHint}>
        Ja tem conta? <Link to="/login">Fazer login</Link>
      </p>

      <p className={styles.terms}>
        Ao criar sua conta, voce concorda com nossos <Link to="/termos-de-uso">Termos de Uso</Link> e{' '}
        <Link to="/politica-de-privacidade">Politica de Privacidade</Link>.
      </p>
    </AuthLayout>
  )
}

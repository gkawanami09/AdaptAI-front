import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AdaMascot } from '../../components/AdaMascot'
import { ArrowLeftIcon, ArrowRightIcon, BoltIcon, CheckIcon } from '../../components/ui/icons'
import { concluirOnboarding } from '../../services/onboarding'
import type {
  OnboardingMainGoal,
  OnboardingObjective,
  OnboardingStudyTime,
  OnboardingSubject,
} from '../../types/onboarding'
import { completeOnboarding, isOnboardingActive } from '../../utils/onboarding'
import styles from './OnboardingPage.module.css'

type OptionId = OnboardingObjective | OnboardingStudyTime | OnboardingSubject | OnboardingMainGoal | 'olimpiadas'
type Option = { id: OptionId; emoji: string; title: string; description?: string; disabled?: boolean }
type Answers = {
  objective: OnboardingObjective | ''
  studyTime: OnboardingStudyTime | ''
  subjects: OnboardingSubject[]
  mainGoal: OnboardingMainGoal | ''
}

const steps: Array<{
  message: string
  title: string
  subtitle: string
  columns?: 2 | 3
  options: Option[]
}> = [
  {
    message: 'Vou personalizar seu plano de acordo com seu objetivo!',
    title: 'Qual é seu objetivo?',
    subtitle: 'Vamos personalizar sua experiência',
    options: [
      { id: 'enem', emoji: '🎯', title: 'ENEM', description: 'Exame Nacional do Ensino Médio' },
      { id: 'fuvest', emoji: '🏛️', title: 'Fuvest', description: 'Universidade de São Paulo' },
      { id: 'unicamp', emoji: '🔬', title: 'Unicamp', description: 'Universidade Estadual de Campinas' },
      { id: 'vestibulares', emoji: '📚', title: 'Vestibulares gerais', description: 'Outros vestibulares' },
      { id: 'olimpiadas', emoji: '🏅', title: 'Olimpíadas científicas', description: 'Em breve', disabled: true },
    ],
  },
  {
    message: 'Sem pressão! Você pode ajustar isso depois.',
    title: 'Quanto tempo você pode estudar por dia?',
    subtitle: 'Seja honesto — o plano se adapta ao seu ritmo',
    options: [
      { id: '30-minutos', emoji: '⏱️', title: '30 minutos', description: 'Estudo leve e consistente' },
      { id: '1-hora', emoji: '🕐', title: '1 hora', description: 'Bom ritmo de aprendizado' },
      { id: '2-horas', emoji: '🕑', title: '2 horas', description: 'Progresso acelerado' },
      { id: '3-horas-ou-mais', emoji: '🚀', title: '3h ou mais', description: 'Modo intensivo' },
    ],
  },
  {
    message: 'Vou priorizar as matérias que você mais precisa.',
    title: 'Quais matérias você sente mais dificuldade?',
    subtitle: 'Selecione todas que se aplicam',
    columns: 3,
    options: [
      { id: 'matematica', emoji: '📐', title: 'Matemática' },
      { id: 'fisica', emoji: '⚡', title: 'Física' },
      { id: 'quimica', emoji: '⚗️', title: 'Química' },
      { id: 'biologia', emoji: '🌿', title: 'Biologia' },
      { id: 'historia', emoji: '🏛️', title: 'História' },
      { id: 'geografia', emoji: '🌎', title: 'Geografia' },
      { id: 'portugues', emoji: '📚', title: 'Português' },
      { id: 'redacao', emoji: '✍️', title: 'Redação' },
      { id: 'ingles', emoji: '🌐', title: 'Inglês' },
    ],
  },
  {
    message: 'Quase lá! Sua meta vai guiar todo o seu plano.',
    title: 'Qual é sua meta principal?',
    subtitle: 'Isso ajuda a IA a priorizar o conteúdo certo',
    options: [
      { id: 'melhorar-nota', emoji: '📈', title: 'Melhorar nota geral', description: 'Subir pontuação no ENEM' },
      { id: 'universidade-publica', emoji: '🎓', title: 'Passar em universidade pública', description: 'Conquistar minha vaga' },
      { id: 'estudar-do-zero', emoji: '🌱', title: 'Estudar do zero', description: 'Começar do básico' },
      { id: 'revisar', emoji: '🔄', title: 'Revisar conteúdos', description: 'Reforçar o que já sei' },
      { id: 'treinar-redacao', emoji: '✍️', title: 'Treinar redação', description: 'Focar na nota da redação' },
    ],
  },
]

const initialAnswers: Answers = { objective: '', studyTime: '', subjects: [], mainGoal: '' }

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(initialAnswers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const isComplete = step === steps.length
  const currentStep = steps[step]

  const selectedIds: OptionId[] = step === 0
    ? answers.objective ? [answers.objective] : []
    : step === 1
      ? answers.studyTime ? [answers.studyTime] : []
      : step === 2
        ? answers.subjects
        : step === 3
          ? answers.mainGoal ? [answers.mainGoal] : []
          : []

  if (!isOnboardingActive()) return <Navigate to="/dashboard" replace />

  function selectOption(option: Option) {
    if (option.disabled) return
    if (step === 0) setAnswers((value) => ({ ...value, objective: option.id as OnboardingObjective }))
    if (step === 1) setAnswers((value) => ({ ...value, studyTime: option.id as OnboardingStudyTime }))
    if (step === 2) {
      const subject = option.id as OnboardingSubject
      setAnswers((value) => ({
        ...value,
        subjects: value.subjects.includes(subject)
          ? value.subjects.filter((selectedSubject) => selectedSubject !== subject)
          : [...value.subjects, subject],
      }))
    }
    if (step === 3) setAnswers((value) => ({ ...value, mainGoal: option.id as OnboardingMainGoal }))
  }

  async function advance() {
    setErrorMessage('')

    if (step < steps.length - 1) {
      setStep((value) => value + 1)
      return
    }

    if (!answers.objective || !answers.studyTime || !answers.mainGoal || answers.subjects.length === 0) return

    setIsSubmitting(true)
    try {
      const response = await concluirOnboarding({
        objective: answers.objective,
        studyTime: answers.studyTime,
        subjects: answers.subjects,
        mainGoal: answers.mainGoal,
      })

      if (!response.sucesso) throw new Error('Não foi possível criar seu plano de estudos.')
      setStep((value) => value + 1)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível criar seu plano de estudos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function finish() {
    completeOnboarding(answers)
    navigate('/dashboard', { replace: true })
  }

  if (isComplete) {
    return (
      <main className={`${styles.page} ${styles.successPage}`}>
        <section className={styles.successCard} aria-labelledby="onboarding-success-title">
          <AdaMascot className={styles.successMascot} />
          <span className={styles.successCheck} aria-hidden="true"><CheckIcon /></span>
          <h1 id="onboarding-success-title">Seu plano AdaptAI está pronto!</h1>
          <p>A IA analisou suas respostas e criou um cronograma<br className={styles.desktopBreak} /> personalizado para você. Vamos começar?</p>
          <div className={styles.summaryCards}>
            <div><span>🗓️</span><p>Plano criado</p></div>
            <div><span>🎯</span><p>Meta definida</p></div>
            <div><span>🤖</span><p>IA ativada</p></div>
          </div>
          <button type="button" className={styles.dashboardButton} onClick={finish}>
            Ver meu dashboard <ArrowRightIcon />
          </button>
        </section>
      </main>
    )
  }

  const canContinue = selectedIds.some(Boolean)

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}><span className={styles.brandIcon}><BoltIcon /></span><strong>AdaptAI</strong></div>
          <span className={styles.counter}>{step + 1} de {steps.length}</span>
          <div className={styles.progressTrack} aria-label={`Etapa ${step + 1} de ${steps.length}`}>
            <span style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </header>

        <section className={styles.content} aria-labelledby="onboarding-title">
          <div className={styles.messageRow}>
            <AdaMascot className={styles.messageMascot} />
            <p>{currentStep.message}</p>
          </div>
          <h1 id="onboarding-title">{currentStep.title}</h1>
          <p className={styles.subtitle}>{currentStep.subtitle}</p>

          <div className={`${styles.options} ${currentStep.columns === 3 ? styles.threeColumns : ''}`}>
            {currentStep.options.map((option) => {
              const selected = selectedIds.includes(option.id)
              return (
                <button key={option.id} type="button"
                  className={`${styles.option} ${selected ? styles.selected : ''}`}
                  disabled={option.disabled} aria-pressed={selected} onClick={() => selectOption(option)}>
                  <span className={styles.optionEmoji} aria-hidden="true">{option.emoji}</span>
                  <span className={styles.optionText}>
                    <strong>{option.title}</strong>
                    {option.description && <small>{option.description}</small>}
                  </span>
                  {selected && <span className={styles.optionCheck}><CheckIcon /></span>}
                </button>
              )
            })}
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.backButton} disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
              <ArrowLeftIcon /> Voltar
            </button>
            <button type="button" className={styles.continueButton} disabled={!canContinue || isSubmitting} onClick={advance}>
              {isSubmitting ? 'Criando plano...' : step === steps.length - 1 ? 'Criar meu plano' : 'Continuar'} <ArrowRightIcon />
            </button>
          </footer>
          {errorMessage && <p className={styles.errorMessage} role="alert">{errorMessage}</p>}
        </section>
      </div>
    </main>
  )
}

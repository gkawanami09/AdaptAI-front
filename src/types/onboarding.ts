export type OnboardingObjective = 'enem' | 'fuvest' | 'unicamp' | 'vestibulares'

export type OnboardingStudyTime = '30-minutos' | '1-hora' | '2-horas' | '3-horas-ou-mais'

export type OnboardingSubject =
  | 'matematica'
  | 'fisica'
  | 'quimica'
  | 'biologia'
  | 'historia'
  | 'geografia'
  | 'portugues'
  | 'redacao'
  | 'ingles'

export type OnboardingMainGoal =
  | 'melhorar-nota'
  | 'universidade-publica'
  | 'estudar-do-zero'
  | 'revisar'
  | 'treinar-redacao'

export type OnboardingConcluirInput = {
  objective: OnboardingObjective
  studyTime: OnboardingStudyTime
  subjects: OnboardingSubject[]
  mainGoal: OnboardingMainGoal
}

export type OnboardingData = {
  concluido: boolean
  preferencias: Record<string, unknown> | null
  materias_dificuldade: Array<Record<string, unknown>>
  plano: Record<string, unknown> | null
  personalizacao_ia_ativa: boolean
}

export type OnboardingResponse = {
  sucesso: boolean
  onboarding: OnboardingData
  mensagem?: string
}

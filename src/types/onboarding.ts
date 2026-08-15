import type { DiaSemana, PlanoEstudosGeradoStatus } from './planoEstudosCriar'

export type OnboardingObjective = 'enem' | 'fuvest' | 'unicamp' | 'vestibulares'

export type OnboardingStudyTime = '30-minutos' | '1-hora' | '2-horas' | '3-horas-ou-mais'

export type OnboardingSubject = string

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
  studyDays: DiaSemana[]
}

export type OnboardingPreferencias = {
  tipo_prova_id: string
  objetivo_principal: string
  minutos_estudo_dia: number
  onboarding_concluido_em: string | null
}

export type OnboardingMateriaDificuldade = {
  id: string
  nome: string
  slug: string
  icone: string | null
  cor: string | null
}

export type OnboardingPlano = {
  id: string
  tipo_prova_id: string
  titulo: string
  data_inicio: string
  data_fim: string | null
  status: string
  criado_por: string
  status_geracao: PlanoEstudosGeradoStatus
  mensagem_erro: string | null
}

export type OnboardingData = {
  concluido: boolean
  preferencias: OnboardingPreferencias | null
  materias_dificuldade: OnboardingMateriaDificuldade[]
  plano: OnboardingPlano | null
  personalizacao_ia_ativa: boolean
}

export type OnboardingResponse = {
  sucesso: boolean
  onboarding: OnboardingData
}

export type OnboardingConcluirResponse = {
  sucesso: boolean
  mensagem: string
  onboarding: OnboardingData
}

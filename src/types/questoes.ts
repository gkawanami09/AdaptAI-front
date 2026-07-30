export type QuestaoDificuldade = 'facil' | 'medio' | 'dificil'
export type AlternativaLetra = 'A' | 'B' | 'C' | 'D' | 'E'

export type AlternativaQuestao = {
  id?: string
  letra: AlternativaLetra
  texto: string
  correta: boolean
}

export type Questao = {
  id: string
  tipo_prova_id: string | null
  materia_id: string
  topico_id: string | null
  aula_id: string | null
  ano: number | null
  dificuldade: QuestaoDificuldade
  enunciado: string
  imagem_url: string | null
  dica: string | null
  explicacao: string | null
  ativo: boolean
  criado_em: string
  atualizado_em: string
  alternativa_correta: string | null
}

export type QuestaoDetalhe = Questao & {
  alternativas: AlternativaQuestao[]
}

export type QuestaoResumo = Questao & {
  total_alternativas: number
}

export type GetQuestoesParams = {
  busca?: string
  materia_id?: string
  dificuldade?: QuestaoDificuldade
  ativo?: boolean
  pagina?: number
  limite?: number
  ordenar?: 'recentes' | 'enunciado-az' | 'enunciado-za'
}

export type GetQuestoesResponse = {
  sucesso: boolean
  pagina: number
  limite: number
  total_registros: number
  total_paginas: number
  total_questoes: number
  total_publicadas: number
  total_inativas: number
  total_alternativas: number
  questoes: QuestaoResumo[]
}

export type GetQuestaoResponse = {
  sucesso: boolean
  questao: QuestaoDetalhe
}

export type AlternativaPayload = {
  letra: AlternativaLetra
  texto: string
  correta: boolean
}

export type PostQuestaoParams = {
  tipo_prova_id?: string | null
  materia_id: string
  topico_id?: string | null
  aula_id?: string | null
  ano?: number | null
  dificuldade?: QuestaoDificuldade
  enunciado: string
  imagem_url?: string | null
  dica?: string | null
  explicacao?: string | null
  ativo?: boolean
  alternativas: AlternativaPayload[]
}

export type PostQuestaoResponse = {
  sucesso: boolean
  mensagem: string
  questao: QuestaoDetalhe
}

export type PatchQuestaoParams = Partial<PostQuestaoParams>

export type PatchQuestaoResponse = {
  sucesso: boolean
  mensagem: string
  questao: QuestaoDetalhe
}

export type DeleteQuestaoResponse = {
  sucesso: boolean
  mensagem: string
}

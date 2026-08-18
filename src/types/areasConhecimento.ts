export type AreaConhecimento = {
  id: string
  nome: string
  slug: string
  descricao: string | null
  ativo: boolean
  criado_em: string
}

export type GetAreasConhecimentoParams = {
  busca?: string
  ativo?: boolean
  pagina?: number
  limite?: number
}

export type GetAreasConhecimentoResponse = {
  sucesso: boolean
  pagina: number
  limite: number
  total_registros: number
  total_paginas: number
  areas: AreaConhecimento[]
}

export type GetAreasConhecimentoResumoResponse = {
  sucesso: boolean
  total_areas: number
  areas_ativas: number
  areas_inativas: number
}

export type GetAreaConhecimentoResponse = {
  sucesso: boolean
  area: AreaConhecimento
}

export type PostAreaConhecimentoParams = {
  nome: string
  descricao?: string | null
  ativo?: boolean
}

export type PostAreaConhecimentoResponse = {
  sucesso: boolean
  mensagem: string
  area: AreaConhecimento
}

export type PatchAreaConhecimentoParams = Partial<PostAreaConhecimentoParams>

export type PatchAreaConhecimentoResponse = {
  sucesso: boolean
  mensagem: string
  area: AreaConhecimento
}

export type DeleteAreaConhecimentoResponse = {
  sucesso: boolean
  mensagem: string
}

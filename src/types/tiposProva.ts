export type TipoProva = {
  id: string
  nome: string
  slug: string
  descricao: string | null
  ativo: boolean
  criado_em: string
}

export type GetTiposProvaParams = {
  busca?: string
  ativo?: boolean
  pagina?: number
  limite?: number
}

export type GetTiposProvaResponse = {
  sucesso: boolean
  pagina: number
  limite: number
  total_registros: number
  total_paginas: number
  tipos_prova: TipoProva[]
}

export type GetTiposProvaResumoResponse = {
  sucesso: boolean
  total_tipos_prova: number
  tipos_prova_ativos: number
  tipos_prova_inativos: number
}

export type GetTipoProvaResponse = {
  sucesso: boolean
  tipo_prova: TipoProva
}

export type PostTipoProvaParams = {
  nome: string
  descricao?: string | null
  ativo?: boolean
}

export type PostTipoProvaResponse = {
  sucesso: boolean
  mensagem: string
  tipo_prova: TipoProva
}

export type PatchTipoProvaParams = Partial<PostTipoProvaParams>

export type PatchTipoProvaResponse = {
  sucesso: boolean
  mensagem: string
  tipo_prova: TipoProva
}

export type DeleteTipoProvaResponse = {
  sucesso: boolean
  mensagem: string
}

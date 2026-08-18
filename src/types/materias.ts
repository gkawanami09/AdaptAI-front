import type { MateriaArea } from '../constants/materias'

export type Materias = {
  id: string
  nome: string
  area: MateriaArea
  cor?: string
  ordem?: number
  ativo: boolean
  total_topicos: number
  total_aulas: number
  slug?: string
  descricao?: string | null
}

export type Materia = {
  id: string
  nome: string
  area: MateriaArea
  icone: string
  cor: string
  ordem: number
  ativo: boolean
  // ainda não confirmados no contrato do backend — ver BACKEND_ADMIN_REQUIREMENTS.md
  slug?: string
  descricao?: string | null
}

export type GetMateriasResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    quantidade_pagina: number
    total_registros: number
    total_paginas: number
    materias: Materias[]
}

export type GetMateriasParams = {
    busca?: string
    area?: MateriaArea
    ativo?: boolean
    pagina?: number
    limite?: number
}

export type PostMateriasParams = {
  nome: string
  area: MateriaArea
  icone: string
  cor: string
  ordem: number
  ativo: boolean
  descricao?: string | null
}

export type PostMateriasResponse = {
  sucesso: boolean
  mensagem: string
  materia: Materia
}

export type GetMateriaResponse = {
  sucesso: boolean
  materia: Materia
}

export type PatchMateriaParams = Partial<PostMateriasParams>

export type PatchMateriaResponse = {
  sucesso: boolean
  mensagem: string
  materia: Materia
}

export type DeleteMateriaResponse = {
  sucesso: boolean
  mensagem: string
}

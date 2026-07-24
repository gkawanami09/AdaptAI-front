export type Materias = {
    id?: string,
    nome: string,
    slug: string,
    area: string,
    cor?: string,
    ordem?: number,
    ativo: boolean,
    total_topicos: number,
    total_aulas: number
}

export type Materia = {
  id: number
  nome: string
  slug: string
  area: string[]
  icone: string
  cor: string
  ordem: number
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
    area?: string
    ativo?: boolean
    pagina?: number
    limite?: number
}

export type PostMateriasParams = {
    nome: string
    slug: string
    area: string[]
    icone: string
    cor: string
    ordem: number
    ativo: boolean
}

export type PostMateriasResponse = {
  sucesso: boolean
  mensagem: string
  materia: Materia
}
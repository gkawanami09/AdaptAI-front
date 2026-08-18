import type { QuestaoDificuldade } from './questoes'

export type ListaTipo = 'fixa' | 'gerada_ia' | 'questoes_erradas' | 'favoritas' | 'revisao'

export type ItemLista = {
  questao_id: string
  ordem: number
}

export type Lista = {
  id: string
  usuario_id: string | null
  titulo: string
  descricao: string | null
  tipo_prova_id: string | null
  materia_id: string | null
  topico_id: string | null
  dificuldade: QuestaoDificuldade | null
  tipo_lista: ListaTipo
  criado_em: string
  atualizado_em: string
  criado_por: string | null
}

export type ListaResumo = Lista & {
  total_questoes: number
}

export type ListaDetalhe = Lista & {
  itens: ItemLista[]
}

export type GetListasParams = {
  busca?: string
  materia_id?: string
  tipo_lista?: ListaTipo
  pagina?: number
  limite?: number
  ordenar?: 'titulo-az' | 'titulo-za' | 'recentes'
}

export type GetListasResponse = {
  sucesso: boolean
  pagina: number
  limite: number
  total_registros: number
  total_paginas: number
  total_listas: number
  listas: ListaResumo[]
}

export type GetListaResponse = {
  sucesso: boolean
  lista: ListaDetalhe
}

export type ItemListaPayload = {
  questao_id: string
  ordem?: number
}

export type PostListaParams = {
  titulo: string
  descricao?: string | null
  tipo_prova_id?: string | null
  materia_id?: string | null
  topico_id?: string | null
  dificuldade?: QuestaoDificuldade | null
  tipo_lista: ListaTipo
  itens?: ItemListaPayload[]
}

export type PostListaResponse = {
  sucesso: boolean
  mensagem: string
  lista: ListaDetalhe
}

export type PatchListaParams = Partial<PostListaParams>

export type PatchListaResponse = {
  sucesso: boolean
  mensagem: string
  lista: ListaDetalhe
}

export type DeleteListaResponse = {
  sucesso: boolean
  mensagem: string
}


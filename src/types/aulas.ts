export type Aula = {
    id: string;
    materia_id: string;
    topico_id: string | null;
    titulo: string;
    slug: string;
    resumo: string | null;
    dificuldade: 'basico' | 'medio' | 'dificil';
    mais_cobrado: boolean;
    ordem: number;
    ativo: boolean;
}

export type GetAulasPorMateriaParams = {
    materia_id: string
}

export type GetAulasPorMateriaResponse = {
    sucesso: boolean;
    total_aulas: number;
    aulas: Aula[];
}

export type AulaDificuldade = 'basico' | 'medio' | 'dificil'
export type AulaConteudoTipo = 'video' | 'texto'

export type ConteudoTextoDados = {
    titulo: string
    descricao: string
}

export type ConteudoVideoDados = {
    titulo: string
    video_link: string
    descricao: string
}

export type AulaConteudo = {
    tipo: AulaConteudoTipo
    ordem: number
    duracao: number
    ativo: boolean
    texto: ConteudoTextoDados | null
    video: ConteudoVideoDados | null
}

export type AulaCriarParams = {
    materia_id: string
    topico_id: string | null
    titulo: string
    resumo: string | null
    dificuldade: AulaDificuldade
    mais_cobrado: boolean
    ordem: number
    ativo: boolean
    conteudos: AulaConteudo[]
}

export type PostAulaResponse = {
    sucesso: boolean
    aula: Aula
}

export type AulaDetalhe = Aula & {
    conteudos: AulaConteudo[]
}

export type GetAulaResponse = {
    sucesso: boolean
    aula: AulaDetalhe
}

export type AulaAtualizarParams = Omit<AulaCriarParams, 'materia_id' | 'topico_id'>

export type PatchAulaResponse = {
    sucesso: boolean
    aula: AulaDetalhe
}

export type AulaConteudoResumo = {
    tipo: AulaConteudoTipo
    ordem: number
    duracao: number
    ativo: boolean
}

export type AulaResumo = Aula & {
    conteudos: AulaConteudoResumo[]
}

export type GetAulasParams = {
    busca?: string
    dificuldade?: AulaDificuldade
    ativo?: boolean
    mais_cobrado?: boolean
    materia_id?: string
    pagina?: number
    limite?: number
    ordenar?: 'nome-az' | 'nome-za' | 'recentes'
}

export type GetAulasResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    total_registros: number
    total_paginas: number
    total_aulas: number
    total_conteudos: number
    total_publicadas: number
    total_mais_cobradas: number
    aulas: AulaResumo[]
}

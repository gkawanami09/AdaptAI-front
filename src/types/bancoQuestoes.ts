export type BancoQuestoesIconeCor = 'purple' | 'green' | 'blue' | 'gold' | 'red'
export type BancoQuestoesBadgeCor = 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
export type BancoQuestoesProgressoCor = 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'

export type BancoQuestoesFiltroOpcao = {
    value: string
    label: string
}

export type BancoQuestoesListaStatus = 'nao_iniciado' | 'em_andamento' | 'concluido'

export type BancoQuestoesLista = {
    id: string
    slug: string | null
    icone: string
    icone_cor: BancoQuestoesIconeCor
    titulo: string
    descricao?: string
    dificuldade: string
    dificuldade_cor: BancoQuestoesBadgeCor
    vestibular: string
    status: BancoQuestoesListaStatus
    questoes_totais: number
    questoes_concluidas: number
    questoes_corretas?: number
    progresso_cor: BancoQuestoesProgressoCor
    ultima_execucao_id?: string
}

export type BancoQuestoesRespondidaStatus = 'corretas' | 'erradas'

export type BancoQuestoesRespondida = {
    id: string
    lista_id: string
    lista_slug: string | null
    lista_titulo: string
    subject: string
    subjectColor: BancoQuestoesBadgeCor
    assunto?: string
    question: string
    vestibular: string
    dificuldade: string
    dificuldade_cor: BancoQuestoesBadgeCor
    correta: boolean
    resposta_aluno?: string
    resposta_correta?: string
    respondida_em?: string
}

export type BancoQuestoesPaginacao = {
    pagina: number
    limite: number
    total: number
    total_paginas: number
}

export type GetBancoQuestoesRespondidasParams = {
    status: BancoQuestoesRespondidaStatus
    vestibulares?: string[]
    dificuldades?: string[]
    materias?: string[]
    assuntos?: string[]
    apenas_favoritas?: boolean
    pagina?: number
    limite?: number
}

export type GetBancoQuestoesRespondidasResponse = {
    questoes: BancoQuestoesRespondida[]
    paginacao: BancoQuestoesPaginacao
}

export type GetBancoQuestoesFiltrosResponse = {
    vestibulares: BancoQuestoesFiltroOpcao[]
    dificuldades: BancoQuestoesFiltroOpcao[]
    materias: BancoQuestoesFiltroOpcao[]
    assuntos: BancoQuestoesFiltroOpcao[]
}

export type GetBancoQuestoesListasParams = {
    vestibulares?: string[]
    dificuldades?: string[]
    materias?: string[]
    apenas_favoritas?: boolean
}

export type GetBancoQuestoesListasResponse = {
    total: number
    listas: BancoQuestoesLista[]
}

export type PostGerarListaComIAResponse = {
    id: string
    slug: string | null
}

export type PostRefazerListaResponse = {
    execucao_id: string
    lista_id: string
    slug: string | null
    status: BancoQuestoesListaStatus
}

export type BancoQuestoesExecucaoResumo = {
    id: string
    lista_id: string
    lista_titulo: string
    status: BancoQuestoesListaStatus
    questoes_totais: number
    respondidas: number
    acertadas: number
    percentual_acerto?: number
}

export type BancoQuestoesRevisaoAlternativa = {
    letra: string
    texto: string
}

export type BancoQuestoesQuestaoRevisao = {
    id: string
    enunciado: string
    materia: string
    materia_cor: BancoQuestoesBadgeCor
    assunto?: string
    dificuldade?: string
    dificuldade_cor?: BancoQuestoesBadgeCor
    alternativas: BancoQuestoesRevisaoAlternativa[]
    resposta_aluno: string | null
    resposta_correta: string
    acertou: boolean
}

export type BancoQuestoesRevisaoStatusFiltro = 'todas' | 'acertada' | 'errada'

export type GetExecucaoRevisaoParams = {
    status?: BancoQuestoesRevisaoStatusFiltro
    materia?: string
    assunto?: string
    dificuldade?: string
    pagina?: number
    limite?: number
}

export type GetExecucaoRevisaoResponse = {
    execucao: BancoQuestoesExecucaoResumo
    questoes: BancoQuestoesQuestaoRevisao[]
    paginacao: BancoQuestoesPaginacao
}

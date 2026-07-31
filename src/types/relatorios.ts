export type RelatoriosPeriodo = '7d' | '30d' | '90d' | '12m'

export type GetRelatoriosParams = {
    periodo?: RelatoriosPeriodo
}

export type RelatoriosKpis = {
    total_usuarios: number
    total_usuarios_variacao_pct: number
    questoes_respondidas: number
    questoes_respondidas_variacao_pct: number
    listas_concluidas: number
    listas_concluidas_variacao_pct: number
    taxa_media_acerto_pct: number
    taxa_media_acerto_variacao_pct: number
}

export type RelatoriosSeriePonto = {
    data: string
    total: number
}

export type RelatoriosDificuldade = {
    dificuldade: 'facil' | 'medio' | 'dificil'
    total: number
    percentual: number
}

export type RelatoriosMateriaEstudada = {
    materia_id: string
    nome: string
    percentual: number
}

export type RelatoriosTipoProva = {
    tipo_prova_id: string
    nome: string
    percentual: number
}

export type RelatoriosAtividade = {
    id: string
    tipo: 'prova_criada' | 'lista_publicada' | 'questao_editada' | 'lista_concluida' | 'questao_criada'
    titulo: string
    descricao: string
    criado_em: string
}

export type RelatoriosRankingConteudo = {
    materia_id: string
    materia: string
    aula_id: string
    aula: string
    total_questoes: number
    taxa_acerto_pct: number
    tempo_medio_seg: number
    total_acessos: number
}

export type GetRelatoriosResponse = {
    sucesso: boolean
    kpis: RelatoriosKpis
    questoes_por_dia: RelatoriosSeriePonto[]
    distribuicao_dificuldade: RelatoriosDificuldade[]
    materias_mais_estudadas: RelatoriosMateriaEstudada[]
    tipos_prova: RelatoriosTipoProva[]
    atividades_recentes: RelatoriosAtividade[]
}

export type GetRankingConteudosParams = {
    periodo?: RelatoriosPeriodo
    pagina?: number
    limite?: number
}

export type GetRankingConteudosResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    total_paginas: number
    total_registros: number
    ranking: RelatoriosRankingConteudo[]
}

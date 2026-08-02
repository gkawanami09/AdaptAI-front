export type DashboardPeriodo = '7d' | '30d' | '90d' | '12m'

export type DashboardKpis = {
    total_usuarios: number
    total_usuarios_variacao_pct: number
    questoes_respondidas: number
    questoes_respondidas_variacao_pct: number
    provas_realizadas: number
    provas_realizadas_variacao_pct: number
    ofensiva_media_dias: number
    ofensiva_media_variacao_dias: number
}

export type DashboardCrescimentoPonto = {
    data: string
    usuarios: number
    questoes_respondidas: number
    listas_concluidas: number
    provas_realizadas: number
}

export type DashboardAtividadeHoje = {
    usuarios_online: number
    questoes_respondidas: number
    novos_cadastros: number
    provas_iniciadas: number
    tempo_medio_estudo_min: number
}

export type DashboardAtividadeRecente = {
    id: string
    tipo: 'materia_criada' | 'questao_editada' | 'usuario_suspenso' | 'prova_criada' | 'lista_publicada'
    titulo: string
    descricao: string
    criado_em: string
}

export type DashboardConteudoResumo = {
    questoes: number
    aulas: number
    topicos: number
    materias: number
    provas: number
    listas: number
}

export type DashboardAlerta = {
    id: string
    tipo: 'storage' | 'provas_sem_questoes' | 'aulas_sem_conteudo' | 'usuarios_denunciados' | 'integracoes_desconectadas'
    severidade: 'alta' | 'media'
    descricao: string
    detalhe?: string
    link: string
}

export type GetDashboardParams = {
    periodo?: DashboardPeriodo
}

export type GetDashboardResponse = {
    sucesso: boolean
    kpis: DashboardKpis
    crescimento: DashboardCrescimentoPonto[]
    atividade_hoje: DashboardAtividadeHoje
    atividades_recentes: DashboardAtividadeRecente[]
    conteudo: DashboardConteudoResumo
    alertas: DashboardAlerta[]
}

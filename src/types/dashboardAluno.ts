export type DashboardAlunoResumo = {
    tempo_estudado_min: number
    tarefas_concluidas: number
    tarefas_totais: number
    xp_semana: number
    ofensiva_dias: number
}

export type DashboardAlunoEvolucaoPonto = {
    dia_semana: string
    percentual: number
}

export type DashboardAlunoDesempenhoMateria = {
    materia_id: string
    materia: string
    percentual: number
    cor: 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'purple'
}

export type DashboardAlunoPlanoStatus = 'concluido' | 'em-andamento' | 'nao-iniciado'

export type DashboardAlunoPlanoItemTipo = 'aula' | 'questoes' | 'lista' | 'prova' | 'redacao' | 'revisao'

export type DashboardAlunoPlanoItem = {
    id: string
    icone: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue'
    status: DashboardAlunoPlanoStatus
    titulo: string
    duracao_min: number
    progresso?: number
    tipo: DashboardAlunoPlanoItemTipo
    conteudo_slug: string | null
}

export type DashboardAlunoAlerta = {
    id: string
    titulo: string
    mensagem: string
}

export type GetDashboardAlunoResponse = {
    resumo: DashboardAlunoResumo
    evolucao_semanal: DashboardAlunoEvolucaoPonto[]
    desempenho_por_materia: DashboardAlunoDesempenhoMateria[]
    plano_do_dia: DashboardAlunoPlanoItem[]
    alertas: DashboardAlunoAlerta[]
}

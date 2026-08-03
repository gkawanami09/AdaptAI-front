export type PlanoEstudosPeriodo = 'dia' | 'semana' | 'mes'

export type PlanoEstudosProgresso = {
    percentual: number
    label: string
}

export type PlanoEstudosDia = {
    label: string
    data: number
    data_iso: string
    tem_tarefas: boolean
}

export type PlanoEstudosTarefaTipo = 'aula' | 'questoes' | 'lista' | 'prova' | 'redacao' | 'revisao'

export type PlanoEstudosTarefa = {
    id: string
    icone: string
    icone_cor: 'purple' | 'green' | 'blue' | 'gold' | 'red'
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    duracao_min: number
    concluida: boolean
    progresso?: number
    tipo: PlanoEstudosTarefaTipo
}

export type PlanoEstudosVisaoGeralBadge = {
    label: string
    color: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
}

export type PlanoEstudosVisaoGeralDia = {
    dia: string
    badges: PlanoEstudosVisaoGeralBadge[]
    descanso_label?: string
    concluidas: number
    total: number
}

export type PlanoEstudosPrioridade = {
    materia: string
    descricao: string
    prioridade: 'alta' | 'media'
    tom: 'blue' | 'purple' | 'gold'
    icone?: string
}

export type PlanoEstudosEstatistica = {
    label: string
    valor: string
    cor: 'purple' | 'teal' | 'gold'
}

export type GetPlanoEstudosParams = {
    periodo: PlanoEstudosPeriodo
    data: string
}

export type GetPlanoEstudosResponse = {
    intervalo_label: string
    tarefas_concluidas_total: number
    tarefas_totais: number
    progresso: PlanoEstudosProgresso
    dias_da_semana: PlanoEstudosDia[]
    tarefas_do_dia: PlanoEstudosTarefa[]
    visao_geral_semana: PlanoEstudosVisaoGeralDia[]
    prioridades_da_semana: PlanoEstudosPrioridade[]
    estatisticas: PlanoEstudosEstatistica[]
}

export type PostReorganizarPlanoResponse = {
    sucesso: boolean
}

export type PatchConcluirTarefaResponse = {
    sucesso: boolean
}

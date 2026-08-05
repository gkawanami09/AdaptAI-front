export type ProgressoResumo = {
    meta_mensal_percentual: number
    horas_estudadas: string
    ofensiva_dias: number
    xp_total: number
}

export type ProgressoEvolucaoSerie = {
    name: string
    color: 'blue' | 'green' | 'red'
    values: number[]
}

export type ProgressoEvolucaoAcertos = {
    categories: string[]
    series: ProgressoEvolucaoSerie[]
}

export type ProgressoHorasPorDia = {
    label: string
    value: number
}

export type ProgressoCor = 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'

export type ProgressoRankingMateria = {
    label: string
    percent: number
    color: ProgressoCor
}

export type ProgressoHeatmap = {
    weekday_labels: string[]
    weeks: number[][]
}

export type ProgressoMetaMensal = {
    label: string
    value: number
    target: number
    color: ProgressoCor
}

export type GetProgressoResponse = {
    resumo: ProgressoResumo
    evolucao_acertos: ProgressoEvolucaoAcertos
    horas_por_dia: ProgressoHorasPorDia[]
    ranking_materias: ProgressoRankingMateria[]
    heatmap: ProgressoHeatmap
    metas_mensais: ProgressoMetaMensal[]
}

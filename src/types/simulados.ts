export type SimuladosResumo = {
    nota_estimada: number
    tempo_medio: string
    taxa_acerto_percentual: number
}

export type SimuladoCatalogoItem = {
    slug: string
    titulo: string
    descricao: string
    icone: string
    icone_cor: 'purple' | 'green' | 'blue' | 'gold' | 'red'
    tag: string
    tag_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    duracao: string
}

export type SimuladoHistoricoItem = {
    id: string
    dia: string
    titulo: string
    tempo: string
    nota: number
    acertos_percentual: number
}

export type GetSimuladosResponse = {
    resumo: SimuladosResumo
    catalogo: SimuladoCatalogoItem[]
    historico: SimuladoHistoricoItem[]
}

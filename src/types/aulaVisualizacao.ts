export type AulaVisualizacaoStatus = 'concluida' | 'em-andamento' | 'nao-iniciada'

export type AulaVisualizacaoConceito = {
    id: string
    label: string
    concluido: boolean
}

export type AulaVisualizacaoModuloAula = {
    ordem: number
    titulo: string
    status: 'concluida' | 'atual' | 'bloqueada'
}

export type AulaVisualizacaoModulo = {
    titulo: string
    aulas: AulaVisualizacaoModuloAula[]
}

export type AulaVisualizacaoProximaAula = {
    slug: string
    titulo: string
    duracao_min: number
    dificuldade: string
} | null

export type GetAulaVisualizacaoResponse = {
    slug: string
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    duracao_min: number
    dificuldade: string
    progresso: number
    status: AulaVisualizacaoStatus
    video_url: string | null
    resumo: string[]
    conceitos: AulaVisualizacaoConceito[]
    modulo: AulaVisualizacaoModulo | null
    proxima_aula: AulaVisualizacaoProximaAula
    dica_ada: string | null
}

export type PatchAulaConcluirResponse = GetAulaVisualizacaoResponse

export type PatchAulaProgressoParams = {
    progresso: number
}

export type PatchAulaProgressoResponse = {
    slug: string
    progresso: number
    status: AulaVisualizacaoStatus
}

export type PatchAulaConceitoParams = {
    concluido: boolean
}

export type PatchAulaConceitoResponse = {
    id: string
    label: string
    concluido: boolean
}

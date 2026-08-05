export type QuestoesVisualizacaoStatus = 'em_andamento' | 'finalizada'

export type QuestoesVisualizacaoQuestao = {
    id: string
    subject: string
    subjectColor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    examInfo: string
    question: string
    options: string[]
    hint: string
    respondida: boolean
    opcaoSelecionada: number | null
    correta: boolean | null
    favorita: boolean
}

export type GetListaQuestoesResponse = {
    slug: string
    titulo: string
    materia: string
    dificuldade: string
    vestibular: string
    status: QuestoesVisualizacaoStatus
    questoes_totais: number
    questoes_concluidas: number
    progresso_percentual: number
    questoes: QuestoesVisualizacaoQuestao[]
}

export type ResponderQuestaoPayload = {
    opcao_selecionada: number
}

export type ResponderQuestaoResponse = {
    id: string
    respondida: boolean
    opcaoSelecionada: number | null
    correta: boolean | null
    questoes_concluidas: number
    progresso_percentual: number
}

export type FavoritarQuestaoResponse = {
    id: string
    favorita: boolean
}

export type FinalizarListaResponse = {
    status: QuestoesVisualizacaoStatus
    progresso_percentual: number
    questoes_concluidas: number
    questoes_totais: number
}

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
    duracao_minutos?: number
    total_questoes?: number
    materias?: string[]
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

export type TentativaSimuladoStatus = 'em_andamento' | 'concluida' | 'expirada' | 'cancelada'

export type SimuladoAlternativa = {
    id: string
    texto: string
}

export type SimuladoQuestaoTentativa = {
    id: string
    numero: number
    materia: string
    materia_cor?: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    enunciado: string
    alternativas: SimuladoAlternativa[]
    alternativa_marcada?: string | null
}

export type PostIniciarTentativaResponse = {
    id: string
    simulado: { slug: string; nome: string }
    status: TentativaSimuladoStatus
    iniciado_em: string
    tempo_limite_segundos: number
    total_questoes: number
    questao_atual: number
    questoes: SimuladoQuestaoTentativa[]
}

export type GetTentativaResponse = {
    id: string
    simulado: { slug: string; nome: string }
    status: TentativaSimuladoStatus
    iniciado_em: string
    tempo_limite_segundos: number
    tempo_gasto_segundos: number
    total_questoes: number
    respondidas: number
    questoes: SimuladoQuestaoTentativa[]
}

export type PostResponderQuestaoSimuladoPayload = {
    questao_id: string
    alternativa_id: string
}

export type PostResponderQuestaoSimuladoResponse = {
    questao_id: string
    alternativa_id: string
    salva: boolean
}

export type SimuladoDesempenhoMateria = {
    materia: string
    total: number
    acertos: number
    erros: number
    percentual_acerto: number
}

export type PostFinalizarTentativaResponse = {
    id: string
    status: TentativaSimuladoStatus
    total_questoes: number
    respondidas: number
    acertos: number
    erros: number
    nao_respondidas: number
    percentual_acerto: number
    tempo_gasto_segundos: number
    desempenho_materias: SimuladoDesempenhoMateria[]
}

export type GetResultadoTentativaResponse = {
    id: string
    simulado: { slug: string; nome: string }
    status: TentativaSimuladoStatus
    total_questoes: number
    respondidas: number
    acertos: number
    erros: number
    nao_respondidas: number
    percentual_acerto: number
    tempo_gasto_segundos: number
    desempenho_materias: SimuladoDesempenhoMateria[]
    iniciado_em: string
    finalizado_em: string | null
}

export type SimuladoRevisaoQuestao = {
    numero: number
    questao_id: string
    materia: string
    enunciado: string
    alternativas: SimuladoAlternativa[]
    alternativa_correta: string
    alternativa_marcada: string | null
    acertou: boolean
    explicacao?: string
}

export type GetRevisaoTentativaResponse = {
    id: string
    questoes: SimuladoRevisaoQuestao[]
}

export type HistoricoTentativaItem = {
    id: string
    simulado_slug: string
    simulado_nome: string
    status: TentativaSimuladoStatus
    data: string
    total_questoes: number
    acertos: number
    percentual_acerto: number
    tempo_gasto_segundos: number
}

export type GetHistoricoTentativasResponse = {
    tentativas: HistoricoTentativaItem[]
}

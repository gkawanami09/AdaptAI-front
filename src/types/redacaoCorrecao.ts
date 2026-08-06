import type { CardIconColor } from '../components/cards/CardIcon'

export type RedacaoCorrecaoStatus = 'pendente' | 'processando' | 'concluida' | 'erro'

export type RedacaoCompetenciaNota = {
    number: number
    title: string
    description: string
    color: CardIconColor
    nota: number
    notaMaxima: number
}

export type RedacaoInsight = {
    id: string
    icon: string
    iconColor: CardIconColor
    title: string
    description: string
}

export type RedacaoPontoMelhoria = {
    id: string
    icon: string
    iconColor: CardIconColor
    title: string
    description: string
}

export type RedacaoRepertorioSugerido = {
    id: string
    nome: string
    descricao: string
}

export type GetRedacaoCorrecaoResponse = {
    id: string
    slug: string
    status: RedacaoCorrecaoStatus
    notaTotal: number
    notaMaxima: number
    statusLabel: string
    mensagemMotivacional: string
    competencias: RedacaoCompetenciaNota[]
    insights: RedacaoInsight[]
    pontosMelhoria: RedacaoPontoMelhoria[]
    repertoriosSugeridos: RedacaoRepertorioSugerido[]
    resumoAda: string
}

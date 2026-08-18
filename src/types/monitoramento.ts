export type RotaMonitorada = {
    rota: string
    metodo: string
    latencia_media_ms: number
    taxa_erro_pct: number
    total_requisicoes: number
}

export type OperacaoIaMonitorada = {
    operacao: string
    latencia_media_ms: number
    taxa_erro_pct: number
    total_chamadas: number
}

export type GetMonitoramentoResponse = {
    sucesso: boolean
    rotas: RotaMonitorada[]
    operacoes_ia: OperacaoIaMonitorada[]
}

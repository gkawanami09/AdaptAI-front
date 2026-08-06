import { requestAuthJson } from "./api"

import type { GetRedacaoCorrecaoResponse } from "../types/redacaoCorrecao"

const API_REDACAO_ENVIOS_PREFIX = "/aluno/redacao/envios"

// Consulta o status/resultado da correção feita pela IA. A tela de processamento
// (RedacaoProcessando) chama esta função em polling até `status` chegar em
// "concluida". TODO: se o backend passar a oferecer websocket, substituir o
// polling por uma assinatura do evento "correcao_concluida".
export function getRedacaoCorrecao(envioId: string): Promise<GetRedacaoCorrecaoResponse> {
    return requestAuthJson<GetRedacaoCorrecaoResponse>(`${API_REDACAO_ENVIOS_PREFIX}/${envioId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

import { requestAuthJson } from "./api"

import type {
    GetListaQuestoesResponse,
    ResponderQuestaoPayload,
    ResponderQuestaoResponse,
    FavoritarQuestaoResponse,
    FinalizarListaResponse,
} from "../types/questoesVisualizacao"

const API_QUESTOES_PREFIX = "/aluno/questoes"

export function getListaQuestoes(slug: string): Promise<GetListaQuestoesResponse> {
    return requestAuthJson<GetListaQuestoesResponse>(`${API_QUESTOES_PREFIX}/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function responderQuestao(slug: string, questaoId: string, payload: ResponderQuestaoPayload): Promise<ResponderQuestaoResponse> {
    return requestAuthJson<ResponderQuestaoResponse>(`${API_QUESTOES_PREFIX}/${slug}/questoes/${questaoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function favoritarQuestao(questaoId: string): Promise<FavoritarQuestaoResponse> {
    return requestAuthJson<FavoritarQuestaoResponse>(`${API_QUESTOES_PREFIX}/favoritos/${questaoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function finalizarLista(slug: string): Promise<FinalizarListaResponse> {
    return requestAuthJson<FinalizarListaResponse>(`${API_QUESTOES_PREFIX}/${slug}/finalizar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

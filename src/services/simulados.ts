import { requestAuthJson } from "./api"

import type {
    GetHistoricoTentativasResponse,
    GetResultadoTentativaResponse,
    GetRevisaoTentativaResponse,
    GetSimuladosResponse,
    GetTentativaResponse,
    PostFinalizarTentativaResponse,
    PostIniciarTentativaResponse,
    PostResponderQuestaoSimuladoPayload,
    PostResponderQuestaoSimuladoResponse,
} from "../types/simulados"

const API_SIMULADOS_PREFIX = "/aluno/simulados"

export function getSimulados(): Promise<GetSimuladosResponse> {
    return requestAuthJson<GetSimuladosResponse>(API_SIMULADOS_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postIniciarTentativa(slug: string): Promise<PostIniciarTentativaResponse> {
    return requestAuthJson<PostIniciarTentativaResponse>(`${API_SIMULADOS_PREFIX}/${slug}/tentativas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
}

export function getTentativa(tentativaId: string): Promise<GetTentativaResponse> {
    return requestAuthJson<GetTentativaResponse>(`${API_SIMULADOS_PREFIX}/tentativas/${tentativaId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postResponderQuestaoSimulado(
    tentativaId: string,
    payload: PostResponderQuestaoSimuladoPayload
): Promise<PostResponderQuestaoSimuladoResponse> {
    return requestAuthJson<PostResponderQuestaoSimuladoResponse>(`${API_SIMULADOS_PREFIX}/tentativas/${tentativaId}/respostas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function postFinalizarTentativa(tentativaId: string): Promise<PostFinalizarTentativaResponse> {
    return requestAuthJson<PostFinalizarTentativaResponse>(`${API_SIMULADOS_PREFIX}/tentativas/${tentativaId}/finalizar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
}

export function getResultadoTentativa(tentativaId: string): Promise<GetResultadoTentativaResponse> {
    return requestAuthJson<GetResultadoTentativaResponse>(`${API_SIMULADOS_PREFIX}/tentativas/${tentativaId}/resultado`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getRevisaoTentativa(tentativaId: string): Promise<GetRevisaoTentativaResponse> {
    return requestAuthJson<GetRevisaoTentativaResponse>(`${API_SIMULADOS_PREFIX}/tentativas/${tentativaId}/revisao`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getHistoricoTentativas(): Promise<GetHistoricoTentativasResponse> {
    return requestAuthJson<GetHistoricoTentativasResponse>(`${API_SIMULADOS_PREFIX}/tentativas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

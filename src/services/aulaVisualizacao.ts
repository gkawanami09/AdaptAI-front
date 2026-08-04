import { requestAuthJson } from "./api"

import type {
    GetAulaVisualizacaoResponse,
    PatchAulaConceitoParams,
    PatchAulaConceitoResponse,
    PatchAulaConcluirResponse,
    PatchAulaProgressoParams,
    PatchAulaProgressoResponse,
} from "../types/aulaVisualizacao"

const API_AULA_VISUALIZACAO_PREFIX = "/aluno/aulas"

export function getAula(slug: string): Promise<GetAulaVisualizacaoResponse> {
    return requestAuthJson<GetAulaVisualizacaoResponse>(`${API_AULA_VISUALIZACAO_PREFIX}/${slug}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function marcarAulaConcluida(slug: string): Promise<PatchAulaConcluirResponse> {
    return requestAuthJson<PatchAulaConcluirResponse>(`${API_AULA_VISUALIZACAO_PREFIX}/${slug}/concluir`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function atualizarProgressoAula(slug: string, progresso: number): Promise<PatchAulaProgressoResponse> {
    const params: PatchAulaProgressoParams = { progresso }

    return requestAuthJson<PatchAulaProgressoResponse>(`${API_AULA_VISUALIZACAO_PREFIX}/${slug}/progresso`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function marcarConceito(slug: string, conceitoId: string, concluido: boolean): Promise<PatchAulaConceitoResponse> {
    const params: PatchAulaConceitoParams = { concluido }

    return requestAuthJson<PatchAulaConceitoResponse>(`${API_AULA_VISUALIZACAO_PREFIX}/${slug}/conceitos/${conceitoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

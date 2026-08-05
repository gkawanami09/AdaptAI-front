import { requestAuthJson } from "./api"

import type {
    GetConfiguracoesAlunoResponse,
    PatchNotificacaoAlunoPayload,
    PatchNotificacaoAlunoResponse,
    PatchMetasAlunoPayload,
    PatchMetasAlunoResponse,
    PatchAparenciaAlunoPayload,
    PatchAparenciaAlunoResponse,
} from "../types/configuracoesAluno"

const API_CONFIGURACOES_ALUNO_PREFIX = "/aluno/configuracoes"

export function getConfiguracoesAluno(): Promise<GetConfiguracoesAlunoResponse> {
    return requestAuthJson<GetConfiguracoesAlunoResponse>(API_CONFIGURACOES_ALUNO_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function patchNotificacaoAluno(payload: PatchNotificacaoAlunoPayload): Promise<PatchNotificacaoAlunoResponse> {
    return requestAuthJson<PatchNotificacaoAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/notificacoes`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function patchMetasAluno(payload: PatchMetasAlunoPayload): Promise<PatchMetasAlunoResponse> {
    return requestAuthJson<PatchMetasAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/metas`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function patchAparenciaAluno(payload: PatchAparenciaAlunoPayload): Promise<PatchAparenciaAlunoResponse> {
    return requestAuthJson<PatchAparenciaAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/aparencia`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

import { requestAuthJson } from "./api"

import type {
    GetConfiguracoesAlunoResponse,
    PatchNotificacaoAlunoPayload,
    PatchNotificacaoAlunoResponse,
    PatchAparenciaAlunoPayload,
    PatchAparenciaAlunoResponse,
    PatchPerfilAlunoPayload,
    PatchPerfilAlunoResponse,
    UploadAvatarAlunoResponse,
    AlterarSenhaAlunoPayload,
    AlterarSenhaAlunoResponse,
    ExcluirContaAlunoPayload,
    DadosIAResponse,
    PatchDadoIAPayload,
    PatchDadoIAResponse,
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

export function patchAparenciaAluno(payload: PatchAparenciaAlunoPayload): Promise<PatchAparenciaAlunoResponse> {
    return requestAuthJson<PatchAparenciaAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/aparencia`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function patchPerfilAluno(payload: PatchPerfilAlunoPayload): Promise<PatchPerfilAlunoResponse> {
    return requestAuthJson<PatchPerfilAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/perfil`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function uploadAvatarAluno(arquivo: File): Promise<UploadAvatarAlunoResponse> {
    const formData = new FormData()
    formData.append("avatar", arquivo)

    return requestAuthJson<UploadAvatarAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/avatar`, {
        method: "POST",
        body: formData
    })
}

export function alterarSenhaAluno(payload: AlterarSenhaAlunoPayload): Promise<AlterarSenhaAlunoResponse> {
    return requestAuthJson<AlterarSenhaAlunoResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/senha`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function excluirContaAluno(payload: ExcluirContaAlunoPayload): Promise<void> {
    return requestAuthJson<void>("/aluno/conta", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

export function getDadosIAAluno(): Promise<DadosIAResponse> {
    return requestAuthJson<DadosIAResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/dados-ia`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function patchDadoIAAluno(payload: PatchDadoIAPayload): Promise<PatchDadoIAResponse> {
    return requestAuthJson<PatchDadoIAResponse>(`${API_CONFIGURACOES_ALUNO_PREFIX}/dados-ia`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
}

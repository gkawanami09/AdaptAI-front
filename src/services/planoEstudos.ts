import { requestAuthJson } from "./api"

import type {
    GetPlanoEstudosParams,
    GetPlanoEstudosResponse,
    PatchConcluirTarefaResponse,
    PostReorganizarPlanoResponse,
} from "../types/planoEstudos"
import type {
    GetPlanoEstudosOpcoesResponse,
    GetPlanoEstudosGeradoResponse,
    PostCriarPlanoEstudosParams,
    PostCriarPlanoEstudosResponse,
} from "../types/planoEstudosCriar"

const API_PLANO_ESTUDOS_PREFIX = "/aluno/plano-estudos"

export function getPlanoEstudos(params: GetPlanoEstudosParams): Promise<GetPlanoEstudosResponse> {
    const query = new URLSearchParams()
    query.set("periodo", params.periodo)
    query.set("data", params.data)

    return requestAuthJson<GetPlanoEstudosResponse>(`${API_PLANO_ESTUDOS_PREFIX}?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postReorganizarPlanoComIA(): Promise<PostReorganizarPlanoResponse> {
    return requestAuthJson<PostReorganizarPlanoResponse>(`${API_PLANO_ESTUDOS_PREFIX}/reorganizar-ia`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function patchConcluirTarefa(tarefaId: string): Promise<PatchConcluirTarefaResponse> {
    return requestAuthJson<PatchConcluirTarefaResponse>(`${API_PLANO_ESTUDOS_PREFIX}/tarefas/${tarefaId}/concluir`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// criação de plano de estudos personalizado (etapa 1-5 do wizard)
export function getOpcoesPlanoEstudos(): Promise<GetPlanoEstudosOpcoesResponse> {
    return requestAuthJson<GetPlanoEstudosOpcoesResponse>(`${API_PLANO_ESTUDOS_PREFIX}/opcoes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postCriarPlanoEstudos(params: PostCriarPlanoEstudosParams): Promise<PostCriarPlanoEstudosResponse> {
    return requestAuthJson<PostCriarPlanoEstudosResponse>(API_PLANO_ESTUDOS_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// preparado para consulta assíncrona do plano gerado pela IA no backend
export function getPlanoEstudosGerado(id: string): Promise<GetPlanoEstudosGeradoResponse> {
    return requestAuthJson<GetPlanoEstudosGeradoResponse>(`${API_PLANO_ESTUDOS_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

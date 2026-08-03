import { requestAuthJson } from "./api"

import type {
    GetPlanoEstudosParams,
    GetPlanoEstudosResponse,
    PatchConcluirTarefaResponse,
    PostReorganizarPlanoResponse,
} from "../types/planoEstudos"

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

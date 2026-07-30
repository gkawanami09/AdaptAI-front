import { requestAuthJson } from "./api"

import type { GetQuestoesParams, GetQuestoesResponse, GetQuestaoResponse, PostQuestaoParams, PostQuestaoResponse, PatchQuestaoParams, PatchQuestaoResponse, DeleteQuestaoResponse } from "../types/questoes"

const API_QUESTOES_PREFIX = "/admin/questoes"

// get functions
export function getQuestoes(params: GetQuestoesParams = {}): Promise<GetQuestoesResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.materia_id) query.set("materia_id", params.materia_id)
    if (params.dificuldade) query.set("dificuldade", params.dificuldade)
    if (params.ativo !== undefined) query.set("ativo", String(params.ativo))
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))
    if (params.ordenar) query.set("ordenar", params.ordenar)

    const queryString = query.toString()

    return requestAuthJson<GetQuestoesResponse>(API_QUESTOES_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getQuestaoPorId(id: string): Promise<GetQuestaoResponse> {
    return requestAuthJson<GetQuestaoResponse>(`${API_QUESTOES_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

//post functions
export function postQuestao(params: PostQuestaoParams) {
    return requestAuthJson<PostQuestaoResponse>(API_QUESTOES_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// patch functions
export function patchQuestao(id: string, params: PatchQuestaoParams) {
    return requestAuthJson<PatchQuestaoResponse>(`${API_QUESTOES_PREFIX}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// delete functions
export function deleteQuestao(id: string) {
    return requestAuthJson<DeleteQuestaoResponse>(`${API_QUESTOES_PREFIX}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

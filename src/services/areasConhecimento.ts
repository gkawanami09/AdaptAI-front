import { requestAuthJson } from "./api"

import type {
    GetAreasConhecimentoParams,
    GetAreasConhecimentoResponse,
    GetAreasConhecimentoResumoResponse,
    GetAreaConhecimentoResponse,
    PostAreaConhecimentoParams,
    PostAreaConhecimentoResponse,
    PatchAreaConhecimentoParams,
    PatchAreaConhecimentoResponse,
    DeleteAreaConhecimentoResponse,
} from "../types/areasConhecimento"

const API_AREAS_CONHECIMENTO_PREFIX = "/admin/areas-conhecimento"

// get functions
export function getAreasConhecimento(params: GetAreasConhecimentoParams = {}): Promise<GetAreasConhecimentoResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.ativo !== undefined) query.set("ativo", String(params.ativo))
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetAreasConhecimentoResponse>(API_AREAS_CONHECIMENTO_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getAreasConhecimentoResumo(): Promise<GetAreasConhecimentoResumoResponse> {
    return requestAuthJson<GetAreasConhecimentoResumoResponse>(`${API_AREAS_CONHECIMENTO_PREFIX}/resumo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getAreaConhecimentoPorId(id: string): Promise<GetAreaConhecimentoResponse> {
    return requestAuthJson<GetAreaConhecimentoResponse>(`${API_AREAS_CONHECIMENTO_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// post functions
export function postAreaConhecimento(params: PostAreaConhecimentoParams) {
    return requestAuthJson<PostAreaConhecimentoResponse>(API_AREAS_CONHECIMENTO_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// patch functions
export function patchAreaConhecimento(id: string, params: PatchAreaConhecimentoParams) {
    return requestAuthJson<PatchAreaConhecimentoResponse>(`${API_AREAS_CONHECIMENTO_PREFIX}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// delete functions
export function deleteAreaConhecimento(id: string) {
    return requestAuthJson<DeleteAreaConhecimentoResponse>(`${API_AREAS_CONHECIMENTO_PREFIX}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

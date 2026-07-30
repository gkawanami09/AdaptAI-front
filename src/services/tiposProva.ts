import { requestAuthJson } from "./api"

import type { GetTiposProvaParams, GetTiposProvaResponse, GetTiposProvaResumoResponse, GetTipoProvaResponse, PostTipoProvaParams, PostTipoProvaResponse, PatchTipoProvaParams, PatchTipoProvaResponse, DeleteTipoProvaResponse } from "../types/tiposProva"

const API_TIPOS_PROVA_PREFIX = "/admin/tipos-prova"

// get functions
export function getTiposProva(params: GetTiposProvaParams = {}): Promise<GetTiposProvaResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.ativo !== undefined) query.set("ativo", String(params.ativo))
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetTiposProvaResponse>(API_TIPOS_PROVA_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getTiposProvaResumo(): Promise<GetTiposProvaResumoResponse> {
    return requestAuthJson<GetTiposProvaResumoResponse>(`${API_TIPOS_PROVA_PREFIX}/resumo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getTipoProvaPorId(id: string): Promise<GetTipoProvaResponse> {
    return requestAuthJson<GetTipoProvaResponse>(`${API_TIPOS_PROVA_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

//post functions
export function postTipoProva(params: PostTipoProvaParams) {
    return requestAuthJson<PostTipoProvaResponse>(API_TIPOS_PROVA_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// patch functions
export function patchTipoProva(id: string, params: PatchTipoProvaParams) {
    return requestAuthJson<PatchTipoProvaResponse>(`${API_TIPOS_PROVA_PREFIX}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// delete functions
export function deleteTipoProva(id: string) {
    return requestAuthJson<DeleteTipoProvaResponse>(`${API_TIPOS_PROVA_PREFIX}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

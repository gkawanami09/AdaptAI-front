import { requestAuthJson } from "./api"

import type {
    GetListasParams, GetListasResponse, GetListaResponse,
    PostListaParams, PostListaResponse,
    PatchListaParams, PatchListaResponse,
    DeleteListaResponse,
    AdicionarItemParams, AdicionarItemResponse,
    RemoverItemResponse,
    ReordenarItensParams, ReordenarItensResponse
} from "../types/listas"

const API_LISTAS_PREFIX = "/admin/listas-questoes"

// get functions
export function getListas(params: GetListasParams = {}): Promise<GetListasResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.materia_id) query.set("materia_id", params.materia_id)
    if (params.tipo_lista) query.set("tipo_lista", params.tipo_lista)
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))
    if (params.ordenar) query.set("ordenar", params.ordenar)

    const queryString = query.toString()

    return requestAuthJson<GetListasResponse>(API_LISTAS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getListaPorId(id: string): Promise<GetListaResponse> {
    return requestAuthJson<GetListaResponse>(`${API_LISTAS_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

//post functions
export function postLista(params: PostListaParams) {
    return requestAuthJson<PostListaResponse>(API_LISTAS_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// patch functions
export function patchLista(id: string, params: PatchListaParams) {
    return requestAuthJson<PatchListaResponse>(`${API_LISTAS_PREFIX}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// delete functions
export function deleteLista(id: string) {
    return requestAuthJson<DeleteListaResponse>(`${API_LISTAS_PREFIX}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// itens da lista
export function adicionarItemLista(listaId: string, params: AdicionarItemParams) {
    return requestAuthJson<AdicionarItemResponse>(`${API_LISTAS_PREFIX}/${listaId}/itens`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function removerItemLista(listaId: string, questaoId: string) {
    return requestAuthJson<RemoverItemResponse>(`${API_LISTAS_PREFIX}/${listaId}/itens/${questaoId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function reordenarItensLista(listaId: string, params: ReordenarItensParams) {
    return requestAuthJson<ReordenarItensResponse>(`${API_LISTAS_PREFIX}/${listaId}/itens/ordem`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

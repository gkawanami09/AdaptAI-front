import { requestAuthJson } from "./api"

import type { GetMateriasParams } from "../types/materias"
import type { GetMateriasResponse } from "../types/materias"
import type { GetMateriaResponse } from "../types/materias"
import type { PostMateriasParams } from "../types/materias"
import type { PostMateriasResponse } from "../types/materias"
import type { PutMateriasParams } from "../types/materias"
import type { PutMateriasResponse } from "../types/materias"

const API_MATERIAS_PREFIX = "/admin/materias"

// get functions
export function getMaterias(params: GetMateriasParams = {}): Promise<GetMateriasResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.area) query.set("area", params.area)
    if (params.ativo !== undefined) query.set("ativo", String(params.ativo))
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetMateriasResponse>(API_MATERIAS_PREFIX + "/" + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getMateriaPorId(id: string): Promise<GetMateriaResponse> {
    return requestAuthJson<GetMateriaResponse>(`${API_MATERIAS_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

//post functions
export function postMaterias(params:PostMateriasParams) {
    return requestAuthJson<PostMateriasResponse> (API_MATERIAS_PREFIX + "/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

//put functions
//função associada com a edição, recebe o ID e retorna as informações para
// preenchimento da página (params e response em types/materias.ts)
export function putMateria(id: string, params: PutMateriasParams) {
    return requestAuthJson<PutMateriasResponse>(`${API_MATERIAS_PREFIX}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

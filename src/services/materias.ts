import { requestAuthJson } from "./api"

import type { GetMateriasParams, GetMateriasResponse } from "../types/materias"

const API_MATERIAS_PREFIX = "/admin/materias"

export async function getMaterias(params: GetMateriasParams = {}): Promise<GetMateriasResponse> {
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

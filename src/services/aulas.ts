import { requestAuthJson } from "./api"

import type { AulaAtualizarParams, AulaCriarParams, GetAulaResponse, GetAulasParams, GetAulasPorMateriaParams, GetAulasPorMateriaResponse, GetAulasResponse, PatchAulaResponse, PostAulaResponse } from "../types/aulas"

const API_AULAS_PREFIX = "/admin/aulas"

//get functions
export function getAulas(params: GetAulasParams = {}): Promise<GetAulasResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.dificuldade) query.set("dificuldade", params.dificuldade)
    if (params.ativo !== undefined) query.set("ativo", String(params.ativo))
    if (params.mais_cobrado !== undefined) query.set("mais_cobrado", String(params.mais_cobrado))
    if (params.materia_id) query.set("materia_id", params.materia_id)
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))
    if (params.ordenar) query.set("ordenar", params.ordenar)

    const queryString = query.toString()

    return requestAuthJson<GetAulasResponse>(API_AULAS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export async function getAulasPorMateria(params: GetAulasPorMateriaParams) {
    return requestAuthJson<GetAulasPorMateriaResponse>(
        `${API_AULAS_PREFIX}/por-materia/${params.materia_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

export async function postAula(params: AulaCriarParams) {
    return requestAuthJson<PostAulaResponse>(API_AULAS_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export async function getAula(aulaId: string) {
    return requestAuthJson<GetAulaResponse>(`${API_AULAS_PREFIX}/${aulaId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export async function patchAula(aulaId: string, params: Partial<AulaAtualizarParams>) {
    return requestAuthJson<PatchAulaResponse>(`${API_AULAS_PREFIX}/${aulaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

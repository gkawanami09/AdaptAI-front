import { requestAuthJson } from "./api"

import type { AulaAtualizarParams, AulaCriarParams, GetAulaResponse, GetAulasPorMateriaParams, GetAulasPorMateriaResponse, PatchAulaResponse, PostAulaResponse } from "../types/aulas"

const API_AULAS_PREFIX = "/admin/aulas"

//get functions
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

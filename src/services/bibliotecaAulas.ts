import { requestAuthJson } from "./api"

import type { GetBibliotecaAulasParams, GetBibliotecaAulasResponse } from "../types/bibliotecaAulas"

const API_BIBLIOTECA_AULAS_PREFIX = "/aluno/aulas"

export function getBibliotecaAulas(params: GetBibliotecaAulasParams = {}): Promise<GetBibliotecaAulasResponse> {
    const query = new URLSearchParams()

    if (params.categoria_id) query.set("categoria_id", params.categoria_id)

    const queryString = query.toString()

    return requestAuthJson<GetBibliotecaAulasResponse>(API_BIBLIOTECA_AULAS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

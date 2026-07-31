import { requestAuthBlob, requestAuthJson } from "./api"
import type { AuthBlobResponse } from "./api"

import type { GetRankingConteudosParams, GetRankingConteudosResponse, GetRelatoriosParams, GetRelatoriosResponse } from "../types/relatorios"

const API_RELATORIOS_PREFIX = "/admin/relatorios"

export function getRelatorios(params: GetRelatoriosParams = {}): Promise<GetRelatoriosResponse> {
    const query = new URLSearchParams()

    if (params.periodo) query.set("periodo", params.periodo)

    const queryString = query.toString()

    return requestAuthJson<GetRelatoriosResponse>(API_RELATORIOS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getRankingConteudos(params: GetRankingConteudosParams = {}): Promise<GetRankingConteudosResponse> {
    const query = new URLSearchParams()

    if (params.periodo) query.set("periodo", params.periodo)
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetRankingConteudosResponse>(`${API_RELATORIOS_PREFIX}/ranking-conteudos` + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function exportarRelatorio(params: GetRelatoriosParams = {}): Promise<AuthBlobResponse> {
    const query = new URLSearchParams()

    if (params.periodo) query.set("periodo", params.periodo)

    const queryString = query.toString()

    return requestAuthBlob(`${API_RELATORIOS_PREFIX}/exportar` + (queryString ? `?${queryString}` : ""), {
        method: "GET"
    })
}

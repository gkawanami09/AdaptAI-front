import { requestAuthJson } from "./api"

import type { GetRedacaoTemasResponse, GetRedacaoTemaResponse } from "../types/redacaoTemas"

const API_REDACAO_TEMAS_PREFIX = "/aluno/redacao/temas"

export function getRedacaoTemas(): Promise<GetRedacaoTemasResponse> {
    return requestAuthJson<GetRedacaoTemasResponse>(API_REDACAO_TEMAS_PREFIX, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function getRedacaoTema(slug: string): Promise<GetRedacaoTemaResponse> {
    return requestAuthJson<GetRedacaoTemaResponse>(`${API_REDACAO_TEMAS_PREFIX}/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

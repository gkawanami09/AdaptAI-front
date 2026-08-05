import { requestAuthJson } from "./api"

import type {
    GetBancoQuestoesFiltrosResponse,
    GetBancoQuestoesListasParams,
    GetBancoQuestoesListasResponse,
    PostGerarListaComIAResponse,
} from "../types/bancoQuestoes"

const API_BANCO_QUESTOES_PREFIX = "/aluno/banco-questoes"

export function getBancoQuestoesFiltros(): Promise<GetBancoQuestoesFiltrosResponse> {
    return requestAuthJson<GetBancoQuestoesFiltrosResponse>(`${API_BANCO_QUESTOES_PREFIX}/filtros`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getBancoQuestoesListas(params: GetBancoQuestoesListasParams = {}): Promise<GetBancoQuestoesListasResponse> {
    const query = new URLSearchParams()

    params.vestibulares?.forEach((valor) => query.append("vestibulares", valor))
    params.dificuldades?.forEach((valor) => query.append("dificuldades", valor))
    params.materias?.forEach((valor) => query.append("materias", valor))
    if (params.apenas_erradas) query.set("apenas_erradas", "true")
    if (params.apenas_favoritas) query.set("apenas_favoritas", "true")

    const queryString = query.toString()

    return requestAuthJson<GetBancoQuestoesListasResponse>(`${API_BANCO_QUESTOES_PREFIX}/listas` + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postGerarListaComIA(): Promise<PostGerarListaComIAResponse> {
    return requestAuthJson<PostGerarListaComIAResponse>(`${API_BANCO_QUESTOES_PREFIX}/listas/gerar-ia`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

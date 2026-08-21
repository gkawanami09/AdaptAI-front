import { requestAuthJson } from "./api"

import type {
    GetBancoQuestoesFiltrosResponse,
    GetBancoQuestoesListasParams,
    GetBancoQuestoesListasResponse,
    GetBancoQuestoesRespondidasParams,
    GetBancoQuestoesRespondidasResponse,
    GetExecucaoRevisaoParams,
    GetExecucaoRevisaoResponse,
    GetGeracaoListaIAResponse,
    PostGerarListaComIAParams,
    PostGerarListaComIAResponse,
    PostRefazerListaResponse,
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
    if (params.apenas_favoritas) query.set("apenas_favoritas", "true")
    if (params.apenas_personalizadas) query.set("apenas_personalizadas", "true")

    const queryString = query.toString()

    return requestAuthJson<GetBancoQuestoesListasResponse>(`${API_BANCO_QUESTOES_PREFIX}/listas` + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function postRefazerLista(listaId: string): Promise<PostRefazerListaResponse> {
    return requestAuthJson<PostRefazerListaResponse>(`${API_BANCO_QUESTOES_PREFIX}/listas/${listaId}/refazer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function deletarLista(listaId: string): Promise<void> {
    return requestAuthJson<void>(`${API_BANCO_QUESTOES_PREFIX}/listas/${listaId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getBancoQuestoesRespondidas(params: GetBancoQuestoesRespondidasParams): Promise<GetBancoQuestoesRespondidasResponse> {
    const query = new URLSearchParams()

    query.set("status", params.status)
    query.set("pagina", String(params.pagina ?? 1))
    query.set("limite", String(params.limite ?? 20))
    params.vestibulares?.forEach((valor) => query.append("vestibulares", valor))
    params.dificuldades?.forEach((valor) => query.append("dificuldades", valor))
    params.materias?.forEach((valor) => query.append("materias", valor))
    params.assuntos?.forEach((valor) => query.append("assuntos", valor))
    if (params.apenas_favoritas) query.set("apenas_favoritas", "true")

    return requestAuthJson<GetBancoQuestoesRespondidasResponse>(`${API_BANCO_QUESTOES_PREFIX}/questoes-respondidas?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getExecucaoRevisao(execucaoId: string, params: GetExecucaoRevisaoParams = {}): Promise<GetExecucaoRevisaoResponse> {
    const query = new URLSearchParams()

    if (params.status) query.set("status", params.status)
    if (params.materia) query.set("materia", params.materia)
    if (params.assunto) query.set("assunto", params.assunto)
    if (params.dificuldade) query.set("dificuldade", params.dificuldade)
    query.set("pagina", String(params.pagina ?? 1))
    query.set("limite", String(params.limite ?? 20))

    return requestAuthJson<GetExecucaoRevisaoResponse>(
        `${API_BANCO_QUESTOES_PREFIX}/execucoes/${execucaoId}/revisao?${query.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}

export function postGerarListaComIA(params: PostGerarListaComIAParams): Promise<PostGerarListaComIAResponse> {
    return requestAuthJson<PostGerarListaComIAResponse>(`${API_BANCO_QUESTOES_PREFIX}/listas/gerar-ia`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function getGeracaoListaIA(jobId: string): Promise<GetGeracaoListaIAResponse> {
    return requestAuthJson<GetGeracaoListaIAResponse>(`${API_BANCO_QUESTOES_PREFIX}/geracoes/${jobId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

import { requestAuthJson } from "./api"

import type {
    GetConfiguracoesAutenticacaoResponse,
    GetConfiguracoesConteudoResponse,
    GetConfiguracoesGeraisResponse,
    GetConfiguracoesIaResponse,
    GetConfiguracoesNotificacoesResponse,
    GetIntegracoesResponse,
    GetUsuariosAdminParams,
    GetUsuariosAdminResponse,
    LogoTipo,
    PatchConfiguracoesAutenticacaoParams,
    PatchConfiguracoesAutenticacaoResponse,
    PatchConfiguracoesConteudoParams,
    PatchConfiguracoesConteudoResponse,
    PatchConfiguracoesGeraisParams,
    PatchConfiguracoesGeraisResponse,
    PatchConfiguracoesIaParams,
    PatchConfiguracoesIaResponse,
    PatchConfiguracoesNotificacoesParams,
    PatchConfiguracoesNotificacoesResponse,
    PatchIntegracaoParams,
    PatchIntegracaoResponse,
    PatchUsuarioAdminParams,
    PatchUsuarioAdminResponse,
    PostEnviarLogoResponse,
    PostTestarIaParams,
    PostTestarIaResponse,
} from "../types/configuracoes"

const API_CONFIGURACOES_PREFIX = "/admin/configuracoes"
const API_USUARIOS_PREFIX = "/admin/usuarios"

// gerais
export function getConfiguracoesGerais(): Promise<GetConfiguracoesGeraisResponse> {
    return requestAuthJson<GetConfiguracoesGeraisResponse>(`${API_CONFIGURACOES_PREFIX}/gerais`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchConfiguracoesGerais(params: PatchConfiguracoesGeraisParams) {
    return requestAuthJson<PatchConfiguracoesGeraisResponse>(`${API_CONFIGURACOES_PREFIX}/gerais`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

export function enviarLogo(arquivo: File, tipo: LogoTipo) {
    const formData = new FormData()
    formData.append("arquivo", arquivo)
    formData.append("tipo", tipo)

    // sem Content-Type explícito: o fetch define o boundary do multipart/form-data automaticamente
    return requestAuthJson<PostEnviarLogoResponse>(`${API_CONFIGURACOES_PREFIX}/gerais/logo`, {
        method: "POST",
        body: formData
    })
}

// usuarios e permissoes
export function getUsuariosAdmin(params: GetUsuariosAdminParams = {}): Promise<GetUsuariosAdminResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.cargo) query.set("cargo", params.cargo)
    if (params.status) query.set("status", params.status)
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetUsuariosAdminResponse>(API_USUARIOS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchUsuarioAdmin(id: string, params: PatchUsuarioAdminParams) {
    return requestAuthJson<PatchUsuarioAdminResponse>(`${API_USUARIOS_PREFIX}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

// autenticacao
export function getConfiguracoesAutenticacao(): Promise<GetConfiguracoesAutenticacaoResponse> {
    return requestAuthJson<GetConfiguracoesAutenticacaoResponse>(`${API_CONFIGURACOES_PREFIX}/autenticacao`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchConfiguracoesAutenticacao(params: PatchConfiguracoesAutenticacaoParams) {
    return requestAuthJson<PatchConfiguracoesAutenticacaoResponse>(`${API_CONFIGURACOES_PREFIX}/autenticacao`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

// conteudo
export function getConfiguracoesConteudo(): Promise<GetConfiguracoesConteudoResponse> {
    return requestAuthJson<GetConfiguracoesConteudoResponse>(`${API_CONFIGURACOES_PREFIX}/conteudo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchConfiguracoesConteudo(params: PatchConfiguracoesConteudoParams) {
    return requestAuthJson<PatchConfiguracoesConteudoResponse>(`${API_CONFIGURACOES_PREFIX}/conteudo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

// ia
export function getConfiguracoesIa(): Promise<GetConfiguracoesIaResponse> {
    return requestAuthJson<GetConfiguracoesIaResponse>(`${API_CONFIGURACOES_PREFIX}/ia`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchConfiguracoesIa(params: PatchConfiguracoesIaParams) {
    return requestAuthJson<PatchConfiguracoesIaResponse>(`${API_CONFIGURACOES_PREFIX}/ia`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

export function postTestarIa(params: PostTestarIaParams) {
    return requestAuthJson<PostTestarIaResponse>(`${API_CONFIGURACOES_PREFIX}/ia/testar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

// notificacoes
export function getConfiguracoesNotificacoes(): Promise<GetConfiguracoesNotificacoesResponse> {
    return requestAuthJson<GetConfiguracoesNotificacoesResponse>(`${API_CONFIGURACOES_PREFIX}/notificacoes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchConfiguracoesNotificacoes(params: PatchConfiguracoesNotificacoesParams) {
    return requestAuthJson<PatchConfiguracoesNotificacoesResponse>(`${API_CONFIGURACOES_PREFIX}/notificacoes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

// integracoes
export function getIntegracoes(): Promise<GetIntegracoesResponse> {
    return requestAuthJson<GetIntegracoesResponse>(`${API_CONFIGURACOES_PREFIX}/integracoes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function patchIntegracao(id: string, params: PatchIntegracaoParams) {
    return requestAuthJson<PatchIntegracaoResponse>(`${API_CONFIGURACOES_PREFIX}/integracoes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

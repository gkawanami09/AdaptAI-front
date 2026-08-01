import { requestAuthJson } from "./api"

import type {
    GetUsuariosParams, GetUsuariosResponse, GetUsuarioResponse,
    PostUsuarioParams, PostUsuarioResponse,
    PatchUsuarioParams, PatchUsuarioResponse,
    GetOfensivaHistoricoResponse,
    GetConquistasResponse,
    GetHistoricoParams, GetHistoricoResponse,
    GetMedidasResponse,
    PostSuspenderParams, PostBanirParams, PostMedidaResponse,
    PostReativarResponse,
    PostResetarSenhaResponse,
    PostResetarOfensivaResponse,
    GetTimelineResponse,
    UsuarioCargo,
} from "../types/usuarios"

const API_USUARIOS_PREFIX = "/admin/usuarios"

// get functions
export function getUsuarios(params: GetUsuariosParams = {}): Promise<GetUsuariosResponse> {
    const query = new URLSearchParams()

    if (params.busca) query.set("busca", params.busca)
    if (params.cargo) query.set("cargo", params.cargo)
    if (params.status) query.set("status", params.status)
    if (params.ofensiva_min !== undefined) query.set("ofensiva_min", String(params.ofensiva_min))
    if (params.ordenar) query.set("ordenar", params.ordenar)
    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetUsuariosResponse>(API_USUARIOS_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getUsuarioPorId(id: string): Promise<GetUsuarioResponse> {
    return requestAuthJson<GetUsuarioResponse>(`${API_USUARIOS_PREFIX}/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getOfensivaHistorico(id: string): Promise<GetOfensivaHistoricoResponse> {
    return requestAuthJson<GetOfensivaHistoricoResponse>(`${API_USUARIOS_PREFIX}/${id}/ofensiva-historico`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getConquistas(id: string): Promise<GetConquistasResponse> {
    return requestAuthJson<GetConquistasResponse>(`${API_USUARIOS_PREFIX}/${id}/conquistas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getHistorico(id: string, params: GetHistoricoParams = {}): Promise<GetHistoricoResponse> {
    const query = new URLSearchParams()

    if (params.pagina !== undefined) query.set("pagina", String(params.pagina))
    if (params.limite !== undefined) query.set("limite", String(params.limite))

    const queryString = query.toString()

    return requestAuthJson<GetHistoricoResponse>(`${API_USUARIOS_PREFIX}/${id}/historico` + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getMedidas(id: string): Promise<GetMedidasResponse> {
    return requestAuthJson<GetMedidasResponse>(`${API_USUARIOS_PREFIX}/${id}/medidas`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function getTimeline(id: string): Promise<GetTimelineResponse> {
    return requestAuthJson<GetTimelineResponse>(`${API_USUARIOS_PREFIX}/${id}/timeline`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

// post functions
export function postUsuario(params: PostUsuarioParams) {
    return requestAuthJson<PostUsuarioResponse>(API_USUARIOS_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

// patch functions
export function patchUsuario(id: string, params: PatchUsuarioParams) {
    return requestAuthJson<PatchUsuarioResponse>(`${API_USUARIOS_PREFIX}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function patchCargo(id: string, cargo: UsuarioCargo) {
    return requestAuthJson<PatchUsuarioResponse>(`${API_USUARIOS_PREFIX}/${id}/cargo`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ cargo })
    })
}

// post functions (ações administrativas)
export function suspenderUsuario(id: string, params: PostSuspenderParams) {
    return requestAuthJson<PostMedidaResponse>(`${API_USUARIOS_PREFIX}/${id}/suspender`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function banirUsuario(id: string, params: PostBanirParams) {
    return requestAuthJson<PostMedidaResponse>(`${API_USUARIOS_PREFIX}/${id}/banir`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

export function reativarUsuario(id: string) {
    return requestAuthJson<PostReativarResponse>(`${API_USUARIOS_PREFIX}/${id}/reativar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function resetarSenha(id: string) {
    return requestAuthJson<PostResetarSenhaResponse>(`${API_USUARIOS_PREFIX}/${id}/resetar-senha`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export function resetarOfensiva(id: string) {
    return requestAuthJson<PostResetarOfensivaResponse>(`${API_USUARIOS_PREFIX}/${id}/resetar-ofensiva`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

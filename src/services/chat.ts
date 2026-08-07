import { requestAuthJson } from "./api"

import type {
    ChatAttachmentType,
    ChatFeedback,
    ChatToolExplicacaoRequest,
    ChatToolListaRequest,
    ChatToolPlanoEstudosRequest,
    ChatToolQuestoesRequest,
    ChatToolRedacaoRequest,
    ChatToolResponse,
    ChatToolResumoRequest,
    ChatToolRevisaoRequest,
    ChatToolSimuladosRequest,
    GetChatConversaByIdResponse,
    GetChatConversasResponse,
    GetChatModelosResponse,
    PatchChatConversaRequest,
    PostChatConversaRequest,
    PostChatConversaResponse,
    PostChatMensagemRequest,
    PostChatMensagemResponse,
    PostChatRegenerarResponse
} from "../types/chat"

const API_CHAT_PREFIX = "/aluno/chat"
const API_CHAT_CONVERSAS_PREFIX = `${API_CHAT_PREFIX}/conversas`

export function getChatConversas(): Promise<GetChatConversasResponse> {
    return requestAuthJson<GetChatConversasResponse>(API_CHAT_CONVERSAS_PREFIX, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function criarChatConversa(payload: PostChatConversaRequest = {}): Promise<PostChatConversaResponse> {
    return requestAuthJson<PostChatConversaResponse>(API_CHAT_CONVERSAS_PREFIX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function getChatConversaById(id: string): Promise<GetChatConversaByIdResponse> {
    return requestAuthJson<GetChatConversaByIdResponse>(`${API_CHAT_CONVERSAS_PREFIX}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

export function enviarChatMensagem(conversaId: string, payload: PostChatMensagemRequest): Promise<PostChatMensagemResponse> {
    return requestAuthJson<PostChatMensagemResponse>(`${API_CHAT_CONVERSAS_PREFIX}/${conversaId}/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function excluirChatConversa(id: string): Promise<void> {
    return requestAuthJson<void>(`${API_CHAT_CONVERSAS_PREFIX}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
}

export function renomearChatConversa(id: string, payload: PatchChatConversaRequest): Promise<PostChatConversaResponse> {
    return requestAuthJson<PostChatConversaResponse>(`${API_CHAT_CONVERSAS_PREFIX}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function regenerarChatResposta(conversaId: string): Promise<PostChatRegenerarResponse> {
    return requestAuthJson<PostChatRegenerarResponse>(`${API_CHAT_CONVERSAS_PREFIX}/${conversaId}/regenerar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
}

export function enviarChatFeedback(conversaId: string, mensagemId: string, feedback: ChatFeedback): Promise<void> {
    return requestAuthJson<void>(`${API_CHAT_CONVERSAS_PREFIX}/${conversaId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagemId, feedback })
    })
}

export function getChatModelos(): Promise<GetChatModelosResponse> {
    return requestAuthJson<GetChatModelosResponse>(`${API_CHAT_PREFIX}/modelos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
}

// TODO: endpoint de streaming (SSE) ainda não existe. Quando disponível, trocar
// enviarChatMensagem por uma assinatura de EventSource e emitir a resposta da
// Ada token por token. Ver docs/chat-backend-requirements.md.
export function streamChatResposta(_conversaId: string, _mensagem: string, _onToken: (token: string) => void): Promise<void> {
    throw new Error("streamChatResposta ainda não implementado pelo backend.")
}

// TODO: cancelamento de geração em andamento (streaming) ainda não existe.
export function cancelarChatGeracao(_conversaId: string): Promise<void> {
    throw new Error("cancelarChatGeracao ainda não implementado pelo backend.")
}

// TODO: endpoint de upload de anexos ainda não existe.
export function uploadChatAnexo(_arquivo: File, _tipo: ChatAttachmentType): Promise<{ url: string }> {
    throw new Error("uploadChatAnexo ainda não implementado pelo backend.")
}

// ---- Ferramentas da IA (tool calling) ----
// Endpoints preparados para uso futuro pela IA dentro da conversa.
// Retornam 501 Not Implemented até o backend implementar cada ferramenta.

export function chatToolQuestoes(payload: ChatToolQuestoesRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/questoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolResumo(payload: ChatToolResumoRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/resumo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolRevisao(payload: ChatToolRevisaoRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/revisao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolPlanoEstudos(payload: ChatToolPlanoEstudosRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/plano-estudos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolRedacao(payload: ChatToolRedacaoRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/redacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolExplicacao(payload: ChatToolExplicacaoRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/explicacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolLista(payload: ChatToolListaRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/lista`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

export function chatToolSimulados(payload: ChatToolSimuladosRequest): Promise<ChatToolResponse> {
    return requestAuthJson<ChatToolResponse>(`${API_CHAT_PREFIX}/tools/simulados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
}

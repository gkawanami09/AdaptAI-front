export type ChatRole = 'ada' | 'user' | 'system'

export type ChatStatus = 'idle' | 'loading' | 'sending' | 'typing' | 'error' | 'empty'

export type ChatAttachmentType = 'imagem' | 'pdf' | 'arquivo' | 'audio'

export type ChatAttachment = {
    id: string
    tipo: ChatAttachmentType
    nome: string
    url: string
}

export type ChatFeedback = 'positivo' | 'negativo'

export type ChatModelo = {
    id: string
    nome: string
    descricao: string
    padrao: boolean
}

export type ChatSugestaoAcao = {
    tipo: ChatFerramenta
    label: string
}

// Ferramentas que a IA pode acionar dentro da conversa.
export type ChatFerramenta =
    | 'questoes'
    | 'resumo'
    | 'revisao'
    | 'plano-estudos'
    | 'redacao'
    | 'explicacao'
    | 'lista'
    | 'simulados'

export type ChatMensagem = {
    id: string
    sender: ChatRole
    texto: string
    timestamp: string
    anexos?: ChatAttachment[]
    sugestoes?: ChatSugestaoAcao[]
    tokens?: number
    modelo?: string
}

export type ChatConversaResumo = {
    id: string
    slug: string
    titulo: string
    atualizadoEm: string
}

export type GetChatConversasResponse = {
    conversas: ChatConversaResumo[]
}

export type GetChatConversaByIdResponse = {
    id: string
    slug: string
    titulo: string
    mensagens: ChatMensagem[]
}

export type PostChatConversaRequest = {
    titulo?: string
}

export type PostChatConversaResponse = ChatConversaResumo

export type PatchChatConversaRequest = {
    titulo: string
}

export type PostChatMensagemRequest = {
    mensagem: string
}

export type PostChatMensagemResponse = {
    user: ChatMensagem
    assistant: ChatMensagem
    tempoProcessamentoMs: number
    tokensUsados: number
    modelo: string
    sugestoes?: ChatSugestaoAcao[]
}

export type PostChatFeedbackRequest = {
    mensagemId: string
    feedback: ChatFeedback
}

export type PostChatRegenerarResponse = {
    assistant: ChatMensagem
}

export type GetChatModelosResponse = {
    modelos: ChatModelo[]
}

// Payloads das ferramentas da IA — todas retornam 501 até o backend implementar.
export type ChatToolQuestoesRequest = { tema: string; quantidade?: number }
export type ChatToolResumoRequest = { conteudo: string }
export type ChatToolRevisaoRequest = { materia: string }
export type ChatToolPlanoEstudosRequest = { objetivo: string }
export type ChatToolRedacaoRequest = { texto: string }
export type ChatToolExplicacaoRequest = { topico: string }
export type ChatToolListaRequest = { tema: string; quantidade?: number }
export type ChatToolSimuladosRequest = { materias: string[]; quantidadeQuestoes?: number }

export type ChatToolResponse = {
    status: 'not_implemented'
}

export type UsuarioCargo = 'aluno' | 'moderador' | 'editor' | 'administrador'
export type UsuarioStatus = 'ativo' | 'suspenso' | 'banido'

export type UsuarioResumo = {
    id: string
    nome: string
    email: string
    avatar_url: string | null
    cargo: UsuarioCargo
    status: UsuarioStatus
    ofensiva_atual: number
    xp: number
    ultimo_acesso: string | null
}

export type GetUsuariosParams = {
    busca?: string
    cargo?: UsuarioCargo
    status?: UsuarioStatus
    ofensiva_min?: number
    ordenar?: 'nome-az' | 'nome-za' | 'recentes' | 'xp-desc' | 'ofensiva-desc'
    pagina?: number
    limite?: number
}

export type GetUsuariosResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    total_paginas: number
    total_usuarios: number
    total_ativos: number
    total_suspensos: number
    ofensiva_media: number
    usuarios: UsuarioResumo[]
}

export type UsuarioDetalhe = UsuarioResumo & {
    id_publico: string
    criado_em: string
    email_verificado: boolean
    maior_ofensiva: number
    questoes_respondidas: number
    taxa_acerto: number
    tempo_estudo_min: number
    listas_concluidas: number
    provas_realizadas: number
    ranking_geral: number
}

export type GetUsuarioResponse = {
    sucesso: boolean
    usuario: UsuarioDetalhe
}

export type PatchUsuarioParams = {
    nome?: string
    email?: string
    cargo?: UsuarioCargo
}

export type PatchUsuarioResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioDetalhe
}

export type PostUsuarioParams = {
    nome: string
    email: string
    cargo: UsuarioCargo
}

export type PostUsuarioResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioDetalhe
}

export type OfensivaHistoricoPonto = {
    data: string
    ofensiva: number
}

export type GetOfensivaHistoricoResponse = {
    sucesso: boolean
    historico: OfensivaHistoricoPonto[]
}

export type Conquista = {
    id: string
    nome: string
    descricao: string
    icone: string
    conquistada_em: string
}

export type GetConquistasResponse = {
    sucesso: boolean
    conquistas: Conquista[]
}

export type HistoricoTipo = 'questao' | 'lista' | 'prova' | 'aula' | 'conquista'

export type HistoricoItem = {
    id: string
    tipo: HistoricoTipo
    descricao: string
    data: string
}

export type GetHistoricoParams = {
    pagina?: number
    limite?: number
}

export type GetHistoricoResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    total_paginas: number
    itens: HistoricoItem[]
}

export type MedidaTipo = 'advertencia' | 'suspensao' | 'banimento'
export type MedidaStatus = 'ativa' | 'expirada' | 'revogada'

export type MedidaAdministrativa = {
    id: string
    tipo: MedidaTipo
    motivo: string
    administrador: string
    data: string
    status: MedidaStatus
}

export type GetMedidasResponse = {
    sucesso: boolean
    medidas: MedidaAdministrativa[]
}

export type PostSuspenderParams = {
    motivo: string
    duracao_dias: number
}

export type PostBanirParams = {
    motivo: string
}

export type PostMedidaResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioDetalhe
}

export type PostReativarResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioDetalhe
}

export type PostResetarSenhaResponse = {
    sucesso: boolean
    mensagem: string
}

export type PostResetarOfensivaResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioDetalhe
}

export type TimelineEventoTipo =
    | 'conta_criada'
    | 'primeiro_login'
    | 'lista_concluida'
    | 'questao_respondida'
    | 'prova_realizada'
    | 'conquista'
    | 'advertencia'
    | 'suspensao'
    | 'banimento'

export type TimelineEvento = {
    id: string
    tipo: TimelineEventoTipo
    titulo: string
    descricao: string
    data: string
}

export type GetTimelineResponse = {
    sucesso: boolean
    eventos: TimelineEvento[]
}

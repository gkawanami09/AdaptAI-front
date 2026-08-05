export type ConfiguracoesAlunoPerfil = {
    nome: string
    email: string
    nivel: number
    xp_total: number
    escola: string
    ano_enem: string
}

export type ConfiguracoesAlunoNotificacao = {
    id: string
    label: string
    description: string
    enabled: boolean
}

export type ConfiguracoesAlunoMetas = {
    objetivo: string
    tempo_estudo: string
    nota_alvo: string
}

export type ConfiguracoesAlunoTema = 'claro' | 'escuro' | 'sistema'

export type ConfiguracoesAlunoAparencia = {
    tema: ConfiguracoesAlunoTema
}

export type GetConfiguracoesAlunoResponse = {
    perfil: ConfiguracoesAlunoPerfil
    notificacoes: ConfiguracoesAlunoNotificacao[]
    metas: ConfiguracoesAlunoMetas
    aparencia: ConfiguracoesAlunoAparencia
}

export type PatchNotificacaoAlunoPayload = {
    id: string
    enabled: boolean
}

export type PatchNotificacaoAlunoResponse = {
    id: string
    enabled: boolean
}

export type PatchMetasAlunoPayload = {
    objetivo?: string
    tempo_estudo?: string
    nota_alvo?: string
}

export type PatchMetasAlunoResponse = ConfiguracoesAlunoMetas

export type PatchAparenciaAlunoPayload = {
    tema: ConfiguracoesAlunoTema
}

export type PatchAparenciaAlunoResponse = {
    tema: ConfiguracoesAlunoTema
}

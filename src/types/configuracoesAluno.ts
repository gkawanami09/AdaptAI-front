export type ConfiguracoesAlunoPerfil = {
    nome: string
    email: string
    nivel: number
    xp_total: number
    escola: string
    ano_enem: string
    avatar_url?: string | null
}

export type ConfiguracoesAlunoNotificacao = {
    id: string
    label: string
    description: string
    enabled: boolean
}

export type ConfiguracoesAlunoTema = 'claro' | 'escuro' | 'sistema'

export type ConfiguracoesAlunoAparencia = {
    tema: ConfiguracoesAlunoTema
}

export type GetConfiguracoesAlunoResponse = {
    perfil: ConfiguracoesAlunoPerfil
    notificacoes: ConfiguracoesAlunoNotificacao[]
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

export type PatchAparenciaAlunoPayload = {
    tema: ConfiguracoesAlunoTema
}

export type PatchAparenciaAlunoResponse = {
    tema: ConfiguracoesAlunoTema
}

export type PatchPerfilAlunoPayload = {
    nome?: string
    escola?: string
    ano_enem?: string
}

export type PatchPerfilAlunoResponse = ConfiguracoesAlunoPerfil

export type UploadAvatarAlunoResponse = {
    avatar_url: string
}

export type AlterarSenhaAlunoPayload = {
    senha_atual: string
    nova_senha: string
}

export type AlterarSenhaAlunoResponse = {
    sucesso: boolean
}

export type ExcluirContaAlunoPayload = {
    senha: string
}

export type DadoIA = {
    id: string
    nome: string
    descricao: string
    categoria: string
    utilizado: boolean
}

export type InsightIA = {
    id: string
    titulo: string
    descricao: string
    materia?: string
    tipo?: string
}

export type DadosIAResponse = {
    dados: DadoIA[]
    insights: InsightIA[]
}

export type PatchDadoIAPayload = {
    id: string
    utilizado: boolean
}

export type PatchDadoIAResponse = {
    id: string
    utilizado: boolean
}

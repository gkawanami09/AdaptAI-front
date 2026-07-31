export type ConfiguracoesGerais = {
    nome_plataforma: string
    slogan: string
    descricao: string
    logo_url: string | null
    favicon_url: string | null
    idioma: string
    timezone: string
    formato_data: string
    tema: 'claro' | 'escuro' | 'sistema'
}

export type GetConfiguracoesGeraisResponse = {
    sucesso: boolean
    configuracoes: ConfiguracoesGerais
}

export type PatchConfiguracoesGeraisParams = Partial<ConfiguracoesGerais>

export type PatchConfiguracoesGeraisResponse = {
    sucesso: boolean
    mensagem: string
    configuracoes: ConfiguracoesGerais
}

export type UsuarioAdminCargo = 'admin' | 'editor' | 'suporte' | 'aluno'
export type UsuarioAdminStatus = 'ativo' | 'inativo'

export type UsuarioAdmin = {
    id: string
    nome: string
    email: string
    cargo: UsuarioAdminCargo
    status: UsuarioAdminStatus
    criado_em: string
}

export type GetUsuariosAdminParams = {
    busca?: string
    cargo?: UsuarioAdminCargo
    status?: UsuarioAdminStatus
    pagina?: number
    limite?: number
}

export type GetUsuariosAdminResponse = {
    sucesso: boolean
    pagina: number
    limite: number
    total_registros: number
    total_paginas: number
    usuarios: UsuarioAdmin[]
}

export type PatchUsuarioAdminParams = {
    cargo?: UsuarioAdminCargo
    status?: UsuarioAdminStatus
}

export type PatchUsuarioAdminResponse = {
    sucesso: boolean
    mensagem: string
    usuario: UsuarioAdmin
}

export type ConfiguracoesAutenticacao = {
    tempo_sessao_min: number
    login_google_ativo: boolean
    login_microsoft_ativo: boolean
    autenticacao_dois_fatores_ativo: boolean
    reset_senha_ativo: boolean
    senha_tamanho_minimo: number
    senha_exigir_numero: boolean
    senha_exigir_maiuscula: boolean
    senha_exigir_caractere_especial: boolean
}

export type GetConfiguracoesAutenticacaoResponse = {
    sucesso: boolean
    configuracoes: ConfiguracoesAutenticacao
}

export type PatchConfiguracoesAutenticacaoParams = Partial<ConfiguracoesAutenticacao>

export type PatchConfiguracoesAutenticacaoResponse = {
    sucesso: boolean
    mensagem: string
    configuracoes: ConfiguracoesAutenticacao
}

export type ConfiguracoesConteudo = {
    itens_por_pagina: number
    tamanho_maximo_upload_mb: number
    tipos_arquivo_permitidos: string[]
    editor_padrao: 'markdown' | 'rich-text'
    auto_salvamento_ativo: boolean
    auto_salvamento_intervalo_seg: number
}

export type GetConfiguracoesConteudoResponse = {
    sucesso: boolean
    configuracoes: ConfiguracoesConteudo
}

export type PatchConfiguracoesConteudoParams = Partial<ConfiguracoesConteudo>

export type PatchConfiguracoesConteudoResponse = {
    sucesso: boolean
    mensagem: string
    configuracoes: ConfiguracoesConteudo
}

export type ConfiguracoesIa = {
    modelo: string
    temperatura: number
    max_tokens: number
    prompt_base: string
    limite_geracoes_dia: number
}

export type GetConfiguracoesIaResponse = {
    sucesso: boolean
    configuracoes: ConfiguracoesIa
}

export type PatchConfiguracoesIaParams = Partial<ConfiguracoesIa>

export type PatchConfiguracoesIaResponse = {
    sucesso: boolean
    mensagem: string
    configuracoes: ConfiguracoesIa
}

export type PostTestarIaParams = {
    modelo: string
    temperatura: number
    max_tokens: number
    prompt_base: string
    prompt_teste: string
}

export type PostTestarIaResponse = {
    sucesso: boolean
    resposta: string
    tokens_utilizados: number
    tempo_resposta_ms: number
}

export type ConfiguracoesNotificacoes = {
    email_ativo: boolean
    push_ativo: boolean
    alertas_internos_ativo: boolean
    evento_novo_usuario: boolean
    evento_questao_criada: boolean
    evento_questao_editada: boolean
    evento_lista_publicada: boolean
    evento_prova_criada: boolean
    evento_prova_publicada: boolean
    evento_usuario_completou_lista: boolean
    resumo_diario_email: boolean
    resumo_semanal_email: boolean
}

export type GetConfiguracoesNotificacoesResponse = {
    sucesso: boolean
    configuracoes: ConfiguracoesNotificacoes
}

export type PatchConfiguracoesNotificacoesParams = Partial<ConfiguracoesNotificacoes>

export type PatchConfiguracoesNotificacoesResponse = {
    sucesso: boolean
    mensagem: string
    configuracoes: ConfiguracoesNotificacoes
}

export type IntegracaoProvedor = 'openai' | 'google' | 'microsoft' | 'supabase' | 'sentry' | 'slack'

export type Integracao = {
    id: string
    provedor: IntegracaoProvedor
    nome: string
    descricao: string
    ativo: boolean
    api_key_mascarada: string | null
    webhook_url: string | null
    conectado_em: string | null
}

export type GetIntegracoesResponse = {
    sucesso: boolean
    integracoes: Integracao[]
}

export type PatchIntegracaoParams = {
    ativo?: boolean
    api_key?: string
    webhook_url?: string | null
}

export type PatchIntegracaoResponse = {
    sucesso: boolean
    mensagem: string
    integracao: Integracao
}

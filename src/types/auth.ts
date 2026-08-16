export type UserProfile = {
  id?: string
  nome: string
  email?: string
  nivelAcesso: string
  telasPermitidas: string[]
  escolaNome?: string | null
  avatarUrl?: string | null
  situacao?: string
  emailVerificado?: boolean
  nivel?: number
  xp?: number
}

export type SolicitarRecuperacaoSenhaPayload = {
  email: string
}

export type RedefinirSenhaPayload = {
  token: string
  nova_senha: string
}

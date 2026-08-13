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

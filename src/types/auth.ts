export type UserProfile = {
  id?: string
  nome: string
  nivelAcesso: string
  telasPermitidas: string[]
  escolaNome?: string | null
  avatarUrl?: string | null
  nivel?: number
  xp?: number
}

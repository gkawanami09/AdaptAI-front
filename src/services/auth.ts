import type { UserProfile } from '../types/auth'

// 🧪 Bypass de desenvolvimento: com VITE_MOCK_AUTH=true (ver .env.local),
// pula a chamada real ao backend e libera acesso com um perfil fake.
// Nunca fica ativo em build de produção (import.meta.env.DEV cobre isso).
const MOCK_PROFILE: UserProfile = {
  nome: 'Usuário de Teste',
  nivelAcesso: 'admin',
  telasPermitidas: ['dashboard'],
}

export function isMockAuthEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
}

// TODO: conectar ao backend — validar o token salvo e retornar o perfil do
// usuário logado (telas permitidas, nível de acesso, etc).
// ex: const { data } = await api.get<UserProfile>('/usuarios/me')
//     return data
export async function fetchCurrentUser(): Promise<UserProfile> {
  if (isMockAuthEnabled()) {
    return MOCK_PROFILE
  }

  throw new Error('fetchCurrentUser: aguardando integração com o backend')
}

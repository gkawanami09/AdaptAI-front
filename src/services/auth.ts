import type { UserProfile } from '../types/auth'
import { setCookie, TOKEN_COOKIE_NAME } from '../utils/cookies'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const AUTH_PROFILE_STORAGE_KEY = 'adaptai_user_profile'
const AUTH_REFRESH_TOKEN_STORAGE_KEY = 'adaptai_refresh_token'

const DEFAULT_TELAS_PERMITIDAS = [
  'dashboard',
  'plano-de-estudos',
  'aulas',
  'questoes',
  'simulados',
  'redacao',
  'chat',
  'progresso',
  'conquistas',
  'configuracoes',
]

const MOCK_PROFILE: UserProfile = {
  nome: 'Usuario de Teste',
  nivelAcesso: 'admin',
  nivel: 12,
  xp: 4820,
  telasPermitidas: DEFAULT_TELAS_PERMITIDAS,
}

type ApiErrorBody = {
  detail?: string
}

type RegisterInput = {
  name: string
  school?: string
  email: string
  password: string
  confirmPassword: string
  profilePhoto?: File | null
}

type LoginResponse = {
  sucesso: boolean
  usuario: {
    id: string
    nome: string
    escola_nome?: string | null
    avatar_url?: string | null
    tipo_usuario?: string | null
  }
  session: {
    access_token: string
    refresh_token?: string
    token_type?: string
  }
}

export function isMockAuthEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody
    return data.detail || 'Nao foi possivel concluir a solicitacao.'
  } catch {
    return 'Nao foi possivel concluir a solicitacao.'
  }
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  return response.json() as Promise<T>
}

function mapLoginResponseToProfile(data: LoginResponse): UserProfile {
  return {
    id: data.usuario.id,
    nome: data.usuario.nome,
    escolaNome: data.usuario.escola_nome ?? null,
    avatarUrl: data.usuario.avatar_url ?? null,
    nivelAcesso: data.usuario.tipo_usuario ?? 'aluno',
    telasPermitidas: DEFAULT_TELAS_PERMITIDAS,
  }
}

export async function registerUser(input: RegisterInput): Promise<void> {
  const formData = new FormData()
  formData.append('nome', input.name)
  formData.append('email', input.email)
  formData.append('escola', input.school ?? '')
  formData.append('senha', input.password)
  formData.append('conf_senha', input.confirmPassword)

  if (input.profilePhoto) {
    formData.append('avatar', input.profilePhoto)
  }

  await requestJson('/auth/registro', {
    method: 'POST',
    body: formData,
  })
}

export async function confirmEmail(email: string, code: string): Promise<void> {
  await requestJson('/auth/confirmaEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      codigo: code,
    }),
  })
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const data = await requestJson<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      senha: password,
    }),
  })

  const perfil = mapLoginResponseToProfile(data)
  setCookie(TOKEN_COOKIE_NAME, data.session.access_token)
  localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(perfil))

  if (data.session.refresh_token) {
    localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, data.session.refresh_token)
  }

  return perfil
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_PROFILE_STORAGE_KEY)
  localStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY)
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  if (isMockAuthEnabled()) {
    return MOCK_PROFILE
  }

  const storedProfile = localStorage.getItem(AUTH_PROFILE_STORAGE_KEY)

  if (!storedProfile) {
    throw new Error('Perfil local nao encontrado')
  }

  return JSON.parse(storedProfile) as UserProfile
}

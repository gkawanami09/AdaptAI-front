import type { UserProfile } from '../types/auth'
import { setCookie, TOKEN_COOKIE_NAME } from '../utils/cookies'

import { isMockAuthEnabled } from './api'
import { requestAuthJson, requestJson } from './api'

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

type UsuarioPerfilResponse = {
  sucesso: boolean
  usuario: {
    id: string
    nome: string
    email: string
    avatar_url: string | null
    tipo_usuario: 'aluno' | 'professor' | 'admin'
    escola_nome: string | null
    situacao: string
    email_verificado: boolean
    nivel: number
    xp: number
  }
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

function mapPerfilResponseToProfile(data: UsuarioPerfilResponse): UserProfile {
  return {
    id: data.usuario.id,
    nome: data.usuario.nome,
    email: data.usuario.email,
    escolaNome: data.usuario.escola_nome,
    avatarUrl: data.usuario.avatar_url,
    nivelAcesso: data.usuario.tipo_usuario,
    situacao: data.usuario.situacao,
    emailVerificado: data.usuario.email_verificado,
    nivel: data.usuario.nivel,
    xp: data.usuario.xp,
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

export async function logoutUser(): Promise<void> {
  if (isMockAuthEnabled()) return

  try {
    await requestAuthJson('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Não foi possível invalidar a sessão no servidor.', error)
  }
}

export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
  await requestJson('/auth/esqueci-senha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
}

export async function redefinirSenha(token: string, novaSenha: string): Promise<void> {
  await requestJson('/auth/redefinir-senha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, nova_senha: novaSenha }),
  })
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  if (isMockAuthEnabled()) {
    return MOCK_PROFILE
  }

  const data = await requestAuthJson<UsuarioPerfilResponse>('/usuarios/perfil', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const perfil = mapPerfilResponseToProfile(data)
  localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(perfil))

  return perfil
}

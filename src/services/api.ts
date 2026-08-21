import type { ApiErrorBody } from "../types/api"
import { getCookie, TOKEN_COOKIE_NAME } from "../utils/cookies"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function isMockAuthEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_MOCK_AUTH === 'true'
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody
    return data.detail || 'Nao foi possivel concluir a solicitacao.'
  } catch {
    return 'Nao foi possivel concluir a solicitacao.'
  }
}

export async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

// usado nas rotas que exigem usuário autenticado (ex.: área admin)
export async function requestAuthJson<T>(path: string, init: RequestInit): Promise<T> {
  const token = getCookie(TOKEN_COOKIE_NAME)

  if (!token && !isMockAuthEnabled()) {
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return requestJson<T>(path, { ...init, headers })
}

export type AuthBlobResponse = {
  blob: Blob
  filename: string | null
}

// usado para baixar arquivos binários (ex.: exportação de relatórios)
export async function requestAuthBlob(path: string, init: RequestInit = {}): Promise<AuthBlobResponse> {
  const token = getCookie(TOKEN_COOKIE_NAME)

  if (!token && !isMockAuthEnabled()) {
    throw new Error('Sessao expirada. Faca login novamente.')
  }

  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (!response.ok) {
    throw new Error(await parseApiError(response))
  }

  const disposition = response.headers.get('Content-Disposition')
  const filenameMatch = disposition?.match(/filename="?([^"]+)"?/)

  return {
    blob: await response.blob(),
    filename: filenameMatch?.[1] ?? null,
  }
}

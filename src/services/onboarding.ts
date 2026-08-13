import { requestAuthJson } from './api'
import type { OnboardingConcluirInput, OnboardingConcluirResponse, OnboardingResponse } from '../types/onboarding'

const API_ONBOARDING_PREFIX = '/onboarding'

export function getOnboarding(): Promise<OnboardingResponse> {
  return requestAuthJson<OnboardingResponse>(API_ONBOARDING_PREFIX, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
}

export function concluirOnboarding(input: OnboardingConcluirInput): Promise<OnboardingConcluirResponse> {
  return requestAuthJson<OnboardingConcluirResponse>(`${API_ONBOARDING_PREFIX}/concluir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

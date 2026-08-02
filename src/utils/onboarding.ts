export const ONBOARDING_PENDING_EMAIL_KEY = 'adaptai_onboarding_pending_email'
export const ONBOARDING_ACTIVE_KEY = 'adaptai_onboarding_active'
export const ONBOARDING_ANSWERS_KEY = 'adaptai_onboarding_answers_v1'

export function markOnboardingPending(email: string) {
  localStorage.setItem(ONBOARDING_PENDING_EMAIL_KEY, email.trim().toLowerCase())
}

export function activateOnboardingFor(email: string) {
  const pendingEmail = localStorage.getItem(ONBOARDING_PENDING_EMAIL_KEY)
  const isPendingAccount = pendingEmail === email.trim().toLowerCase()

  if (isPendingAccount) localStorage.setItem(ONBOARDING_ACTIVE_KEY, 'true')
  return isPendingAccount
}

export function setOnboardingActive(active: boolean) {
  if (active) {
    localStorage.setItem(ONBOARDING_ACTIVE_KEY, 'true')
    return
  }

  localStorage.removeItem(ONBOARDING_ACTIVE_KEY)
  localStorage.removeItem(ONBOARDING_PENDING_EMAIL_KEY)
}

export function isOnboardingActive() {
  return localStorage.getItem(ONBOARDING_ACTIVE_KEY) === 'true'
}

export function completeOnboarding(answers: unknown) {
  localStorage.setItem(ONBOARDING_ANSWERS_KEY, JSON.stringify(answers))
  localStorage.removeItem(ONBOARDING_PENDING_EMAIL_KEY)
  localStorage.removeItem(ONBOARDING_ACTIVE_KEY)
}

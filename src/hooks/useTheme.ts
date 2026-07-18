import { useEffect, useState } from 'react'

export type ThemePreference = 'claro' | 'escuro' | 'sistema'

const STORAGE_KEY = 'adaptai-theme'

function getStoredTheme(): ThemePreference {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'claro' || stored === 'escuro' || stored === 'sistema' ? stored : 'sistema'
}

function applyTheme(theme: ThemePreference) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'escuro' || (theme === 'sistema' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark)
}

// Aplica o tema salvo assim que o app carrega (antes do primeiro paint) e mantém o
// modo "sistema" sincronizado se o SO mudar de tema com o app aberto.
export function initTheme() {
  applyTheme(getStoredTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'sistema') applyTheme('sistema')
  })
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return [theme, setThemeState] as const
}

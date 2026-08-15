import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AchievementPopup } from '../components/notifications/AchievementPopup'
import { getConquistas } from '../services/conquistas'
import type { ConquistaDesbloqueada } from '../types/conquistas'

const SEEN_ACHIEVEMENTS_KEY = 'adaptai_conquistas_vistas'

function getSeenTitles(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_ACHIEVEMENTS_KEY)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

function saveSeenTitles(titles: Set<string>) {
  localStorage.setItem(SEEN_ACHIEVEMENTS_KEY, JSON.stringify(Array.from(titles)))
}

type AchievementNotificationContextValue = {
  checkForNewAchievements: () => Promise<void>
}

const AchievementNotificationContext = createContext<AchievementNotificationContextValue | null>(null)

export function AchievementNotificationProvider({ children }: { children: ReactNode }) {
  const [fila, setFila] = useState<ConquistaDesbloqueada[]>([])
  const verificando = useRef(false)
  const inicializado = useRef(false)

  const checkForNewAchievements = useCallback(async () => {
    if (verificando.current) return
    verificando.current = true

    try {
      const resposta = await getConquistas()
      const jaVistas = getSeenTitles()

      if (!inicializado.current && jaVistas.size === 0) {
        inicializado.current = true
        saveSeenTitles(new Set(resposta.conquistas_desbloqueadas.map((item) => item.titulo)))
        return
      }
      inicializado.current = true

      const novas = resposta.conquistas_desbloqueadas.filter((item) => !jaVistas.has(item.titulo))

      if (novas.length > 0) {
        novas.forEach((item) => jaVistas.add(item.titulo))
        saveSeenTitles(jaVistas)
        setFila((atual) => [...atual, ...novas])
      }
    } catch (error) {
      console.error('Não foi possível verificar novas conquistas.', error)
    } finally {
      verificando.current = false
    }
  }, [])

  function fecharAtual() {
    setFila((atual) => atual.slice(1))
  }

  const conquistaAtual = fila[0]

  return (
    <AchievementNotificationContext.Provider value={{ checkForNewAchievements }}>
      {children}
      {conquistaAtual && (
        <AchievementPopup
          key={conquistaAtual.titulo}
          icon={conquistaAtual.icone}
          title={conquistaAtual.titulo}
          description={conquistaAtual.descricao}
          xp={conquistaAtual.xp}
          onClose={fecharAtual}
        />
      )}
    </AchievementNotificationContext.Provider>
  )
}

export function useAchievementNotifications() {
  const context = useContext(AchievementNotificationContext)
  if (!context) throw new Error('useAchievementNotifications deve ser usado dentro de AchievementNotificationProvider')
  return context
}

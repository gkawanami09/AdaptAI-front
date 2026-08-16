import { useCallback, useState } from 'react'

export type BrowserNotificationPermission = 'unsupported' | 'default' | 'granted' | 'denied'

function readPermission(): BrowserNotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export function useBrowserNotifications() {
  const [permission, setPermission] = useState<BrowserNotificationPermission>(readPermission)

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported')
      return 'unsupported' as const
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  return { permission, requestPermission, isSupported: permission !== 'unsupported' }
}

import { useEffect } from 'react'
import { CheckCircleIcon, AlertCircleIcon, XIcon } from './icons'
import styles from './Toast.module.css'

export type ToastType = 'success' | 'error'

type ToastProps = {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ type, message, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className={`${styles.toast} ${type === 'success' ? styles.success : styles.error}`} role="alert">
      <span className={styles.icon}>{type === 'success' ? <CheckCircleIcon /> : <AlertCircleIcon />}</span>
      <span className={styles.message}>{message}</span>
      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar notificação">
        <XIcon />
      </button>
    </div>
  )
}

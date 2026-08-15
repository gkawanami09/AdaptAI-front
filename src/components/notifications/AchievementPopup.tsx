import { useEffect } from 'react'
import { XIcon } from '../ui/icons'
import styles from './AchievementPopup.module.css'

type AchievementPopupProps = {
  icon: string
  title: string
  description: string
  xp: number
  onClose: () => void
  duration?: number
}

export function AchievementPopup({ icon, title, description, xp, onClose, duration = 6000 }: AchievementPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className={styles.popup} role="status">
      <span className={styles.iconWrap} aria-hidden="true">
        {icon}
      </span>

      <div className={styles.content}>
        <span className={styles.eyebrow}>Conquista desbloqueada!</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        <span className={styles.xp}>+{xp} XP</span>
      </div>

      <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar notificação">
        <XIcon />
      </button>
    </div>
  )
}

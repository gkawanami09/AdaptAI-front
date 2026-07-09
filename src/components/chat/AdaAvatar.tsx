import { AdaMascot } from '../AdaMascot'
import styles from './AdaAvatar.module.css'

type AdaAvatarProps = {
  size?: 'sm' | 'md'
}

export function AdaAvatar({ size = 'md' }: AdaAvatarProps) {
  return (
    <span className={`${styles.avatar} ${styles[`avatar--${size}`]}`}>
      <AdaMascot className={styles.icon} />
    </span>
  )
}

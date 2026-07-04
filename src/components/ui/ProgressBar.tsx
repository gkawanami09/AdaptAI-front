import styles from './ProgressBar.module.css'

export type ProgressBarColor = 'purple' | 'teal'

type ProgressBarProps = {
  value: number
  color?: ProgressBarColor
}

export function ProgressBar({ value, color = 'purple' }: ProgressBarProps) {
  const percentual = Math.min(100, Math.max(0, value))

  return (
    <div className={styles.track} role="progressbar" aria-valuenow={percentual} aria-valuemin={0} aria-valuemax={100}>
      <div className={`${styles.fill} ${styles[`fill--${color}`]}`} style={{ width: `${percentual}%` }} />
    </div>
  )
}

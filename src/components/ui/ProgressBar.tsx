import styles from './ProgressBar.module.css'

export type ProgressBarColor = 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'
export type ProgressBarSize = 'sm' | 'md' | 'lg'

type ProgressBarProps = {
  value: number
  color?: ProgressBarColor
  size?: ProgressBarSize
}

export function ProgressBar({ value, color = 'purple', size = 'sm' }: ProgressBarProps) {
  const percentual = Math.min(100, Math.max(0, value))

  return (
    <div
      className={`${styles.track} ${styles[`track--${size}`]}`}
      role="progressbar"
      aria-valuenow={percentual}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`${styles.fill} ${styles[`fill--${color}`]}`} style={{ width: `${percentual}%` }} />
    </div>
  )
}

import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import styles from './HeatmapCard.module.css'

type HeatmapCardProps = {
  title: string
  subtitle?: string
  weekdayLabels: string[]
  weeks: number[][]
}

const LEGEND_LEVELS = [1, 2, 3, 4]

export function HeatmapCard({ title, subtitle, weekdayLabels, weeks }: HeatmapCardProps) {
  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <div className={styles.grid}>
        <div className={styles.weekdays}>
          {weekdayLabels.map((label, index) => (
            <span key={`${label}-${index}`} className={styles.weekdayLabel}>
              {label}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div className={styles.week} key={weekIndex}>
            {week.map((level, dayIndex) => (
              <span
                key={dayIndex}
                className={`${styles.cell} ${styles[`cell--${level}`]}`}
                title={`Nível de estudo: ${level}/4`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendLabel}>Menos</span>
        {LEGEND_LEVELS.map((level) => (
          <span key={level} className={`${styles.legendDot} ${styles[`cell--${level}`]}`} />
        ))}
        <span className={styles.legendLabel}>Mais</span>
      </div>
    </CardDiv>
  )
}

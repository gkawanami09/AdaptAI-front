import { CardDiv } from '../cards/CardDiv'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/icons'
import styles from './WeekDayPicker.module.css'

export type WeekDayItem = {
  label: string
  date: number
  hasTasks?: boolean
}

type WeekDayPickerProps = {
  days: WeekDayItem[]
  selected: number
  onSelect: (date: number) => void
  onPrevWeek?: () => void
  onNextWeek?: () => void
  prevLabel?: string
  nextLabel?: string
}

export function WeekDayPicker({
  days,
  selected,
  onSelect,
  onPrevWeek,
  onNextWeek,
  prevLabel = 'Semana anterior',
  nextLabel = 'Próxima semana',
}: WeekDayPickerProps) {
  return (
    <CardDiv>
      <div className={styles.row}>
        <button type="button" className={styles.navButton} onClick={onPrevWeek} aria-label={prevLabel}>
          <ChevronLeftIcon />
        </button>

        <div className={styles.days}>
          {days.map((day) => {
            const isActive = day.date === selected

            return (
              <button
                key={day.date}
                type="button"
                className={`${styles.day}${isActive ? ` ${styles['day--active']}` : ''}`}
                onClick={() => onSelect(day.date)}
              >
                <span className={styles.dayLabel}>{day.label}</span>
                <span className={styles.dayNumber}>{day.date}</span>
                {day.hasTasks && (
                  <span className={styles.dots}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <button type="button" className={styles.navButton} onClick={onNextWeek} aria-label={nextLabel}>
          <ChevronRightIcon />
        </button>
      </div>
    </CardDiv>
  )
}

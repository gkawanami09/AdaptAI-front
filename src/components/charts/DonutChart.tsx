import { useState } from 'react'
import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import styles from './DonutChart.module.css'

export type DonutChartSliceColor = 'purple' | 'green' | 'blue' | 'gold' | 'red' | 'teal'

export type DonutChartSlice = {
  label: string
  value: number
  percentual: number
  color: DonutChartSliceColor
}

type DonutChartProps = {
  title: string
  slices: DonutChartSlice[]
  centerLabel: string
  centerValue: string
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DonutChart({ title, slices, centerLabel, centerValue }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  let offsetAcc = 0

  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.wrapper}>
        <div className={styles.plot}>
          <svg viewBox="0 0 100 100" className={styles.svg}>
            {slices.map((slice, index) => {
              const dash = (slice.percentual / 100) * CIRCUMFERENCE
              const offset = -offsetAcc
              offsetAcc += dash

              return (
                <circle
                  key={slice.label}
                  cx="50"
                  cy="50"
                  r={RADIUS}
                  className={`${styles.slice} ${styles[`slice--${slice.color}`]}${activeIndex === index ? ` ${styles['slice--active']}` : ''}`}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={offset}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              )
            })}
          </svg>

          <div className={styles.center}>
            <span className={styles.centerValue}>{centerValue}</span>
            <span className={styles.centerLabel}>{centerLabel}</span>
          </div>
        </div>

        <div className={styles.legend}>
          {slices.map((slice, index) => (
            <button
              type="button"
              key={slice.label}
              className={styles.legendItem}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className={`${styles.legendDot} ${styles[`legendDot--${slice.color}`]}`} />
              <span className={styles.legendLabel}>{slice.label}</span>
              <span className={styles.legendValue}>
                {slice.value.toLocaleString('pt-BR')} ({slice.percentual.toFixed(1)}%)
              </span>
            </button>
          ))}
        </div>
      </div>
    </CardDiv>
  )
}

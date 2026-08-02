import { useState } from 'react'
import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import styles from './GrowthChart.module.css'

export type GrowthChartSeriesColor = 'purple' | 'blue' | 'green' | 'gold'

const SERIES_HEX: Record<GrowthChartSeriesColor, string> = {
  purple: '#6c5ce7',
  blue: '#3b82f6',
  green: '#0d9668',
  gold: '#f59e0b',
}

export type GrowthChartSeries = {
  id: string
  label: string
  color: GrowthChartSeriesColor
  values: number[]
}

type GrowthChartProps = {
  title: string
  labels: string[]
  series: GrowthChartSeries[]
  periodSelector?: React.ReactNode
}

const TICK_STEPS = 4

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return ''

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

export function GrowthChart({ title, labels, series, periodSelector }: GrowthChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedMax = Math.max(...series.flatMap((serie) => serie.values), 1)
  const ticks = Array.from({ length: TICK_STEPS + 1 }, (_, index) => (resolvedMax / TICK_STEPS) * (TICK_STEPS - index))

  const seriesPoints = series.map((serie) => ({
    ...serie,
    points: serie.values.map((value, index) => ({
      x: labels.length > 1 ? (index / (labels.length - 1)) * 100 : 50,
      y: 100 - (value / resolvedMax) * 100,
    })),
  }))

  return (
    <CardDiv>
      <div className={styles.headingRow}>
        <CardHeading>{title}</CardHeading>
        {periodSelector}
      </div>

      <div className={styles.legend}>
        {series.map((serie) => (
          <span key={serie.id} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: SERIES_HEX[serie.color] }} />
            {serie.label}
          </span>
        ))}
      </div>

      <div className={styles.chart}>
        <div className={styles.yAxis}>
          {ticks.map((tick) => (
            <span key={tick} className={styles.tick}>
              {tick >= 1000 ? `${(tick / 1000).toFixed(tick % 1000 === 0 ? 0 : 1)}K` : Math.round(tick)}
            </span>
          ))}
        </div>

        <div className={styles.plotColumn}>
          <div className={styles.plot}>
            <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none">
              {ticks.map((tick) => (
                <line
                  key={tick}
                  x1={0}
                  x2={100}
                  y1={100 - (tick / resolvedMax) * 100}
                  y2={100 - (tick / resolvedMax) * 100}
                  className={styles.gridline}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {seriesPoints.map((serie) => (
                <path
                  key={serie.id}
                  d={buildSmoothPath(serie.points)}
                  className={styles.line}
                  style={{ stroke: SERIES_HEX[serie.color] }}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {labels.map((label, index) => (
              <button
                key={label}
                type="button"
                className={styles.hitArea}
                style={{ left: `${(index / (labels.length - 1)) * 100}%`, width: `${100 / labels.length}%` }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                aria-label={label}
              >
                {activeIndex === index && (
                  <>
                    <span className={styles.crosshair} />
                    <span className={styles.tooltip}>
                      <strong>{label}</strong>
                      {seriesPoints.map((serie) => (
                        <span key={serie.id} className={styles.tooltipRow}>
                          <span className={styles.tooltipDot} style={{ background: SERIES_HEX[serie.color] }} />
                          {serie.label}: {serie.values[index].toLocaleString('pt-BR')}
                        </span>
                      ))}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className={styles.xLabels}>
            {labels.map((label) => (
              <span key={label} className={styles.xLabel}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CardDiv>
  )
}

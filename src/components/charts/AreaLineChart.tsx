import { useState } from 'react'
import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import styles from './AreaLineChart.module.css'

export type AreaLineChartPoint = {
  label: string
  value: number
}

type AreaLineChartProps = {
  title: string
  data: AreaLineChartPoint[]
  maxValue?: number
  valueSuffix?: string
}

const TICK_STEPS = 4

// Catmull-Rom -> Bezier, so the line reads as a smooth trend rather than sharp joins.
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

export function AreaLineChart({ title, data, maxValue, valueSuffix = 'h' }: AreaLineChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const resolvedMax = maxValue ?? Math.max(...data.map((point) => point.value), 1)
  const ticks = Array.from({ length: TICK_STEPS + 1 }, (_, index) => (resolvedMax / TICK_STEPS) * (TICK_STEPS - index))

  const points = data.map((point, index) => ({
    x: data.length > 1 ? (index / (data.length - 1)) * 100 : 50,
    y: 100 - (point.value / resolvedMax) * 100,
  }))

  const linePath = buildSmoothPath(points)
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z` : ''

  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.chart}>
        <div className={styles.yAxis}>
          {ticks.map((tick) => (
            <span key={tick} className={styles.tick}>
              {tick % 1 === 0 ? tick : tick.toFixed(1)}
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
              <path d={areaPath} className={styles.area} />
              <path d={linePath} className={styles.line} vectorEffect="non-scaling-stroke" />
            </svg>

            {points.map((point, index) => (
              <button
                key={data[index].label}
                type="button"
                className={styles.hitArea}
                style={{ left: `${point.x}%`, width: `${100 / data.length}%` }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                aria-label={`${data[index].label}: ${data[index].value}${valueSuffix}`}
              >
                {activeIndex === index && (
                  <>
                    <span className={styles.crosshair} />
                    <span className={styles.dot} style={{ top: `${point.y}%` }} />
                    <span className={styles.tooltip} style={{ top: `${point.y}%` }}>
                      {data[index].label} · {data[index].value}
                      {valueSuffix}
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>

          <div className={styles.xLabels}>
            {data.map((point) => (
              <span key={point.label} className={styles.xLabel}>
                {point.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </CardDiv>
  )
}

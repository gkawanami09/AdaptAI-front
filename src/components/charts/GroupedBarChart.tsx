import { useState } from 'react'
import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import styles from './GroupedBarChart.module.css'

export type GroupedBarChartSeriesColor = 'blue' | 'green' | 'red'

export type GroupedBarChartSeries = {
  name: string
  color: GroupedBarChartSeriesColor
  values: number[]
}

type GroupedBarChartProps = {
  title: string
  categories: string[]
  series: GroupedBarChartSeries[]
  maxValue?: number
  valueSuffix?: string
}

const TICK_STEPS = 4

export function GroupedBarChart({ title, categories, series, maxValue = 100, valueSuffix = '%' }: GroupedBarChartProps) {
  const [active, setActive] = useState<{ category: string; seriesName: string } | null>(null)

  const ticks = Array.from({ length: TICK_STEPS + 1 }, (_, index) => Math.round((maxValue / TICK_STEPS) * (TICK_STEPS - index)))

  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.chart}>
        <div className={styles.yAxis}>
          {ticks.map((tick) => (
            <span key={tick} className={styles.tick}>
              {tick}
            </span>
          ))}
        </div>

        <div className={styles.plotColumn}>
          <div className={styles.plot}>
            {ticks.map((tick) => (
              <div key={tick} className={styles.gridline} style={{ bottom: `${(tick / maxValue) * 100}%` }} />
            ))}

            <div className={styles.groups}>
              {categories.map((category, categoryIndex) => (
                <div className={styles.group} key={category}>
                  {series.map((item) => {
                    const value = item.values[categoryIndex] ?? 0
                    const isActive = active?.category === category && active.seriesName === item.name

                    return (
                      <div
                        key={item.name}
                        className={`${styles.bar} ${styles[`bar--${item.color}`]}`}
                        style={{ height: `${Math.max((value / maxValue) * 100, 1.5)}%` }}
                        onMouseEnter={() => setActive({ category, seriesName: item.name })}
                        onMouseLeave={() => setActive(null)}
                      >
                        {isActive && (
                          <span className={styles.tooltip}>
                            {item.name} · {value}
                            {valueSuffix}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.categoryLabels}>
            {categories.map((category) => (
              <span key={category} className={styles.categoryLabel}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        {series.map((item) => (
          <span key={item.name} className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles[`legendDot--${item.color}`]}`} />
            {item.name}
          </span>
        ))}
      </div>
    </CardDiv>
  )
}

import { CardDiv } from '../cards/CardDiv'
import { CardHeading } from '../cards/CardHeading'
import styles from './GraphBars.module.css'

export type GraphBarsDatum = {
  label: string
  value: number
}

type GraphBarsProps = {
  title: string
  data: GraphBarsDatum[]
}

export function GraphBars({ title, data }: GraphBarsProps) {
  const max = Math.max(...data.map((item) => item.value), 1)

  return (
    <CardDiv>
      <CardHeading>{title}</CardHeading>

      <div className={styles.chart}>
        <div className={styles.ceiling} />

        <div className={styles.bars}>
          {data.map((item) => (
            <div className={styles.column} key={item.label}>
              <div className={styles.track}>
                <div className={styles.bar} style={{ height: `${(item.value / max) * 100}%` }}>
                  <span className={styles.tooltip}>{item.value}%</span>
                </div>
              </div>
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </CardDiv>
  )
}

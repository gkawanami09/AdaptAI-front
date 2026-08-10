import styles from './SliderField.module.css'

export type SliderStep = {
  value: number
  label: string
}

type SliderFieldProps = {
  steps: SliderStep[]
  value: number
  onChange: (value: number) => void
  valueLabel: string
}

export function SliderField({ steps, value, onChange, valueLabel }: SliderFieldProps) {
  const index = Math.max(0, steps.findIndex((step) => step.value === value))
  const percent = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.trackWrapper}>
        <span className={styles.bubble} style={{ left: `${percent}%` }}>
          {valueLabel}
        </span>
        <input
          type="range"
          className={styles.range}
          min={0}
          max={steps.length - 1}
          step={1}
          value={index}
          onChange={(event) => onChange(steps[Number(event.target.value)].value)}
          style={{ ['--slider-percent' as string]: `${percent}%` }}
          aria-label="Tempo de estudo por dia"
        />
      </div>
      <div className={styles.labels}>
        {steps.map((step) => (
          <span key={step.value} className={step.value === value ? styles.labelActive : undefined}>
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}

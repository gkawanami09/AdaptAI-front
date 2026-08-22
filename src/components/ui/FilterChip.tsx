import './FilterChip.css'

type FilterChipProps = {
  label: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function FilterChip({ label, selected, disabled, onClick, size = 'sm' }: FilterChipProps) {
  const classes = [
    'filter-chip',
    selected && 'filter-chip--active',
    size === 'md' && 'filter-chip--md',
    disabled && 'filter-chip--disabled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} disabled={disabled} aria-pressed={selected}>
      {label}
    </button>
  )
}

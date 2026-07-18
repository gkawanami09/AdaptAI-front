import './FilterChip.css'

type FilterChipProps = {
  label: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function FilterChip({ label, selected, onClick, size = 'sm' }: FilterChipProps) {
  const classes = ['filter-chip', selected && 'filter-chip--active', size === 'md' && 'filter-chip--md']
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={selected}>
      {label}
    </button>
  )
}

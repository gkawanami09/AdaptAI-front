import './FilterChip.css'

type FilterChipProps = {
  label: string
  selected?: boolean
  onClick?: () => void
}

export function FilterChip({ label, selected, onClick }: FilterChipProps) {
  const classes = ['filter-chip', selected && 'filter-chip--active'].filter(Boolean).join(' ')

  return (
    <button type="button" className={classes} onClick={onClick} aria-pressed={selected}>
      {label}
    </button>
  )
}

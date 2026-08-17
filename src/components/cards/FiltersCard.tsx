import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { FilterChip } from '../ui/FilterChip'
import { FilterIcon } from '../ui/icons'
import styles from './FiltersCard.module.css'

export type FilterOption = {
  value: string
  label: string
}

export type FilterGroup = {
  label: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
  display?: 'chip' | 'list'
}

export type FilterShortcut = {
  label: string
  icon?: ReactNode
  active?: boolean
  onClick?: () => void
}

type FiltersCardProps = {
  title: string
  groups: FilterGroup[]
  shortcuts?: FilterShortcut[]
}

export function FiltersCard({ title, groups, shortcuts }: FiltersCardProps) {
  return (
    <CardDiv>
      <div className={styles.header}>
        <FilterIcon className={styles.headerIcon} />
        <CardHeading>{title}</CardHeading>
      </div>

      {groups.map((group) => (
        <div className={styles.group} key={group.label}>
          <span className={styles.groupLabel}>{group.label}</span>

          {group.display === 'list' ? (
            <div className={styles.list}>
              {group.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.listItem}${
                    group.selected.includes(option.value) ? ` ${styles['listItem--active']}` : ''
                  }`}
                  onClick={() => group.onToggle(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.chips}>
              {group.options.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={group.selected.includes(option.value)}
                  onClick={() => group.onToggle(option.value)}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {shortcuts && shortcuts.length > 0 && (
        <div className={styles.shortcuts}>
          {shortcuts.map((shortcut) => (
            <button
              key={shortcut.label}
              type="button"
              className={`${styles.shortcut}${shortcut.active ? ` ${styles['shortcut--active']}` : ''}`}
              aria-pressed={shortcut.active}
              onClick={shortcut.onClick}
            >
              <span className={styles.shortcutDot} />
              {shortcut.label}
            </button>
          ))}
        </div>
      )}
    </CardDiv>
  )
}

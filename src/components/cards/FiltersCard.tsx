import { useState } from 'react'
import type { ReactNode } from 'react'
import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { FilterChip } from '../ui/FilterChip'
import { FilterIcon, SearchIcon } from '../ui/icons'
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
  const [buscas, setBuscas] = useState<Record<string, string>>({})

  return (
    <CardDiv>
      <div className={styles.header}>
        <FilterIcon className={styles.headerIcon} />
        <CardHeading>{title}</CardHeading>
      </div>

      {groups.map((group) => {
        const busca = buscas[group.label] ?? ''
        const opcoesFiltradas =
          group.display === 'list' && busca.trim()
            ? group.options.filter((option) => option.label.toLowerCase().includes(busca.trim().toLowerCase()))
            : group.options

        return (
          <div className={styles.group} key={group.label}>
            <span className={styles.groupLabel}>{group.label}</span>

            {group.display === 'list' ? (
              <>
                <div className={styles.search}>
                  <SearchIcon className={styles.searchIcon} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={`Buscar ${group.label.toLowerCase()}...`}
                    value={busca}
                    onChange={(event) => setBuscas((current) => ({ ...current, [group.label]: event.target.value }))}
                  />
                </div>

                <div className={styles.list}>
                  {opcoesFiltradas.length > 0 ? (
                    opcoesFiltradas.map((option) => (
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
                    ))
                  ) : (
                    <span className={styles.searchEmpty}>Nenhum resultado encontrado.</span>
                  )}
                </div>
              </>
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
        )
      })}

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

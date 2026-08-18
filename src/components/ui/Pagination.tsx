import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const MAX_VISIBLE_PAGES = 7

function getVisiblePages(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  const sorted = [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b)

  const withEllipsis: (number | 'ellipsis')[] = []
  sorted.forEach((item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) withEllipsis.push('ellipsis')
    withEllipsis.push(item)
  })

  return withEllipsis
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = getVisiblePages(page, totalPages)

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.navButton}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon />
      </button>

      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${styles.pageButton}${item === page ? ` ${styles['pageButton--active']}` : ''}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.navButton}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Próxima página"
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}

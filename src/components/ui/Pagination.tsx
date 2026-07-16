import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

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

      {pages.map((item) => (
        <button
          key={item}
          type="button"
          className={`${styles.pageButton}${item === page ? ` ${styles['pageButton--active']}` : ''}`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}

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

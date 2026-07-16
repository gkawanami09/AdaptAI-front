import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export type BreadcrumbItem = {
  label: string
  to?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={item.label} className={styles.item}>
            {item.to && !isLast ? (
              <Link className={styles.link} to={item.to}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.current : styles.link}>{item.label}</span>
            )}
            {!isLast && <span className={styles.separator}>/</span>}
          </span>
        )
      })}
    </nav>
  )
}

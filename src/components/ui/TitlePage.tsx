import styles from './TitlePage.module.css'

type TitlePageProps = {
  title?: string
  subtitle?: string
}

export function TitlePage({ title, subtitle }: TitlePageProps) {
  if (!title && !subtitle) return null

  return (
    <div className={styles.container}>
      {title && <p className={styles.title}>{title}</p>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}

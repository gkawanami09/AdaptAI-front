import styles from './CardHeading.module.css'

type CardHeadingProps = {
  children: string
}

export function CardHeading({ children }: CardHeadingProps) {
  return <p className={styles.heading}>{children}</p>
}

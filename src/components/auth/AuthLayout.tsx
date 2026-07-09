import type { ReactNode } from 'react'
import { AdaMascot } from '../AdaMascot'
import { BoltIcon } from '../ui/icons'
import styles from './AuthLayout.module.css'

type AuthLayoutProps = {
  title: string
  subtitle: string
  bubbleTitle: string
  bubbleText: string
  showcaseExtra?: ReactNode
  contentClassName?: string
  children: ReactNode
}

export function AuthLayout({
  title,
  subtitle,
  bubbleTitle,
  bubbleText,
  showcaseExtra,
  contentClassName,
  children,
}: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <div className={[styles.panelContent, contentClassName].filter(Boolean).join(' ')}>
          <div className={styles.brand}>
            <span className={styles.brandLogo}>
              <BoltIcon />
            </span>
            <span className={styles.brandName}>AdaptAI</span>
          </div>

          <div className={styles.heading}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </div>
      </section>

      <section className={styles.showcasePanel}>
        <AdaMascot className={styles.mascot} />

        <div className={styles.bubble}>
          <p className={styles.bubbleTitle}>{bubbleTitle}</p>
          <p className={styles.bubbleText}>{bubbleText}</p>
        </div>

        {showcaseExtra}
      </section>
    </div>
  )
}

import styles from "./CardTitle.module.css"

type CardTitleProps = {
    title: string
}

export function CardTitle ({title}: CardTitleProps) {
    return (    
        <p className={styles.title}>{title}</p>
    )
}
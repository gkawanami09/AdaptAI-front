import { CardDiv } from './CardDiv'
import { Button } from '../ui/Button'
import { AdaAvatar } from '../chat/AdaAvatar'
import { ClipboardIcon, SparklesIcon } from '../ui/icons'
import styles from './ChatHeaderCard.module.css'

type ChatHeaderCardProps = {
  name: string
  status: string
  onQuestoes?: () => void
  onRevisao?: () => void
}

export function ChatHeaderCard({ name, status, onQuestoes, onRevisao }: ChatHeaderCardProps) {
  return (
    <CardDiv>
      <div className={styles.row}>
        <AdaAvatar />

        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            {status}
          </span>
        </div>

        <div className={styles.actions}>
          <Button variant="outline" size="sm" fullWidth={false} icon={<ClipboardIcon />} iconPosition="left" onClick={onQuestoes}>
            Questões
          </Button>
          <Button variant="outline" size="sm" fullWidth={false} icon={<SparklesIcon />} iconPosition="left" onClick={onRevisao}>
            Revisão
          </Button>
        </div>
      </div>
    </CardDiv>
  )
}

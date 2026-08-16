import { CardDiv } from './CardDiv'
import { CardHeading } from './CardHeading'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { useBrowserNotifications } from '../../hooks/useBrowserNotifications'
import styles from './PrivacyCard.module.css'

const STATUS_LABEL: Record<string, { text: string; color: 'green' | 'red' | 'gray' }> = {
  granted: { text: 'Ativadas', color: 'green' },
  denied: { text: 'Bloqueadas pelo navegador', color: 'red' },
  default: { text: 'Não ativadas', color: 'gray' },
  unsupported: { text: 'Não suportado', color: 'gray' },
}

export function BrowserNotificationsCard() {
  const { permission, requestPermission } = useBrowserNotifications()
  const status = STATUS_LABEL[permission]

  return (
    <CardDiv>
      <CardHeading>Notificações do navegador</CardHeading>

      <div className={styles.list}>
        <div className={styles.row} style={{ cursor: 'default' }}>
          <div className={styles.info}>
            <span className={styles.label}>Alertas no navegador</span>
            <span className={styles.description}>
              {permission === 'denied'
                ? 'Você bloqueou as notificações. Altere isso nas configurações do navegador.'
                : permission === 'unsupported'
                  ? 'Seu navegador não suporta notificações.'
                  : 'Receba avisos da AdaptAI diretamente no navegador.'}
            </span>
          </div>
          <Badge color={status.color}>{status.text}</Badge>
        </div>

        {permission === 'default' && (
          <Button fullWidth={false} size="sm" onClick={requestPermission}>
            Ativar notificações
          </Button>
        )}
      </div>
    </CardDiv>
  )
}

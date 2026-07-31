import { Button } from '../ui/Button'
import { SaveIcon } from '../ui/icons'
import styles from './SaveBar.module.css'

type SaveBarProps = {
  salvando?: boolean
  onSave: () => void
}

export function SaveBar({ salvando, onSave }: SaveBarProps) {
  return (
    <div className={styles.actions}>
      <Button fullWidth={false} icon={<SaveIcon />} iconPosition="left" onClick={onSave} disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  )
}

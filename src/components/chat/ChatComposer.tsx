import type { FormEvent, ReactNode } from 'react'
import { Button } from '../ui/Button'
import { AlertCircleIcon, ChatIcon, SendIcon } from '../ui/icons'
import styles from './ChatComposer.module.css'

export type QuickAction = {
  label: string
  icon: ReactNode
  onClick?: () => void
}

type ChatComposerProps = {
  quickActions: QuickAction[]
  value: string
  onChange: (value: string) => void
  onSend?: () => void
  placeholder?: string
}

export function ChatComposer({ quickActions, value, onChange, onSend, placeholder }: ChatComposerProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!value.trim()) return
    onSend?.()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.quickActions}>
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              pill
              size="sm"
              fullWidth={false}
              icon={action.icon}
              iconPosition="left"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}

          <button type="button" className={styles.infoButton} aria-label="Mais informações">
            <AlertCircleIcon />
          </button>
        </div>

        <form className={styles.inputBar} onSubmit={handleSubmit}>
          <ChatIcon className={styles.inputIcon} />
          <input
            className={styles.input}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
          />
          <button type="submit" className={styles.sendButton} aria-label="Enviar mensagem">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  )
}

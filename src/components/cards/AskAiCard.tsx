import type { FormEvent } from 'react'
import { CardDiv } from './CardDiv'
import { AdaAvatar } from '../chat/AdaAvatar'
import { ChatMessage } from '../chat/ChatMessage'
import type { ChatSender } from '../chat/ChatMessage'
import { XIcon, SendIcon } from '../ui/icons'
import styles from './AskAiCard.module.css'

export type AskAiMessage = {
  sender: ChatSender
  text: string
  time: string
}

type AskAiCardProps = {
  messages: AskAiMessage[]
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onClose: () => void
}

export function AskAiCard({ messages, value, onChange, onSend, onClose }: AskAiCardProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!value.trim()) return
    onSend()
  }

  return (
    <CardDiv>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <AdaAvatar size="sm" />
          <span className={styles.title}>Explicar com IA</span>
        </div>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          <XIcon />
        </button>
      </div>

      <div className={styles.messages}>
        {messages.map((message, index) => (
          <ChatMessage key={index} sender={message.sender} text={message.text} time={message.time} />
        ))}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Pergunte algo sobre esta questão..."
        />
        <button type="submit" className={styles.sendButton} aria-label="Enviar pergunta">
          <SendIcon />
        </button>
      </form>
    </CardDiv>
  )
}

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { AdaAvatar } from './AdaAvatar'
import styles from './ChatMessage.module.css'

export type ChatSender = 'ada' | 'user'

type ChatMessageProps = {
  sender: ChatSender
  text: string
  time: string
}

export function ChatMessage({ sender, text, time }: ChatMessageProps) {
  const isAda = sender === 'ada'
  const rowClasses = [styles.row, isAda ? styles['row--ada'] : styles['row--user']].join(' ')

  return (
    <div className={rowClasses}>
      {isAda && <AdaAvatar size="sm" />}

      <div className={styles.column}>
        <div className={`${styles.bubble} ${isAda ? styles['bubble--ada'] : styles['bubble--user']}`}>
          {isAda ? (
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {text}
              </ReactMarkdown>
            </div>
          ) : (
            text
          )}
        </div>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  )
}

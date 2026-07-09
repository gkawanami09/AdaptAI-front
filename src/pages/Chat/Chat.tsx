import { useState } from 'react'
import { ChatHeaderCard } from '../../components/cards/ChatHeaderCard'
import { ChatMessage } from '../../components/chat/ChatMessage'
import { ChatComposer } from '../../components/chat/ChatComposer'
import { ChatIcon, ClipboardIcon, SparklesIcon, FeatherIcon } from '../../components/ui/icons'
import styles from './Chat.module.css'

// TODO: substituir pelo histórico real vindo do backend (endpoint de conversas)
const MENSAGENS = [
  {
    sender: 'ada' as const,
    text: 'Olá, Guilherme! Sou a Ada, sua tutora de IA. Estou aqui para te ajudar com qualquer dúvida sobre o ENEM ou vestibulares. O que você quer aprender hoje?',
    time: '09:30',
  },
]

export function Chat() {
  const [mensagem, setMensagem] = useState('')

  function handleQuestoes() {
    // TODO: conectar à navegação/ação real de "Questões" a partir do chat
    console.log('abrir questões')
  }

  function handleRevisao() {
    // TODO: conectar à navegação/ação real de "Revisão" a partir do chat
    console.log('abrir revisão')
  }

  function handleEnviarMensagem() {
    // TODO: conectar ao backend — enviar a mensagem para a Ada e receber a resposta
    console.log('enviar mensagem', mensagem)
    setMensagem('')
  }

  const acoesRapidas = [
    { label: 'Explique de forma simples', icon: <ChatIcon />, onClick: () => setMensagem('Explique de forma simples') },
    { label: 'Crie questões sobre o tema', icon: <ClipboardIcon />, onClick: () => setMensagem('Crie questões sobre o tema') },
    { label: 'Monte uma revisão', icon: <SparklesIcon />, onClick: () => setMensagem('Monte uma revisão') },
    { label: 'Corrija minha redação', icon: <FeatherIcon />, onClick: () => setMensagem('Corrija minha redação') },
  ]

  return (
    <main className={styles.page}>
      <ChatHeaderCard name="Ada — Tutora IA" status="Online agora" onQuestoes={handleQuestoes} onRevisao={handleRevisao} />

      <div className={styles.messages}>
        {MENSAGENS.map((item, index) => (
          <ChatMessage key={index} sender={item.sender} text={item.text} time={item.time} />
        ))}
      </div>

      <ChatComposer
        quickActions={acoesRapidas}
        value={mensagem}
        onChange={setMensagem}
        onSend={handleEnviarMensagem}
        placeholder="Pergunte qualquer coisa para a Ada..."
      />
    </main>
  )
}

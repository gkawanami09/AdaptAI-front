import { useEffect, useRef, useState } from 'react'
import { ChatHeaderCard } from '../../components/cards/ChatHeaderCard'
import { ChatMessage } from '../../components/chat/ChatMessage'
import { ChatComposer } from '../../components/chat/ChatComposer'
import { Button } from '../../components/ui/Button'
import { ChatIcon, ClipboardIcon, SparklesIcon, FeatherIcon } from '../../components/ui/icons'
import { useChat } from '../../hooks/useChat'
import styles from './Chat.module.css'

export function Chat() {
  const [mensagem, setMensagem] = useState('')
  const {
    mensagens,
    carregando,
    enviando,
    adaEscrevendo,
    erro,
    podeReenviar,
    enviarMensagem,
    reenviarUltimaMensagem,
    formatarHora,
  } = useChat()
  const mensagensEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mensagensEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, adaEscrevendo])

  function handleQuestoes() {
    // TODO: conectar à navegação/ação real de "Questões" a partir do chat
    console.log('abrir questões')
  }

  function handleRevisao() {
    // TODO: conectar à navegação/ação real de "Revisão" a partir do chat
    console.log('abrir revisão')
  }

  function handleEnviarMensagem() {
    if (!mensagem.trim() || enviando) return
    enviarMensagem(mensagem)
    setMensagem('')
  }

  function handleAcaoRapida(texto: string) {
    if (enviando) return
    enviarMensagem(texto)
  }

  const acoesRapidas = [
    { label: 'Explique de forma simples', icon: <ChatIcon />, onClick: () => handleAcaoRapida('Explique de forma simples') },
    { label: 'Crie questões sobre o tema', icon: <ClipboardIcon />, onClick: () => handleAcaoRapida('Crie questões sobre o tema') },
    { label: 'Monte uma revisão', icon: <SparklesIcon />, onClick: () => handleAcaoRapida('Monte uma revisão') },
    { label: 'Corrija minha redação', icon: <FeatherIcon />, onClick: () => handleAcaoRapida('Corrija minha redação') },
  ]

  return (
    <main className={styles.page}>
      <ChatHeaderCard name="Ada — Tutora IA" status="Online agora" onQuestoes={handleQuestoes} onRevisao={handleRevisao} />

      <div className={styles.messages}>
        {carregando && <ChatMessage sender="ada" text="Carregando conversa..." time="" />}

        {!carregando &&
          mensagens.map((item) => (
            <ChatMessage key={item.id} sender={item.sender === 'user' ? 'user' : 'ada'} text={item.texto} time={formatarHora(item.timestamp)} />
          ))}

        {adaEscrevendo && <ChatMessage sender="ada" text="Ada está pensando..." time="" />}

        {erro && !carregando && (
          <div className={styles.errorBanner}>
            <span>Não foi possível falar com a Ada agora.</span>
            {podeReenviar && (
              <Button variant="outline" size="sm" fullWidth={false} onClick={reenviarUltimaMensagem}>
                Tentar novamente
              </Button>
            )}
          </div>
        )}

        <div ref={mensagensEndRef} />
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

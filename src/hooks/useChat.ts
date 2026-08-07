import { useEffect, useRef, useState } from 'react'
import { criarChatConversa, enviarChatMensagem, getChatConversas, getChatConversaById } from '../services/chat'
import type { ChatMensagem, ChatStatus } from '../types/chat'

const MENSAGEM_INICIAL_ADA: ChatMensagem = {
    id: 'inicial',
    sender: 'ada',
    texto: 'Olá! Sou a Ada, sua tutora de IA. Estou aqui para te ajudar com qualquer dúvida sobre o ENEM ou vestibulares. O que você quer aprender hoje?',
    timestamp: ''
}

function formatarHora(timestamp: string): string {
    if (!timestamp) return ''
    const data = new Date(timestamp)
    if (Number.isNaN(data.getTime())) return timestamp
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function useChat() {
    const [conversaId, setConversaId] = useState<string | null>(null)
    const [mensagens, setMensagens] = useState<ChatMensagem[]>([])
    const [status, setStatus] = useState<ChatStatus>('idle')
    const [erro, setErro] = useState(false)
    const [enviando, setEnviando] = useState(false)
    const [adaEscrevendo, setAdaEscrevendo] = useState(false)
    const ultimaMensagemFalhaRef = useRef<string | null>(null)

    async function carregarHistorico() {
        setStatus('loading')
        setErro(false)

        try {
            const resposta = await getChatConversas()
            const conversaAtual = resposta.conversas[0]

            if (!conversaAtual) {
                const novaConversa = await criarChatConversa()
                setConversaId(novaConversa.id)
                setMensagens([MENSAGEM_INICIAL_ADA])
                setStatus('empty')
                return
            }

            setConversaId(conversaAtual.id)
            const detalhe = await getChatConversaById(conversaAtual.id)

            if (!detalhe.mensagens || detalhe.mensagens.length === 0) {
                setMensagens([MENSAGEM_INICIAL_ADA])
                setStatus('empty')
            } else {
                setMensagens(detalhe.mensagens)
                setStatus('idle')
            }
        } catch (err) {
            console.error(err)
            setErro(true)
            setStatus('error')
            setMensagens([MENSAGEM_INICIAL_ADA])
        }
    }

    async function enviarMensagem(texto: string) {
        const textoLimpo = texto.trim()
        if (!textoLimpo || enviando) return

        let idConversa = conversaId
        if (!idConversa) {
            try {
                const novaConversa = await criarChatConversa()
                idConversa = novaConversa.id
                setConversaId(idConversa)
            } catch (err) {
                console.error(err)
                setErro(true)
                return
            }
        }

        const mensagemUsuario: ChatMensagem = {
            id: `temp-${Date.now()}`,
            sender: 'user',
            texto: textoLimpo,
            timestamp: new Date().toISOString()
        }

        setMensagens((atual) => [...atual, mensagemUsuario])
        setEnviando(true)
        setAdaEscrevendo(true)
        setErro(false)
        ultimaMensagemFalhaRef.current = null

        try {
            // TODO: quando o streaming (SSE) estiver disponível, substituir por
            // streamChatResposta e atualizar a mensagem da Ada token por token.
            const resposta = await enviarChatMensagem(idConversa, { mensagem: textoLimpo })

            setMensagens((atual) => [
                ...atual,
                {
                    id: resposta.assistant.id,
                    sender: 'ada',
                    texto: resposta.assistant.texto,
                    timestamp: resposta.assistant.timestamp,
                    sugestoes: resposta.sugestoes,
                    tokens: resposta.tokensUsados,
                    modelo: resposta.modelo
                }
            ])
        } catch (err) {
            console.error(err)
            setErro(true)
            ultimaMensagemFalhaRef.current = textoLimpo
        } finally {
            setEnviando(false)
            setAdaEscrevendo(false)
        }
    }

    function reenviarUltimaMensagem() {
        const textoFalhado = ultimaMensagemFalhaRef.current
        if (!textoFalhado) return
        setMensagens((atual) => atual.filter((item) => item.texto !== textoFalhado || item.sender !== 'user'))
        enviarMensagem(textoFalhado)
    }

    useEffect(() => {
        carregarHistorico()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        conversaId,
        mensagens,
        status,
        carregando: status === 'loading',
        vazio: status === 'empty',
        enviando,
        adaEscrevendo,
        erro,
        podeReenviar: Boolean(ultimaMensagemFalhaRef.current),
        enviarMensagem,
        reenviarUltimaMensagem,
        recarregar: carregarHistorico,
        formatarHora
    }
}

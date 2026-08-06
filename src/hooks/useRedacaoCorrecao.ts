import { useEffect, useState } from 'react'
import { getRedacaoCorrecao } from '../services/redacaoCorrecao'
import type { GetRedacaoCorrecaoResponse } from '../types/redacaoCorrecao'

// TODO: quando o endpoint de correção estiver disponível, trocar a busca única abaixo
// por polling (setInterval) ou assinatura websocket até `status` chegar em "concluida",
// e então a página de processamento deve navegar para a tela de resultado.
export function useRedacaoCorrecao(envioId: string | undefined) {
    const [dados, setDados] = useState<GetRedacaoCorrecaoResponse | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(false)

    async function carregarCorrecao() {
        if (!envioId) return
        setCarregando(true)
        setErro(false)

        try {
            const resposta = await getRedacaoCorrecao(envioId)
            setDados(resposta)
        } catch (err) {
            console.error(err)
            setErro(true)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarCorrecao()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [envioId])

    return { dados, carregando, erro, recarregar: carregarCorrecao }
}

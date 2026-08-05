import { useEffect, useState } from 'react'
import { getConquistas } from '../services/conquistas'
import type { GetConquistasResponse } from '../types/conquistas'

export function useConquistas() {
    const [dados, setDados] = useState<GetConquistasResponse | null>(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState(false)

    async function carregarConquistas() {
        setCarregando(true)
        setErro(false)

        try {
            const resposta = await getConquistas()
            setDados(resposta)
        } catch (err) {
            console.error(err)
            setErro(true)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarConquistas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { dados, carregando, erro, recarregar: carregarConquistas }
}

export type ConquistaRaridade = 'comum' | 'incomum' | 'raro' | 'epico' | 'lendario'

export type ConquistaDesbloqueada = {
    icone: string
    titulo: string
    descricao: string
    raridade: ConquistaRaridade
    xp: number
}

export type ConquistaBloqueada = {
    icone: string
    titulo: string
    descricao: string
    raridade: ConquistaRaridade
}

export type MissaoDiaria = {
    label: string
    xp: number
    completed: boolean
}

export type MissaoSemanal = {
    label: string
    xp: number
    current: number
    target: number
}

export type GetConquistasResponse = {
    subtitulo: string
    ofensiva_dias: number
    xp_total: number
    nivel_atual: number
    xp_proximo_nivel: number
    total_medalhas: number
    conquistas_desbloqueadas: ConquistaDesbloqueada[]
    conquistas_bloqueadas: ConquistaBloqueada[]
    missoes_diarias: MissaoDiaria[]
    missoes_semanais: MissaoSemanal[]
}

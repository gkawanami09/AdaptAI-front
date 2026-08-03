export type BibliotecaAulaStatus = 'concluida' | 'em-andamento' | 'nao-iniciada'

export type BibliotecaCategoria = {
    id: string
    nome: string
}

export type BibliotecaAula = {
    id: string
    slug: string | null
    titulo: string
    materia: string
    materia_cor: 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
    icone: string
    icone_cor: 'purple' | 'green' | 'blue' | 'gold' | 'red'
    duracao_min: number
    dificuldade: string
    progresso: number
    status: BibliotecaAulaStatus
    destaque: boolean
}

export type GetBibliotecaAulasParams = {
    categoria_id?: string
}

export type GetBibliotecaAulasResponse = {
    total_aulas: number
    total_concluidas: number
    subtitulo: string
    categorias: BibliotecaCategoria[]
    aulas: BibliotecaAula[]
}

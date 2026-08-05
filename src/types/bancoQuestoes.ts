export type BancoQuestoesIconeCor = 'purple' | 'green' | 'blue' | 'gold' | 'red'
export type BancoQuestoesBadgeCor = 'purple' | 'green' | 'blue' | 'teal' | 'gold' | 'red' | 'gray'
export type BancoQuestoesProgressoCor = 'purple' | 'teal' | 'gold' | 'red' | 'blue' | 'green' | 'orange'

export type BancoQuestoesFiltroOpcao = {
    value: string
    label: string
}

export type BancoQuestoesLista = {
    id: string
    slug: string | null
    icone: string
    icone_cor: BancoQuestoesIconeCor
    titulo: string
    dificuldade: string
    dificuldade_cor: BancoQuestoesBadgeCor
    vestibular: string
    questoes_concluidas: number
    questoes_totais: number
    progresso_cor: BancoQuestoesProgressoCor
}

export type GetBancoQuestoesFiltrosResponse = {
    vestibulares: BancoQuestoesFiltroOpcao[]
    dificuldades: BancoQuestoesFiltroOpcao[]
    materias: BancoQuestoesFiltroOpcao[]
}

export type GetBancoQuestoesListasParams = {
    vestibulares?: string[]
    dificuldades?: string[]
    materias?: string[]
    apenas_erradas?: boolean
    apenas_favoritas?: boolean
}

export type GetBancoQuestoesListasResponse = {
    total: number
    listas: BancoQuestoesLista[]
}

export type PostGerarListaComIAResponse = {
    id: string
    slug: string | null
}

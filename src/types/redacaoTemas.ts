import type { BadgeColor } from '../components/ui/Badge'
import type { CompetenciaItem } from '../components/cards/CompetenciasCard'

export type RedacaoTemaResumo = {
    id: string
    slug: string
    titulo: string
    tag: string
    tag_cor: BadgeColor
    descricao: string
}

export type GetRedacaoTemasResponse = {
    temas: RedacaoTemaResumo[]
}

export type GetRedacaoTemaResponse = {
    slug: string
    titulo: string
    tag: string
    tag_cor: BadgeColor
    descricao: string
    competencias: CompetenciaItem[]
    repertorios: string[]
    dica_ada: string | null
}

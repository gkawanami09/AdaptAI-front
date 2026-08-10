export type DiaSemana = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type PlanoEstudosGeradoStatus = 'gerando' | 'concluido' | 'erro'

export type ProvaOpcao = {
    slug: string
    nome: string
    descricao?: string
}

export type MateriaOpcao = {
    slug: string
    nome: string
}

export type GetPlanoEstudosOpcoesResponse = {
    provas: ProvaOpcao[]
    materias: MateriaOpcao[]
}

export type PostCriarPlanoEstudosParams = {
    provas: string[]
    materias: string[]
    tempo_por_dia_minutos: number
    dias_estudo: DiaSemana[]
}

export type PostCriarPlanoEstudosResponse = {
    id: string
    status: PlanoEstudosGeradoStatus
    mensagem?: string
}

export type PlanoEstudosGeradoSessao = {
    materia: string
    duracao_minutos: number
    tipo: string
}

export type PlanoEstudosGeradoDia = {
    dia: DiaSemana
    data: string
    sessoes: PlanoEstudosGeradoSessao[]
}

export type PlanoEstudosGeradoSemana = {
    numero: number
    dias: PlanoEstudosGeradoDia[]
}

export type PlanoEstudosGerado = {
    periodo: {
        inicio: string
        fim: string
    }
    semanas: PlanoEstudosGeradoSemana[]
}

export type GetPlanoEstudosGeradoResponse = {
    id: string
    status: PlanoEstudosGeradoStatus
    mensagem?: string
    plano?: PlanoEstudosGerado
}

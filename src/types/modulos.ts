export type Topico = {
    topico_id: string;
    materia_id: string;
    nome: string | null;
    slug: string;
    descricao: string;
    ordem: number;
    atualizado_em: string;
    icone: string | null;
    ativo: boolean;
}

export type GetTopicosPorMateriaParams = {
    materia_id: string
}

export type GetTopicosResponse = {
    sucesso: boolean;
    topicos: Topico[];
}

export type PostTopicoParams = {
    materia_id: string
    nome: string
    descricao?: string | null
    ordem?: number
    icone?: string | null
    ativo?: boolean
}

export type PostTopicoResponse = {
    sucesso: boolean
    mensagem: string
    topico: Topico
}

export type PatchTopicoParams = {
    materia_id?: string
    nome?: string
    descricao?: string | null
    ordem?: number
    icone?: string | null
    ativo?: boolean
}

export type PatchTopicoResponse = {
    sucesso: boolean
    mensagem: string
    topico: Topico
}
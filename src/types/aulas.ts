export type Aula = {
    id: string;
    materia_id: string;
    topico_id: string | null;
    titulo: string;
    slug: string;
    resumo: string | null;
    dificuldade: 'basico' | 'medio' | 'dificil';
    mais_cobrado: boolean;
    ordem: number;
    ativo: boolean;
}

export type GetAulasPorMateriaParams = {
    materia_id: string
}

export type GetAulasPorMateriaResponse = {
    sucesso: boolean;
    total_aulas: number;
    aulas: Aula[];
}

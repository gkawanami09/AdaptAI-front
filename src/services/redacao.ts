import { requestAuthJson } from "./api"

import type { PostRedacaoEnvioParams, PostRedacaoEnvioResponse } from "../types/redacao"

const API_REDACAO_TEMAS_PREFIX = "/aluno/redacao/temas"

// TODO: quando a IA de correção estiver disponível, o backend passará a retornar
// nota e feedback nesta mesma resposta (ou em um endpoint de consulta do envio).
export function enviarRedacao(slug: string, texto: string): Promise<PostRedacaoEnvioResponse> {
    const params: PostRedacaoEnvioParams = { texto }
    return requestAuthJson<PostRedacaoEnvioResponse>(`${API_REDACAO_TEMAS_PREFIX}/${slug}/envios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    })
}

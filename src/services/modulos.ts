import { requestAuthJson } from "./api"

import type { GetTopicosPorMateriaParams } from "../types/modulos"
import type { GetTopicosResponse } from "../types/modulos"
import type { PostTopicoParams } from "../types/modulos"
import type { PostTopicoResponse } from "../types/modulos"
import type { PatchTopicoParams } from "../types/modulos"
import type { PatchTopicoResponse } from "../types/modulos"

const API_TOPICOS_PREFIX = "/admin/topicos"

//get functions
export async function getTopicosPorMateria(params: GetTopicosPorMateriaParams) {
    return requestAuthJson<GetTopicosResponse>(
        `${API_TOPICOS_PREFIX}/${params.materia_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

//post functions
export function postTopico(params: PostTopicoParams) {
    return requestAuthJson<PostTopicoResponse>(API_TOPICOS_PREFIX, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}

//patch functions
//função associada com a edição, recebe o topico_id e os campos alterados
// (params e response em types/modulos.ts)
export function patchTopico(topicoId: string, params: PatchTopicoParams) {
    return requestAuthJson<PatchTopicoResponse>(`${API_TOPICOS_PREFIX}/${topicoId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })
}
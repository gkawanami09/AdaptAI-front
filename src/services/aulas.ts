import { requestAuthJson } from "./api"

import type { GetAulasPorMateriaParams } from "../types/aulas"
import type { GetAulasPorMateriaResponse } from "../types/aulas"

const API_AULAS_PREFIX = "/admin/aulas"

//get functions
export async function getAulasPorMateria(params: GetAulasPorMateriaParams) {
    return requestAuthJson<GetAulasPorMateriaResponse>(
        `${API_AULAS_PREFIX}/por-materia/${params.materia_id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
}

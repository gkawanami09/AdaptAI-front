import { requestAuthJson } from "./api"

import type { GetProgressoResponse } from "../types/progresso"

const API_PROGRESSO_PREFIX = "/aluno/progresso"

export function getProgresso(): Promise<GetProgressoResponse> {
    return requestAuthJson<GetProgressoResponse>(API_PROGRESSO_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

import { requestAuthJson } from "./api"

import type { GetConquistasResponse } from "../types/conquistas"

const API_CONQUISTAS_PREFIX = "/aluno/conquistas"

export function getConquistas(): Promise<GetConquistasResponse> {
    return requestAuthJson<GetConquistasResponse>(API_CONQUISTAS_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

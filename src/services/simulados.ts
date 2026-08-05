import { requestAuthJson } from "./api"

import type { GetSimuladosResponse } from "../types/simulados"

const API_SIMULADOS_PREFIX = "/aluno/simulados"

export function getSimulados(): Promise<GetSimuladosResponse> {
    return requestAuthJson<GetSimuladosResponse>(API_SIMULADOS_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

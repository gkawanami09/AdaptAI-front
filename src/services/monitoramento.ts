import { requestAuthJson } from "./api"

import type { GetMonitoramentoResponse } from "../types/monitoramento"

const API_MONITORAMENTO_PREFIX = "/admin/monitoramento"

export function getMonitoramento(): Promise<GetMonitoramentoResponse> {
    return requestAuthJson<GetMonitoramentoResponse>(API_MONITORAMENTO_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

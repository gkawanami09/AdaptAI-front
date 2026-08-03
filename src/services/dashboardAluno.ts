import { requestAuthJson } from "./api"

import type { GetDashboardAlunoResponse } from "../types/dashboardAluno"

const API_DASHBOARD_ALUNO_PREFIX = "/aluno/dashboard"

export function getDashboardAluno(): Promise<GetDashboardAlunoResponse> {
    return requestAuthJson<GetDashboardAlunoResponse>(API_DASHBOARD_ALUNO_PREFIX, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

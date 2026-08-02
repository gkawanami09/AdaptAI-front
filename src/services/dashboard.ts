import { requestAuthJson } from "./api"

import type { GetDashboardParams, GetDashboardResponse } from "../types/dashboard"

const API_DASHBOARD_PREFIX = "/admin/dashboard"

export function getDashboard(params: GetDashboardParams = {}): Promise<GetDashboardResponse> {
    const query = new URLSearchParams()

    if (params.periodo) query.set("periodo", params.periodo)

    const queryString = query.toString()

    return requestAuthJson<GetDashboardResponse>(API_DASHBOARD_PREFIX + (queryString ? `?${queryString}` : ""), {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

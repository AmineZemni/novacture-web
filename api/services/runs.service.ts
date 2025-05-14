import { apiGet, apiPostFormData } from 'api/apiClient'
import { ApiError } from '../httpClient'
export interface Run {
  id: string
  id_user: string
  workflow_name: string
  planned_date: string
  execution_date?: string
  end_date?: string
  name: string
  status: string
  files: { name: string; url: string }[]
}

export async function getRuns(userId: string, userKey: string): Promise<Run[]> {
  try {
    const { content } = await apiGet<Run[]>(`users/${userId}/runs`, userKey)
    return content
  } catch (e) {
    if (e instanceof ApiError) return []
    throw e
  }
}

export async function postRunIDI(
  userId: string,
  userKey: string,
  runName: string
): Promise<void> {
  const formData = new FormData()
  formData.append('run_name', runName)
  // formData.append('mocked', 'true')
  apiPostFormData(`users/${userId}/runs/idi`, formData, userKey)
}

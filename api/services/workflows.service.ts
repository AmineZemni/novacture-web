import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'
export enum WorkflowName {
  IDI = 'IDI',
  IFRS = 'IFRS'
}
export interface Workflow {
  name: string
}
export interface WorkflowInput {
  category: string
  structure: string
}

export async function getWorkflowsByUser(
  userId: string,
  userKey: string
): Promise<Workflow[]> {
  try {
    const { content } = await apiGet<Workflow[]>(
      `users/${userId}/workflows`,
      userKey
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return []
    throw e
  }
}

export async function getWorkflowInputs(
  userKey: string,
  workflow: WorkflowName
): Promise<WorkflowInput[]> {
  try {
    const { content } = await apiGet<WorkflowInput[]>(
      `workflows/${workflow}/inputs`,
      userKey
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return []
    throw e
  }
}

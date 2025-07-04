import { apiDelete, apiGet, apiPostFormData } from 'api/apiClient'
import { ApiError } from '../httpClient'
import { WorkflowName } from './workflows.service'
import { FileFromRun } from './files.service'

export enum RunStatus {
  NOT_STARTED = 'NOT_STARTED',
  UPLOADING_INPUTS = 'UPLOADING_INPUTS',
  UOA = 'UOA',
  CALC_PROCESS = 'CALC_PROCESS',
  REPORT_PROCESS = 'REPORT_PROCESS',
  GENERATOR = 'GENERATOR',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE'
}
export interface Run {
  id: string
  id_user: string
  workflow_name: string
  planned_date: string
  execution_date?: string
  end_date?: string
  name: string
  description?: string
  status: RunStatus
  files: Array<FileFromRun>
}

export async function getRun(
  userId: string,
  userKey: string,
  run_id: string
): Promise<Run | undefined> {
  try {
    const { content } = await apiGet<Run>(
      `users/${userId}/runs/${run_id}`,
      userKey
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
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

export async function createNewRun(
  userId: string,
  userKey: string,
  runName: string,
  workflow: WorkflowName,
  description?: string
): Promise<
  | {
      run_id: string
    }
  | undefined
> {
  try {
    const formData = new FormData()
    formData.append('run_name', runName)
    if (description) formData.append('run_description', description)
    formData.append('workflow_name', workflow)
    const { content } = await apiPostFormData<{
      run_id: string
    }>(`users/${userId}/runs`, formData, userKey)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}

export async function deleteRun(
  userId: string,
  userKey: string,
  run_id: string
): Promise<void> {
  apiDelete(`users/${userId}/runs/${run_id}`, userKey)
}

export async function postRunInput(
  userId: string,
  runId: string,
  userKey: string,
  file: File | Blob,
  fileStructure: string
): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_structure', fileStructure)

    await apiPostFormData<void>(
      `users/${userId}/runs/${runId}/inputs`,
      formData,
      userKey
    )
    return true
  } catch (e) {
    if (e instanceof ApiError) return false
    throw e
  }
}

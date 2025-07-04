import { apiPostFormData } from '../apiClient'

export enum FileCategory {
  INPUTS = 'inputs',
  INPUTS_PRE_GENERATOR = 'inputs/pre_generator',
  INPUTS_CALC_PROCESS = 'inputs/calc_process',
  INPUTS_REPORT_PROCESS = 'inputs/report_process',
  INPUTS_GENERATOR = 'inputs/generator',
  INPUTS_POST_GENERATOR = 'inputs/post_generator',
  RESULTS = 'results'
}

export interface FileFromRun {
  name: string
  url: string
  category?: FileCategory
}

export async function uploadFile(
  file: File,
  category: FileCategory,
  id: string
): Promise<void> {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('category', category)
  formData.append('id', id)

  await apiPostFormData(`/files`, formData)
}

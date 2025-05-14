import { apiPostFormData } from '../apiClient'

export async function uploadFile(
  file: File,
  category: string,
  id: string
): Promise<void> {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('category', category)
  formData.append('id', id)

  await apiPostFormData(`/files`, formData)
}

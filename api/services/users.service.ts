import { apiGet } from 'api/apiClient'
import { ApiError } from '../httpClient'
export interface User {
  id: string
  name: string
}
export async function getUserByKey(key: string): Promise<User | undefined> {
  try {
    const { content } = await apiGet<User>(`users?key=${key}`)
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}

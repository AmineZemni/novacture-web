import { fetchJson, fetchNoContent } from './httpClient'

const apiURL = process.env.API_URL!
const apiKey = process.env.API_KEY!

export async function apiGet<T>(
  path: string,
  userKey?: string
): Promise<{ content: T; headers: Headers }> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'X-USER-KEY': userKey || ''
  })
  return fetchJson(`${apiURL}/${path}`, {
    headers
  })
}

export async function apiPost<T = void>(
  path: string,
  payload: { [key: string]: any },
  userKey?: string
): Promise<{ content: T; headers: Headers }> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json',
    'X-USER-KEY': userKey || ''
  })

  const reqInit: RequestInit = {
    method: 'POST',
    headers
  }
  if (payload && Object.keys(payload).length !== 0)
    reqInit.body = JSON.stringify(payload)

  return fetchJson(`${apiURL}/${path}`, reqInit)
}

export async function apiPostFormData<T = void>(
  path: string,
  payload: FormData,
  userKey?: string
): Promise<{ content: T; headers: Headers }> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'X-USER-KEY': userKey || ''
  })

  const reqInit: RequestInit = {
    method: 'POST',
    headers
  }
  if (payload) reqInit.body = payload

  return fetchJson(`${apiURL}/${path}`, reqInit)
}

export async function apiPut(
  path: string,
  payload: { [key: string]: any }
): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  return fetchNoContent(`${apiURL}/${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload)
  })
}

export async function apiPatch(
  path: string,
  payload: { [key: string]: any }
): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json'
  })

  return fetchNoContent(`${apiURL}/${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(payload)
  })
}

export async function apiDelete(path: string, userKey?: string): Promise<void> {
  const headers = new Headers({
    'X-API-KEY': apiKey,
    'content-type': 'application/json',
    'X-USER-KEY': userKey || ''
  })

  await fetchNoContent(`${apiURL}/${path}`, {
    method: 'DELETE',
    headers
  })
}

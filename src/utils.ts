import type { Connect } from 'vite'
import type { ServerResponse } from 'http'

export type IncomingMessageWithURL = Connect.IncomingMessage & { url: string }

export const hasURL = (
  req: Connect.IncomingMessage
): req is IncomingMessageWithURL => req.url !== undefined

export const getSearchParam = (
  req: IncomingMessageWithURL,
  name: string
): string | null => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  return url.searchParams.get(name)
}

export const redirectToPipeline = (
  req: IncomingMessageWithURL,
  res: ServerResponse
): void => {
  const url = new URL('https://q.trap.jp/pipeline')
  url.searchParams.set('redirect', `http://${req.headers.host}${req.url}`)
  res.writeHead(302, {
    Location: url.href
  })
}

export const validateToken = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: string | object
): data is { id: string } => {
  if (typeof data === 'string') {
    return false
  }
  if (!('id' in data) || typeof (data as { id: unknown }).id !== 'string') {
    return false
  }
  return true
}

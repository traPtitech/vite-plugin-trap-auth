import type { Connect } from 'vite'
import type { ServerResponse } from 'http'

export type IncomingMessageWithURL = Connect.IncomingMessage & { url: string }

const PIPELINE_URL = 'https://portal.trap.jp/pipeline'

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
  const url = new URL(PIPELINE_URL)
  url.searchParams.set('redirect', `http://${req.headers.host}${req.url}`)
  res.writeHead(302, {
    Location: url.href
  })
  res.end()
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

import type { Plugin, ServerHook } from 'vite'
import cookie from 'cookie'
import {
  getSearchParam,
  hasURL,
  redirectToPipeline,
  validateToken
} from './utils'
import { verify } from './key'

const defaultMaxAge = 60 * 60 * 24 // 1日

export interface VitePluginTrapAuthOptions {
  maxAge?: number
}

export const PluginTrapAuth = ({
  maxAge = defaultMaxAge
}: VitePluginTrapAuthOptions = {}): Plugin => {
  const configureServer: ServerHook = server => {
    server.middlewares.use((req, res, next) => {
      if (!hasURL(req)) {
        // eslint-disable-next-line no-console
        console.warn(
          '[vite-plugin-trap-auth]: Cannot get req.url because request is not obtained from http.Server'
        )
        next()
        return
      }

      const queryToken = getSearchParam(req, 'payload')
      if (queryToken) {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('traP_token', queryToken, {
            httpOnly: true,
            maxAge
          })
        )
      }

      const cookies = cookie.parse(req.headers.cookie ?? '')
      const rawToken = queryToken ?? cookies['traP_token'] ?? ''
      if (rawToken === '') {
        redirectToPipeline(req, res)
        return
      }

      try {
        const data = verify(rawToken)
        if (!validateToken(data)) {
          redirectToPipeline(req, res)
          return
        }
      } catch {
        redirectToPipeline(req, res)
        return
      }

      next()
    })
  }

  return {
    name: 'traPTokenPlugin',
    apply: 'serve',
    configureServer
  }
}

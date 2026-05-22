import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-repo-content',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/content/')) return next()

          const relativePath = decodeURIComponent(req.url.replace('/content/', ''))
          const filePath = resolve(__dirname, '..', relativePath)

          if (!fs.existsSync(filePath)) return next()

          const ext = path.extname(filePath).slice(1)
          const mimeTypes: Record<string, string> = {
            md: 'text/markdown; charset=utf-8',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            svg: 'image/svg+xml',
          }

          res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(fs.readFileSync(filePath))
        })
      }
    }
  ],
  server: {
    fs: {
      allow: ['..']
    }
  }
})

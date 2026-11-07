import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { getPrerenderRoutes, renderRouteHtml } from './src/data/seo.js'

// Writes route-specific HTML (title, description, canonical, JSON-LD) so crawlers
// get correct metadata without running JavaScript.
function prerenderRouteHeads() {
  let outDir
  return {
    name: 'prerender-route-heads',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const template = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const route of getPrerenderRoutes()) {
        const file = resolve(outDir, route.file)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, renderRouteHtml(template, route.meta))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerenderRouteHeads(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion-dom/') || id.includes('/node_modules/motion-utils/')) return 'motion'
          if (id.includes('/node_modules/lucide-react/')) return 'icons'
          if (id.includes('/node_modules/i18next') || id.includes('/node_modules/react-i18next/')) return 'i18n'
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/react-router/') || id.includes('/node_modules/scheduler/')) return 'react'
        },
      },
    },
  },
})

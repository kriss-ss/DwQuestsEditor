import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { promises as fs } from 'fs'
import path from 'path'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'generate-assets-list',
      async configureServer() {
        try {
          // Правильный динамический импорт для fast-glob
          const fg = await import('fast-glob')
          const glob = fg.default?.glob || fg.glob || fg

          const filesQuestNames = await glob('src/assets/tabs_icons/**/*.png')

          const iconsListQuestNames = filesQuestNames.map(file => {
            const relativePath = path.relative('src/assets/tabs_icons', file)
            return relativePath
                .replace(/\\/g, '/')
                .replace(/\//g, '.')
          })

          await fs.mkdir('src/assets/json/iconsList/', { recursive: true })
          await fs.writeFile(
              'src/assets/json/iconsList/questNamesIcons.json',
              JSON.stringify(iconsListQuestNames, null, 2)
          )

          const filesItems = await glob('src/assets/icons/**/*.png')

          const iconsListItems = filesItems.map(file => {
            const relativePath = path.relative('src/assets/icons', file)
            return relativePath
                .replace(/\\/g, '/')
          })

          await fs.mkdir('src/assets/json/iconsList/', { recursive: true })
          await fs.writeFile(
              'src/assets/json/iconsList/itemsNamesIcons.json',
              JSON.stringify(iconsListItems, null, 2)
          )
        } catch (err) {
          console.error('Error:', err)
        }
      }
    }
    // vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true } // Change
  }
})

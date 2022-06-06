import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {adorableCSS} from 'adorable-css/vite'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [adorableCSS(), svelte()],
  resolve: {
    alias: {
      src: resolve('src')
    }
  },
  build: {
    chunkSizeWarningLimit: 3000
  }
})

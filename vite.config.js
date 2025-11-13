import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Kezekshi-Dashboard/',
  plugins: [
    tailwindcss(),
  ],
})
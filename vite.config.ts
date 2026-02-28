import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [solid(), dts()],
  build: {
    minify: false,
    lib: {
      entry: "src/index.ts",
      name: "SolidScrollRestoration",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "solid-js/store"],
    },
  },
})

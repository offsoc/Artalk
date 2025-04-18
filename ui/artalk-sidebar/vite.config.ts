import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import { fileURLToPath, URL } from 'node:url'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: 'es2015',
    outDir: resolve(__dirname, 'dist'),
    minify: 'terser',
  },
  plugins: [
    VueRouter({ importMode: 'sync' }),
    vue(),
    Components({ resolvers: [HeadlessUiResolver()] }),
    AutoImport({
      imports: ['vue', VueRouterAutoImports, 'vue-i18n'],
    }),
    {
      ...checker({
        // vueTsc: true, // FIXME: see https://github.com/fi3ework/vite-plugin-checker/issues/306
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint .',
        },
      }),
      apply: 'serve',
    },
    (() => ({
      name: 'prod-vue-resolver',
      resolveId(id) {
        // @issue https://github.com/vitejs/vite/issues/6607
        // dev mode vite resolves vue in other way
        // only in prod mode, `id === vue` is true
        if (id === 'vue') {
          return resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm-bundler.js')
        }
      },
    }))(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 23367,
    proxy: {
      '/api': 'http://127.0.0.1:23366',
      '/dist': 'http://127.0.0.1:23366',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [resolve(__dirname, 'src/style')],
        silenceDeprecations: ['import'], // https://sass-lang.com/documentation/breaking-changes/import/
        additionalData: `@import "variables";@import "extends";`,
      },
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  icon: {
    clientBundle: {
      scan: true,
      icons: [
        'lucide:arrow-left',
        'lucide:log-out',
        'lucide:plus',
        'lucide:pencil',
        'lucide:trash-2',
        'lucide:folder-open',
        'lucide:folder',
        'lucide:search',
        'lucide:image',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:shopping-bag',
        'lucide:x',
        'lucide:upload-cloud',
        'lucide:user',
        'lucide:lock',
        'lucide:chevron-down'
      ]
    }
  },

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
    }
  },

  css: ['~/assets/css/main.css'],



  compatibilityDate: '2025-01-15',

  experimental: {
    appManifest: false
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})

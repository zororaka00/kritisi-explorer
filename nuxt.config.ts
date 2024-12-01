// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-api-shield"],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    arbiscanApiKey: process.env.ARBISCAN_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
  nuxtApiShield: {
    limit: {
      max: 1,
      duration: 60,
      ban: 60
    },
    routes: ["/api/add", "/api/cron/scan", "/api/cron/audit", "/api/cron/detail"]
  },
  compatibilityDate: "2024-11-27"
})
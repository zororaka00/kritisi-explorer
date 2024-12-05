// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "nuxt-api-shield"],
  runtimeConfig: {
    nodeEnv: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    arbiscanApiKey: process.env.ARBISCAN_API_KEY,
    basescanApiKey: process.env.BASESCAN_API_KEY,
    optimismApiKey: process.env.OPTIMISM_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    cronSecretKey: process.env.CRON_SECRET_KEY
  },
  nuxtApiShield: {
    limit: {
      max: 1,
      duration: 60,
      ban: 60
    },
    routes: ["/api/add", "/api/cron/scan", "/api/cron/audit", "/api/cron/detail"]
  },
  app: {
    head: {
      charset: "UTF-8",
      viewport: 'width=device-width, initial-scale=1',
      title: 'Kritisi - Security Audit Explorer for Solidity',
      meta: [
        { name: 'description', content: 'AI-powered tool for analyzing Solidity contracts on Arbitrum. Detect vulnerabilities and get security scores with Gemini AI.' },
        { name: 'keywords', content: 'smart contract, security audit, solidity, blockchain, arbitrum, AI, security analysis, Gemini AI, security scoring' },
        { name: 'author', content: 'Raka' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://explorer.kritisi.xyz' },
        { property: 'og:title', content: 'Kritisi - Security Audit Explorer for Solidity' },
        { property: 'og:description', content: 'AI-powered smart contract security analysis tool for Arbitrum Chain. Detect vulnerabilities and get comprehensive security scores for your Solidity contracts. Powered by Gemini AI for auditing and scoring.' },
        { property: 'og:image', content: 'https://www.kritisi.xyz/card-image.png' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: 'https://explorer.kritisi.xyz' },
        { property: 'twitter:title', content: 'Kritisi - Security Audit Explorer for Solidity' },
        { property: 'twitter:description', content: 'AI-powered smart contract security analysis tool for Arbitrum Chain. Detect vulnerabilities and get comprehensive security scores for your Solidity contracts. Powered by Gemini AI for auditing and scoring.' },
        { property: 'twitter:image', content: 'https://www.kritisi.xyz/card-image.png' },
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-4JVF7SBVV2', async: true }
      ]
    },
  },
  compatibilityDate: "2024-11-27"
})
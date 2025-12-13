// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      titleTemplate: "ThinkUp",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" },
        {
          hid: "description",
          name: "description",
          content:
            "Ваш новий улюблений менеджер завдань тут! Інтуїтивний, чистий та сучасний ThinkUp менеджер завдань.",
        },
        {
          name: "keywords",
          content: "ThinkUp, завдання, менеджер",
        },
        { name: "theme-color", content: "#0ea5e9" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "ThinkUp" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "120x120", href: "/icon-120x120.png" },
        { rel: "apple-touch-icon", sizes: "152x152", href: "/icon-152x152.png" },
        { rel: "apple-touch-icon", sizes: "192x192", href: "/icon-192x192.png" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },
  typescript: {
    shim: false,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
  ],
  ssr: false,
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "ThinkUp - Менеджер завдань",
      short_name: "ThinkUp",
      description: "Ваш новий улюблений менеджер завдань тут! Інтуїтивний, чистий та сучасний ThinkUp менеджер завдань.",
      theme_color: "#0ea5e9",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icon-64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "/icon-120x120.png",
          sizes: "120x120",
          type: "image/png",
        },
        {
          src: "/icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "/icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/icon-384x384.png",
          sizes: "384x384",
          type: "image/png",
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: "CacheFirst",
          options: {
            cacheName: "gstatic-fonts-cache",
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});

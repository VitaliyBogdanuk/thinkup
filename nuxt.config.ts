// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      titleTemplate: "DeepWater",
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon_32.png" },
        { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon_64.png" },
        { rel: "icon", type: "image/png", sizes: "128x128", href: "/favicon_128.png" },
        { rel: "apple-touch-icon", sizes: "256x256", href: "/favicon_256.png" },
      ],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        {
          hid: "description",
          name: "description",
          content:
            "Ваш новий улюблений менеджер завдань тут! Інтуїтивний, чистий та сучасний DeepWater менеджер завдань.",
        },
        {
          name: "keywords",
          content: "DeepWater, завдання, менеджер",
        },
      ],
    },
  },
  typescript: {
    shim: false,
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],
  ssr: false,
});

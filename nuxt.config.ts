// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: "fade", mode: "out-in" },
    head: {
      titleTemplate: "DeepWater",
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

// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    devtools: {
      enabled: true,

      timeline: {
        enabled: true
      }
    },
    modules: ["@primevue/nuxt-module", "@nuxtjs/tailwindcss"],
    primevue: {
        options: {
            theme: {
                preset: Aura
            }
        }
    },
    css: ["primeicons/primeicons.css"]
})
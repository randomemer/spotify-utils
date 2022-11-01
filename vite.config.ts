import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

process.env.BROWSER = "firefox";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 4009,
    strictPort: true,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/general.scss";`,
      },
    },
  },
});

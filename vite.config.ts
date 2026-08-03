// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },

  nitro: process.env.VERCEL || process.env.VERCEL_ENV || process.env.CI ? { preset: "vercel" } : undefined,
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rolldownOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "UNRESOLVED_IMPORT" ||
            warning.code === "UNKNOWN_OPTION" ||
            (warning.message && String(warning.message).includes("externalize"))
          ) {
            return;
          }
          warn(warning);
        },
      },
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.code === "UNRESOLVED_IMPORT" ||
            warning.code === "UNKNOWN_OPTION" ||
            (warning.message && String(warning.message).includes("externalize"))
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  },
});




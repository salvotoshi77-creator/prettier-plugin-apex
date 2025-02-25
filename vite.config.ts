import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePluginRadar } from "vite-plugin-radar";

const buildTarget = process.env["BUILD_TARGET"] || "site";
const analyticsId = process.env["GOOGLE_ANALYTICS_ID"] || "";

export default defineConfig(({ mode }) => {
  process.env["VITE_APP_TITLE"] =
    mode === "production"
      ? "Salesforce Apex Formatter"
      : `[${mode}] Salesforce Apex Formatter`;
  return buildTarget === "library"
    ? {
        build: {
          emptyOutDir: false,
          lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, "src/index.ts"),
            name: "prettierPlugins.apex",
            // the proper extensions will be added
            fileName: "src/standalone",
            formats: ["umd"],
          },
          rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ["prettier", "fetch"],
            output: {
              // Provide global variables to use in the UMD build
              // for externalized deps
              globals: {
                prettier: "prettier",
                fetch: "fetch",
              },
            },
          },
        },
      }
    : {
        root: resolve(__dirname, "playground"),
        server: {
          port: 5173,
          strictPort: true,
        },
        plugins: [
          react(),
          VitePluginRadar({
            enableDev: true,
            analytics: {
              id: analyticsId,
            },
          }),
        ],
        build: {
          emptyOutDir: false,
          outDir: resolve(__dirname, "dist", "playground"),
        },
      };
});

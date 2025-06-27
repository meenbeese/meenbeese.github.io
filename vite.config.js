import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-oxc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    host: false,
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: "react", test: /node_modules\/react|react-dom/, priority: 10 },
            { name: "three", test: /node_modules\/three/, priority: 10 },
            { name: "fiber", test: /node_modules\/@react-three\/(fiber|drei)/, priority: 10 },
            { name: "gsap", test: /node_modules\/gsap/, priority: 10 },
          ],
        },
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});

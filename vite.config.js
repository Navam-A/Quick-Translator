import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.js"), // entry point
        popup: resolve(__dirname, "src/popup.html")
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
    outDir: "dist",
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "manifest.json", dest: "." }, // copy manifest to dist
        { src: "src/icon.png", dest: "." }   // copy icon to dist
      ],
    }),
  ],
});

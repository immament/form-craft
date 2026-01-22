import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { UserConfigExport } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { name } from "./package.json";

const app = async (): Promise<UserConfigExport> => {
  const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

  return defineConfig({
    plugins: [
      react(),
      dts({ insertTypesEntry: true, tsconfigPath: "tsconfig.lib-tsc.json" }),
      tailwindcss(),
    ],
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    build: {
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: formattedName,
        formats: ["es"], // "umd"
        fileName: (format) => `${formattedName}.${format}.js`,
      },
      sourcemap: true,
      rollupOptions: {
        external: [
          "react",
          "react/jsx-runtime",
          "react-dom",
          "tailwindcss",
          "@dnd-kit/core",
          "@dnd-kit/sortable",
          "@dnd-kit/modifiers",
          "@dnd-kit/utilities",
          "@rjsf/core",
          "@rjsf/shadcn",
          "@rjsf/utils",
          "@rjsf/validator-ajv8",
        ],

        output: {
          globals: {
            react: "React",
            "react/jsx-runtime": "react/jsx-runtime",
            "react-dom": "ReactDOM",
            "@dnd-kit/core": "@dnd-kit/core",
            "@dnd-kit/sortable": "@dnd-kit/sortable",
            "@dnd-kit/utilities": "@dnd-kit/utilities",
            "@dnd-kit/modifiers": "@dnd-kit/modifiers",
            tailwindcss: "tailwindcss",
          },
        },
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;

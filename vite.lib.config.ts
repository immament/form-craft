import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { UserConfigExport } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

import { name } from "./package.json";

const app = async (): Promise<UserConfigExport> => {
  const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

  return defineConfig({
    plugins: [
      react(),
      dts({ insertTypesEntry: true, tsconfigPath: "tsconfig.lib-tsc.json" }),
      tailwindcss(),
      // visualizer({
      //   open: true, // Automatically opens the report in your browser after build
      //   filename: "bundle-stats.html", // The name of the output file
      //   gzipSize: true,
      //   // brotliSize: true,
      // }),
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
        // ((source: string, importer: string | undefined, isResolved: boolean) => boolean | NullValue)
        // external: (
        //   source: string,
        //   importer: string | undefined,
        //   isResolved: boolean,
        // ) => {
        //   // console.log(source, importer, isResolved);
        //   if (source.includes("/node_modules/")) {
        //     console.log(source, isResolved);
        //     return true;
        //   }
        // },
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
          "tslog",
          "@radix-ui/react-collapsible",
          "@radix-ui/react-dialog",
          "@radix-ui/react-dropdown-menu",
          "@radix-ui/react-label",
          "@radix-ui/react-select",
          "@radix-ui/react-separator",
          "@radix-ui/react-switch",
          "@radix-ui/react-tabs",
          "tailwind-merge",
          "react-hook-form",
          "@microlink/react-json-view",
          "zod",
          "immer",
          "@hookform/resolvers",
          "zustand",
        ],

        // output: {
        //   globals: {
        //     react: "React",
        //     "react/jsx-runtime": "react/jsx-runtime",
        //     "react-dom": "ReactDOM",
        //     "@dnd-kit/core": "@dnd-kit/core",
        //     "@dnd-kit/sortable": "@dnd-kit/sortable",
        //     "@dnd-kit/utilities": "@dnd-kit/utilities",
        //     "@dnd-kit/modifiers": "@dnd-kit/modifiers",
        //     tailwindcss: "tailwindcss",
        //     "lucide-react": "lucide-react",
        //   },
        // },
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;

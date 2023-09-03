import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/rbac.ts"),
      name: "@quaresma/rbac",
      fileName: "@quaresma/rbac",
    },
  },
  plugins: [
    dts({
      exclude: ["node_modules/**", "src/**/*.test.ts"],
    }),
  ],
});

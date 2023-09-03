import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/rbac.ts"),
      name: "rbac-js",
      fileName: "rbac-js",
    },
  },
  plugins: [
    dts({
      exclude: ["node_modules/**", "src/**/*.test.ts"],
    }),
  ],
});

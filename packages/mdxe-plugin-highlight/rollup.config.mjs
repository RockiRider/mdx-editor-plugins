// rollup.config.mjs
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const config = defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [
      typescript({
        outDir: "dist",
        include: ["src/**/*"],
      }),
      nodeResolve(),
    ],
  },
]);

export default config;

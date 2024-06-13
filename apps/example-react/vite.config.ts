import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    preview: {
      port: 4001,
    },
    server: {
      port: 3000,
      host: "0.0.0.0"
    },
  });
};

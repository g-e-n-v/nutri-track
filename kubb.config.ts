import { defineConfig } from "@kubb/core";
import { pluginSwagger } from "@kubb/swagger";
import { pluginTanstackQuery } from "@kubb/swagger-tanstack-query";
import { pluginTs } from "@kubb/swagger-ts";

export default defineConfig({
  root: ".",
  input: {
    path: "./swagger.json",
  },
  output: {
    path: "./src/__generated__",
    clean: true,
  },
  plugins: [
    pluginSwagger({
      output: false,
    }),
    pluginTs({
      output: {
        path: "types",
      },
    }),
    pluginTanstackQuery({
      output: {
        path: "hooks",
      },
      client: {
        importPath: "@/api/client.ts",
      },
      dataReturnType: "data",
    }),
  ],
});

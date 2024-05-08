import { generateSchemaTypes, generateReactQueryComponents } from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  nutriTrack: {
    from: {
      relativePath: "./swagger.json",
      source: "file",
    },
    outputDir: "./src/__generated__",
    to: async (context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});

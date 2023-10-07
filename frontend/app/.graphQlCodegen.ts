import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/codegen/schema/",
  documents: ["src/**/*.ts"],
  generates: {
    "src/graphql/codegen/generatedTS/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;

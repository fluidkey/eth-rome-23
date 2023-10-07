import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.93.0',
  defaultReleaseBranch: 'main',
  name: '@fluidkey/backend-infrastructure',
  projenrcTs: true,
  gitignore: [ '.env' ],
  deps: [ 'dotenv', '@middy/core', 'aws-lambda' ],
  devDeps: [ '@types/aws-lambda' ],
  appEntrypoint: 'main.ts',
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();

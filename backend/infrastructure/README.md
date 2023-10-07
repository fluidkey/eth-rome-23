# Fluidkey Backend Infrastructure

This AWS CDK app contains the codes to manage the Backend Infrastructure to handle the ENS OffChain Resolver 
and the GraphQL API endpoint to register users in the ENS OffChain Resolver.

In the `src/` folder you can find the following files and folders:

- `graphql/`: contains the GraphQL schema and all the mapping templates needed for AWS AppSync
- `lambda-functions/`: contains the logic for the GraphQL resolver and the ENS OffChain Resolver
- `main.ts`: contains the AWS CDK definition with all the backend stateless resources.

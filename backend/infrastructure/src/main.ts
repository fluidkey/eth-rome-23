import * as cdk from 'aws-cdk-lib';
import {
  App,
  Duration,
  Stack,
  StackProps,
  aws_appsync as appsync,
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
  Expiration,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface CreateEnsOffChainResolverLambdaFunctionUrlProps {
  scope: Construct;
  privateKey: string;
  userTable: dynamodb.ITable;
  userStealthAddressTable: dynamodb.ITable;
}
interface CreateGraphQLApiProps {
  scope: Construct;
  graphQLResolverLambdaFunction: lambda_nodejs.NodejsFunction;
}
interface CreateGraphQLResolverLambdaFunctionProps {
  scope: Construct;
  userTable: dynamodb.ITable;
}
export interface FluidkeyEnsOffChainResolverInfrastructureProps extends StackProps {
  readonly privateKey: string;
}
export class FluidkeyEnsOffChainResolverInfrastructure extends Stack {
  private static createEnsOffChainResolverLambdaFunctionUrl = (
    props: CreateEnsOffChainResolverLambdaFunctionUrlProps
  ): lambda.FunctionUrl => {
    const createEnsOffChainResolverLambdaFunction = new lambda_nodejs.NodejsFunction(
      props.scope,
      'EnsOffChainResolverLambdaFunction',
      {
        timeout: Duration.seconds(30),
        functionName: 'fluidkey-ens-off-chain-resolver-lambda-function',
        memorySize: 256,
        handler: 'lambdaHandler',
        entry: path.join(__dirname, 'lambda-functions/ens-offchain-resolver.ts'),
        bundling: {
          minify: true,
        },
        environment: {
          PRIVATE_KEY: props.privateKey,
        },
        depsLockFilePath: path.join(__dirname, 'lambda-functions/yarn.lock'),
        logRetention: logs.RetentionDays.TWO_WEEKS,
      },
    );
    return createEnsOffChainResolverLambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
  };
  private static createGraphQLApi = ( props: CreateGraphQLApiProps ): appsync.GraphqlApi => {
    const graphQLApi = new appsync.GraphqlApi(
      props.scope,
      'GraphQLApi', {
        authorizationConfig: {
          defaultAuthorization: {
            authorizationType: appsync.AuthorizationType.API_KEY,
            apiKeyConfig: {
              expires: Expiration.after(Duration.days(365)),
            }
          },
        },
        name: `fluidkey.app-sync`,
        definition: appsync.Definition.fromFile(path.join(__dirname, 'graphql/schema.graphql')),
        xrayEnabled: false,
        logConfig: {
          fieldLogLevel: appsync.FieldLogLevel.ALL,
          retention: logs.RetentionDays.TWO_WEEKS,
        },
      });
    // authorizer role
    const allowAppSyncPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['lambda:InvokeFunction'],
      resources: [
        'arn:aws:iam::*:role/aws-service-role/appsync.amazonaws.com/AWSServiceRoleForAppSync',
      ],
    });
    props.graphQLResolverLambdaFunction.addToRolePolicy(allowAppSyncPolicyStatement);
    props.graphQLResolverLambdaFunction.addPermission('subbu-appsync', {
      principal: new iam.ServicePrincipal('appsync.amazonaws.com'),
      action: 'lambda:InvokeFunction',
    });

    // Lambda Roles
    const invokeLambdaRole = new iam.Role(props.scope, 'appsync-lambdaInvoke', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
    });
    invokeLambdaRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        props.graphQLResolverLambdaFunction.functionArn,
      ],
      actions: ['lambda:InvokeFunction'],
    }));
    // create GraphQL Data Sources
    const resolverLambdaDataSource = graphQLApi.addLambdaDataSource(
      'resolverLambdaDataSource', props.graphQLResolverLambdaFunction);
    // create GraphQL Resolvers
    resolverLambdaDataSource.createResolver('MutationRegisterUser', {
      typeName: 'Mutation',
      fieldName: 'registerUser',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Mutation.registerUser.request.vtl')),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Mutation.registerUser.response.vtl')),
    });
    resolverLambdaDataSource.createResolver('MutationSetUsername', {
      typeName: 'Mutation',
      fieldName: 'setUsername',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Mutation.setUsername.request.vtl')),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Mutation.setUsername.response.vtl')),
    });
    resolverLambdaDataSource.createResolver('QueryGetUserByAddress', {
      typeName: 'Query',
      fieldName: 'getUserByAddress',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Query.getUserByAddress.request.vtl')),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Query.getUserByAddress.response.vtl')),
    });
    resolverLambdaDataSource.createResolver('QueryIsUserRegistered', {
      typeName: 'Query',
      fieldName: 'isUserRegistered',
      requestMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Query.isUserRegistered.request.vtl')),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(
        path.join(__dirname, 'graphql/mapping-templates/Query.isUserRegistered.response.vtl')),
    });
    return graphQLApi;
  }
  private static createGraphQLResolverLambdaFunction = (
    props: CreateGraphQLResolverLambdaFunctionProps
  ): lambda_nodejs.NodejsFunction => {
    const graphQLResolverLambdaFunction = new lambda_nodejs.NodejsFunction(
      props.scope,
      'GraphQLResolverLambdaFunction',
      {
        timeout: Duration.seconds(30),
        functionName: 'fluidkey-graphql-resolver-lambda-function',
        memorySize: 256,
        handler: 'lambdaHandler',
        entry: path.join(__dirname, 'lambda-functions/appsync/resolver.ts'),
        bundling: {
          minify: true,
        },
        depsLockFilePath: path.join(__dirname, 'lambda-functions/yarn.lock'),
        logRetention: logs.RetentionDays.TWO_WEEKS,
      },
    );
    graphQLResolverLambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:GetItem',
      ],
      resources: [
        props.userTable.tableArn,
      ],
    }));
    graphQLResolverLambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:Query',
      ],
      resources: [
        `${props.userTable.tableArn}/index/username-index`,
      ],
    }));
    graphQLResolverLambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:PutItem',
      ],
      resources: [
        props.userTable.tableArn,
      ],
    }));
    graphQLResolverLambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'dynamodb:UpdateItem',
      ],
      resources: [
        props.userTable.tableArn,
      ],
    }));
    return graphQLResolverLambdaFunction;
  };
  public readonly ensOffChainResolverLambdaFunctionUrl: lambda.FunctionUrl;
  public readonly graphQLApi: appsync.GraphqlApi;
  public readonly graphQLResolverLambdaFunction: lambda_nodejs.NodejsFunction;
  constructor(scope: Construct, id: string, props: FluidkeyEnsOffChainResolverInfrastructureProps) {
    super(scope, id, props);
    const userTable = dynamodb.Table.fromTableArn(
      this, 'UserTable', cdk.Fn.importValue(`userTableArn`));
    const userStealthAddressTable = dynamodb.Table.fromTableArn(
      this, 'UserStealthAddressTable',  cdk.Fn.importValue(`userStealthAddressTableArn`));
    this.ensOffChainResolverLambdaFunctionUrl = FluidkeyEnsOffChainResolverInfrastructure.createEnsOffChainResolverLambdaFunctionUrl({
      privateKey: props.privateKey,
      scope: this,
      userTable: userTable,
      userStealthAddressTable: userStealthAddressTable,
    });
    this.graphQLResolverLambdaFunction = FluidkeyEnsOffChainResolverInfrastructure.createGraphQLResolverLambdaFunction({
      scope: this,
      userTable: userTable,
    });
    this.graphQLApi = FluidkeyEnsOffChainResolverInfrastructure.createGraphQLApi({
      scope: this,
      graphQLResolverLambdaFunction: this.graphQLResolverLambdaFunction,
    });
  }
}

const app = new App();

new FluidkeyEnsOffChainResolverInfrastructure(app, 'fluidkey-backend-infrastructure-dev', {
  privateKey: process.env.PRIVATE_KEY as string,
});

app.synth();

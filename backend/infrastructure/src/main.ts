import * as cdk from 'aws-cdk-lib';
import {
  App,
  Duration,
  Stack,
  StackProps,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  aws_logs as logs,
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
  }
  public readonly ensOffChainResolverLambdaFunctionUrl: lambda.FunctionUrl;
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
  }
}

const app = new App();

new FluidkeyEnsOffChainResolverInfrastructure(app, 'fluidkey-backend-infrastructure-dev', {
  privateKey: process.env.PRIVATE_KEY as string,
});
// new MyStack(app, 'infrastructure-prod', { env: prodEnv });

app.synth();

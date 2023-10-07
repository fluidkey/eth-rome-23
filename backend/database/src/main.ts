import * as cdk from 'aws-cdk-lib';
import {App, aws_dynamodb as dynamodb, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';

interface CreateDynamodbTableBaseProps {
  scope: Construct;
}

export class FluidkeyEnsOffChainResolverDatabase extends Stack {
  private static createUserTable = ( props: CreateDynamodbTableBaseProps ): dynamodb.Table => {
    const userTable = new dynamodb.Table(
      props.scope,
      'UserTable',
      {
        tableName: 'fluidkey-ens-off-chain-resolver-user.dynamodb-table',
        partitionKey: {
          name: 'address',
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      }
    );
    userTable.addGlobalSecondaryIndex({
      indexName: 'username-index',
      partitionKey: {
        name: 'username',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    return userTable;
  };
  private static createUserStealthAddressTable = ( props: CreateDynamodbTableBaseProps ): dynamodb.Table => {
    return new dynamodb.Table(
      props.scope,
      'UserStealthAddressTable',
      {
        tableName: 'fluidkey-ens-off-chain-resolver-user-stealth-address.dynamodb-table',
        partitionKey: {
          name: 'address',
          type: dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: 'stealthAddress',
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      },
    );
  };
  public readonly userTable: dynamodb.Table;
  public readonly userStealthAddress: dynamodb.Table;
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    this.userTable = FluidkeyEnsOffChainResolverDatabase.createUserTable({ scope: this });
    this.userStealthAddress = FluidkeyEnsOffChainResolverDatabase.createUserStealthAddressTable({ scope: this });

    new cdk.CfnOutput(
      this,
      'UserTableArn',
      {
        value: this.userTable.tableArn as string,
        description: 'The dynamodb table to stores all the users registered in Fluidkey',
        exportName: `userTableArn`,
      },
    );
    new cdk.CfnOutput(
      this,
      'UserStealthAddressTableArn',
      {
        value: this.userStealthAddress.tableArn as string,
        description: 'The dynamodb table to stores all the user stealth address registered in Fluidkey',
        exportName: `userStealthAddressTableArn`,
      },
    );
  }
}

const app = new App();

new FluidkeyEnsOffChainResolverDatabase(app, 'fluidkey-database-dev');
// new MyStack(app, 'database-prod', { env: prodEnv });

app.synth();

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

export const createDdbDocClient = (): DynamoDBDocument => {
  const client = new DynamoDBClient({});
  return DynamoDBDocument.from(client, { marshallOptions, unmarshallOptions });
};

export class DynamodbManager {
  protected readonly ddbDocClient: DynamoDBDocument;
  protected readonly tableName: string;
  constructor(ddbDocClient: DynamoDBDocument, tableName: string) {
    this.ddbDocClient = ddbDocClient;
    this.tableName = tableName;
  }
}

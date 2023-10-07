import {DynamodbManager} from "./dynamodb-manager";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "./dynamodb-table";
import {AddressManager} from "./address-manager";

interface CreateUserParams {
  address: string;
  spendingPubKey: string;
  viewingPubKey: string;
}
export interface User {
  address: string;
  username?: string | undefined;
  registeredAt: number;
  spendingPubKey: string;
  viewingPubKey: string;
}
export interface UserItem {
  address: string;
  username?: string | undefined;
  registeredAt: number;
  spendingPubKey: string;
  viewingPubKey: string;
}
export class UserManager extends DynamodbManager {
  private static fromItemToUserItem = (item: Record<string, any>): UserItem => {
    return {
      address: item.address as string,
      username: item.username,
      registeredAt: item.registeredAt as number,
      spendingPubKey: item.spendingPubKey as string,
      viewingPubKey: item.viewingPubKey as string,
    };
  };
  public static fromUserItemToUser = (userItem: UserItem): User => {
    return {
      address: userItem.address,
      username: userItem.username,
      registeredAt: userItem.registeredAt,
      spendingPubKey: userItem.spendingPubKey,
      viewingPubKey: userItem.viewingPubKey,
    };
  };
  constructor(ddbDocClient: DynamoDBDocument, tableName: string) {
    super(ddbDocClient, tableName);
    if ( tableName !== DYNAMODB_TABLE.USER ) throw new Error('Invalid user table');
  }
  public createUser = async (params: CreateUserParams): Promise<UserItem> => {
    if ( params.address === undefined ) throw new Error('params.address is mandatory');
    if ( params.spendingPubKey === undefined ) throw new Error('params.spendingPubKey is mandatory');
    if ( params.viewingPubKey === undefined ) throw new Error('params.viewingPubKey is mandatory');
    const address = AddressManager.toLowerCase(params.address);
    const userItem: UserItem = {
      address: address,
      registeredAt: Math.floor(Date.now() / 1000),
      viewingPubKey: params.viewingPubKey,
      spendingPubKey: params.spendingPubKey,
    };
    await this.ddbDocClient.put({ TableName: this.tableName, Item: userItem });
    return userItem;
  }
  public getUserByAddress = async (address: string): Promise<UserItem | undefined> => {
    if ( address === undefined ) throw new Error('address param is mandatory');
    const addressLowerCased = AddressManager.toLowerCase(address);
    const response = await this.ddbDocClient.get({
      TableName: this.tableName, Key: { address: addressLowerCased }
    });
    return response.Item === undefined ? undefined : UserManager.fromItemToUserItem(response.Item);
  }
  public getUserByUsername = async (username: string): Promise<UserItem | undefined> => {
    if ( username === undefined ) throw new Error('username param is mandatory');
    const response = await this.ddbDocClient.query({
      TableName: this.tableName,
      IndexName: 'username-index',
      KeyConditionExpression: '#username = :username',
      ExpressionAttributeNames: { '#username': 'username' },
      ExpressionAttributeValues: { ':username': username },
    });
    return response.Items === undefined || response.Items.length === 0 ? undefined :
      UserManager.fromItemToUserItem(response.Items[0]);
  }
  public setUsername = async (address: string, username: string): Promise<void> => {
    if ( address === undefined ) throw new Error('address param is mandatory');
    if ( username === undefined ) throw new Error('username param is mandatory');
    const addressLowerCased = AddressManager.toLowerCase(address);
    await this.ddbDocClient.update({
      TableName: this.tableName,
      Key: { address: addressLowerCased },
      UpdateExpression: 'SET #username = :username',
      ExpressionAttributeNames: { '#username': 'username' },
      ExpressionAttributeValues: { ':username': username },
    });
  }
}

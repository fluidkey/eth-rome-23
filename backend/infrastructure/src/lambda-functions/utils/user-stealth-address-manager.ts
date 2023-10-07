import {generatePrivateKey, privateKeyToAccount} from "viem/accounts";
import {keccak256} from "viem/utils";
import * as secp from '@noble/secp256k1';
import {DynamodbManager} from "./dynamodb-manager";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "./dynamodb-table";
import {AddressManager} from "./address-manager";

interface CreateUserStealthAddressParams {
  address: string;
  stealthAddress:  `0x${string}`;
  hashedSharedSecret: `0x${string}`;
  ephemeralPubKey: `0x${string}`;
}
interface GenerateStealthAddressParams {
  userViewingPubKey: `0x${string}`;
  userSpendingPubKey: `0x${string}`;
}
interface GenerateStealthAddressResponse {
  ephemeralPubKey: `0x${string}`;
  hashedSharedSecret: `0x${string}`;
  stealthAddress: `0x${string}`;
}
interface UserStealthAddressItem {
  address: string;
  stealthAddress:  `0x${string}`;
  hashedSharedSecret: `0x${string}`;
  ephemeralPubKey: `0x${string}`;
  createdAt: number;
}
export class UserStealthAddressManager extends DynamodbManager {
  public static generateStealthAddress = async ( params: GenerateStealthAddressParams ): Promise<GenerateStealthAddressResponse> => {
    const ephemeralPrivateKey = generatePrivateKey();
    const account = privateKeyToAccount(ephemeralPrivateKey);
    // compute the shared secret using private key ephemeral * smart account viewing public key
    const sharedSecret = secp.getSharedSecret(
      ephemeralPrivateKey.replace('0x', ''),
      params.userSpendingPubKey.replace('0x', ''),
      false,
    );
    const hashedSharedSecret = keccak256(Buffer.from(sharedSecret.slice(1)));
    const hashedSharedSecretPoint = secp.Point.fromPrivateKey(
      Buffer.from(hashedSharedSecret.replace('0x', ''), 'hex'));
    const R_pubkey_view = secp.Point.fromHex(params.userViewingPubKey.replace('0x', ''));
    const stealthPublicKey = R_pubkey_view.add(hashedSharedSecretPoint);
    const stAA = keccak256( Buffer.from(stealthPublicKey.toHex(), 'hex').slice(1)).toString();
    // stealthAddresses.push(getAddress("0x"+stAA.slice(-40), 5));
    return {
      ephemeralPubKey: account.publicKey,
      stealthAddress: "0x"+stAA.slice(-40) as `0x${string}`,
      hashedSharedSecret: hashedSharedSecret,
    };
  };
  private static fromItemToUserStealthAddressItem = ( item: Record<string, any> ): UserStealthAddressItem => {
    return {
      address: item.address as string,
      hashedSharedSecret: item.hashedSharedSecret as `0x${string}`,
      ephemeralPubKey: item.ephemeralPubKey as `0x${string}`,
      stealthAddress: item.stealthAddress as `0x${string}`,
      createdAt: item.createdAt as number,
    };
  }
  constructor(ddbDocClient: DynamoDBDocument, tableName: string) {
    super(ddbDocClient, tableName);
    if ( tableName !== DYNAMODB_TABLE.USER_STEALTH_ADDRESS ) throw new Error('Invalid user table');
  }
  public createUserStealthAddress = async ( params: CreateUserStealthAddressParams ): Promise<UserStealthAddressItem> => {
    const address = AddressManager.toLowerCase(params.address);
    const userStealthAddressItem: UserStealthAddressItem = {
      address: address,
      stealthAddress: params.stealthAddress,
      ephemeralPubKey: params.ephemeralPubKey,
      hashedSharedSecret: params.hashedSharedSecret,
      createdAt: Math.floor(Date.now() / 1000 ),
    };
    await this.ddbDocClient.put({ TableName: this.tableName, Item: userStealthAddressItem });
    return userStealthAddressItem;
  }
  public getUserStealthAddresses = async ( address: string ): Promise<UserStealthAddressItem[]> => {
    const addressLowerCased = AddressManager.toLowerCase(address);
    const response = await this.ddbDocClient.query({
      TableName: this.tableName,
      KeyConditionExpression: '#address = :address',
      ExpressionAttributeNames: { '#address': 'address' },
      ExpressionAttributeValues: { ':address': addressLowerCased },
    });
    return response.Items === undefined || response.Items.length === 0 ? [] :
      response.Items.map(item => {
        return UserStealthAddressManager.fromItemToUserStealthAddressItem(item);
      });
  }
}

import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "../../utils/dynamodb-table";
import {UserStealthAddressManager} from "../../utils/user-stealth-address-manager";

interface GraphQLQueryGetUserStealthAddressesParams {
  ddbDocClient: DynamoDBDocument;
  address: string;
}

export const GraphQLQueryGetUserStealthAddresses = async (
  params: GraphQLQueryGetUserStealthAddressesParams
): Promise<string[]> => {
  const userStealthAddressManager = new UserStealthAddressManager(
    params.ddbDocClient, DYNAMODB_TABLE.USER_STEALTH_ADDRESS);
  const userStealthAddressItems = await userStealthAddressManager
    .getUserStealthAddresses(params.address);
  return userStealthAddressItems.map(userStealthAddressItem => {
    return userStealthAddressItem.stealthAddress;
  });
}

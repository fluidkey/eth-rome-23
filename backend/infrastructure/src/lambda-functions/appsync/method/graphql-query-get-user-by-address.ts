import {User, UserManager} from "../../utils/user-manager";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "../../utils/dynamodb-table";

interface GraphQLQueryGetUserByAddressParams {
  ddbDocClient: DynamoDBDocument;
  address: string;
}
export const GraphQLQueryGetUserByAddress = async (
  params: GraphQLQueryGetUserByAddressParams
): Promise<User | undefined> => {
  const userManager = new UserManager(params.ddbDocClient, DYNAMODB_TABLE.USER);
  const userItem = await userManager.getUserByAddress(params.address);
  return userItem !== undefined ? UserManager.fromUserItemToUser(userItem) : undefined;
}

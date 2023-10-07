import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {UserManager} from "../../utils/user-manager";
import {DYNAMODB_TABLE} from "../../utils/dynamodb-table";

interface GraphQLQueryIsUserRegisteredParams {
  ddbDocClient: DynamoDBDocument;
  address: string;
}
export const GraphQLQueryIsUserRegistered = async ( params: GraphQLQueryIsUserRegisteredParams ): Promise<boolean> => {
  const userManager = new UserManager(params.ddbDocClient, DYNAMODB_TABLE.USER);
  const userItem = await userManager.getUserByAddress(params.address);
  return userItem !== undefined;
}

import {User, UserManager} from "../../utils/user-manager";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "../../utils/dynamodb-table";

interface GraphQLMutationSetUsernameParams {
  ddbDocClient: DynamoDBDocument;
  address: string;
  username: string;
}
export const GraphQLMutationSetUsername = async ( params: GraphQLMutationSetUsernameParams ): Promise<User> => {
  const userManager = new UserManager(params.ddbDocClient, DYNAMODB_TABLE.USER);
  // check if the username is available
  let userItem = await userManager.getUserByUsername(params.username);
  if ( userItem !== undefined ) throw new Error('Username not available');
  await userManager.setUsername(params.address, params.username);
  userItem = await userManager.getUserByAddress(params.address);
  return UserManager.fromUserItemToUser(userItem!);
}

import {User, UserManager} from "../../utils/user-manager";
import {DynamoDBDocument} from "@aws-sdk/lib-dynamodb";
import {DYNAMODB_TABLE} from "../../utils/dynamodb-table";

interface GraphQLMutationRegisterUserParams {
  ddbDocClient: DynamoDBDocument;
  address: string;
  spendingPubKey: string;
  viewingPubKey: string;
}

export const GraphQLMutationRegisterUser = async ( params: GraphQLMutationRegisterUserParams ): Promise<User> => {
  const userManager = new UserManager(params.ddbDocClient, DYNAMODB_TABLE.USER);
  let userItem = await userManager.getUserByAddress(params.address);
  if ( userItem !== undefined ) return UserManager.fromUserItemToUser(userItem);
  userItem = await userManager.createUser({
    address: params.address,
    spendingPubKey: params.spendingPubKey,
    viewingPubKey: params.viewingPubKey,
  });
  return UserManager.fromUserItemToUser(userItem);
}

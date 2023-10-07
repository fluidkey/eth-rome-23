import middy from '@middy/core';
import { errorHandlerMiddleware } from './middleware/error-handler-middleware';
import {createDdbDocClient} from "../utils/dynamodb-manager";
import {GraphQLQueryGetUserByAddress} from "./method/graphql-query-get-user-by-address";
import {GraphQLQueryIsUserRegistered} from "./method/graphql-query-is-user-registered";
import {GraphQLMutationRegisterUser} from "./method/graphql-mutation-register-user";
import {GraphQLMutationSetUsername} from "./method/graphql-mutation-set-username";
import {GraphQLQueryGetUserStealthAddresses} from "./method/graphql-query-get-user-stealth-addresses";

interface AppSyncEvent {
  fieldName: string;
  arguments: {
    address?: string;
    registerUserInput?: {
      address: string;
      spendingPubKey: string;
      viewingPubKey: string;
    };
    username?: string
  };
}
const ddbDocClient = createDdbDocClient();
export const graphQLResolver = async (event: AppSyncEvent) => {
  console.log(event);
  let response;
  switch (event.fieldName) {
    case 'getUserByAddress':
      response = await GraphQLQueryGetUserByAddress({
        ddbDocClient: ddbDocClient,
        address: event.arguments!.address as string,
      });
      break;
    case 'getUserStealthAddresses':
      response = await GraphQLQueryGetUserStealthAddresses({
        ddbDocClient: ddbDocClient,
        address: event.arguments!.address as string,
      });
      break;
    case 'isUserRegistered':
      response = await GraphQLQueryIsUserRegistered({
        ddbDocClient: ddbDocClient,
        address: event.arguments!.address as string,
      });
      break;
    case 'registerUser':
      response = await GraphQLMutationRegisterUser({
        ddbDocClient: ddbDocClient,
        address: event.arguments!.registerUserInput!.address as string,
        viewingPubKey: event.arguments!.registerUserInput!.viewingPubKey as string,
        spendingPubKey: event.arguments!.registerUserInput!.spendingPubKey as string,
      });
      break;
    case 'setUsername':
      response = await GraphQLMutationSetUsername({
        ddbDocClient: ddbDocClient,
        address: event.arguments!.address as string,
        username: event.arguments!.username as string,
      });
      break;
    default:
      return null;
  }
  return response;
};

export const lambdaHandler = middy(graphQLResolver)
  .use(errorHandlerMiddleware());

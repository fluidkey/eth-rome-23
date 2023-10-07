import middy from '@middy/core';
import { AppSyncResolverEvent } from 'aws-lambda';

export const errorHandlerMiddleware = (): middy.MiddlewareObj<AppSyncResolverEvent<any>, any, Error> => ({
  onError: async (handler) => {
    const error = handler.error;
    console.error(handler.error); // Log the error
    handler.response = {
      errorType: 'InternalFailure',
      errorMessage: error?.message ?? 'Internal Server Error',
    };
  },
});

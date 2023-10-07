import {TypePolicies} from "@apollo/client";

export const InMemoryCacheOptions: TypePolicies | undefined = {
  User: {
    keyFields: ["address"]
  },
}

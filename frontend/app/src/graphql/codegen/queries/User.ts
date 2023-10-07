import { graphql } from "../generatedTS";

export const IS_USER_REGISTERED = graphql(`
    query IsUserRegistered($address: String!) {
        isUserRegistered(address: $address)
    }
`);

export const GET_USER_BY_ADDRESS = graphql(`
    query GetUserByAddress($address: String!) {
        getUserByAddress(address: $address) {
            address
            registeredAt
            spendingPubKey
            viewingPubKey
            username
        }
    }
`);

export const GET_USER_STEALTH_ADDRESSES = graphql(`
    query GetUserStealthAddresses($address: String!) {
        getUserStealthAddresses(address: $address)
    }
`);

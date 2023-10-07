import { graphql } from '../generatedTS';

export const REGISTER_USER = graphql(`
    mutation RegisterUser($registerUserInput: RegisterUserInput!) {
        registerUser(registerUserInput: $registerUserInput) {
            username
            viewingPubKey
            spendingPubKey
            registeredAt
            address
        }
    }
`);

export const SET_USERNAME = graphql(`
    mutation SetUsername($address: String!, $username: String!) {
        setUsername(address: $address, username: $username) {
            username
            viewingPubKey
            spendingPubKey
            registeredAt
            address
        }
    }
`);

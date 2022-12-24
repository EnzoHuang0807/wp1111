import { gql } from '@apollo/client';

const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage($from: String!, $to: String!, $body: String!) {
    createMessage(from: $from, to: $to, body: $body) {  
      sender
      body
    }
  }
`;

export {CREATE_MESSAGE_MUTATION}

import { gql } from '@apollo/client';

const CALLS_SUBSCRIPTION = gql`
  subscription onUpdateCall($postID: ID!) {
    commentAdded(postID: $postID) {
      id
      content
    }
  }
`;

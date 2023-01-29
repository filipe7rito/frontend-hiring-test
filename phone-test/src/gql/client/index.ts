import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  from,
  fromPromise,
  InMemoryCache,
  Operation,
  split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import tokenStorage from '../../helpers/tokenStorage';
import { REFRESH_TOKEN } from '../mutations';

const url = {
  http: 'https://frontend-test-api.aircall.dev/graphql',
  ws: 'wss://frontend-test-api.aircall.dev/websocket'
};

const getRefreshedToken = async (): Promise<void> => {
  // Set refresh token as the current access token to be used in the request from authLink
  const refreshToken = tokenStorage.getRefreshToken();
  if (refreshToken) {
    tokenStorage.setAccessToken(refreshToken);
  }

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: refreshToken
      }
    });

    const { access_token, refresh_token } = data.refreshTokenV2;

    // Update the tokens in local storage
    tokenStorage.setAccessToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);
  } catch (e) {
    throw new Error('Error refreshing token');
  }
};

function isSubscriptionOperation(operation: Operation) {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}

const wsClient = new SubscriptionClient(url.ws, {
  lazy: true,
  reconnect: true,
  connectionParams: () => {
    const accessToken = tokenStorage.getAccessToken();

    return {
      authorization: accessToken ? `Bearer ${accessToken}` : ''
    };
  }
});

const wsLink = new WebSocketLink(wsClient);

wsClient.onConnected(() =>
  console.log('%cwebsocket connected!!', 'color: green; background-color: yellow')
);
wsClient.onDisconnected(() =>
  console.log('%cwebsocket disconnected!!', 'color: red; background-color: yellow')
);
console.log('%cwebsocket disconnected!!', 'color: red ; background-color: yellow');
wsClient.onReconnected(() =>
  console.log('%cwebsocket reconnected!!', 'color: green; background-color: yellow')
);

const httpLink: ApolloLink = createHttpLink({
  uri: url.http
});

let isRefreshingToken: boolean = false;
let promise = Promise.resolve();

/**
 * Error link to handle errors
 * If the error is a 401- Unauthorized, we need to refresh the token
 */
const errorLink: ApolloLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.some(err => err.message === 'Unauthorized')) {
    // Check if the operation is a subscription
    const isWebsocket = isSubscriptionOperation(operation);

    if (!isRefreshingToken) {
      isRefreshingToken = true;
      promise = getRefreshedToken()
        .then(() => {
          isRefreshingToken = false;

          // If the operation is a subscription, close the websocket connection and reconnect
          if (isWebsocket) {
            wsClient.close(true);
          }
        })
        .catch(() => {
          // If we get an error while refreshing the token, log the user out
          localStorage.clear();
          window.location.reload();
        });
    } else {
      return forward(operation);
    }

    return fromPromise(promise).flatMap(() => {
      return forward(operation);
    });
  }
});

/**
 * Auth link to add the access token to the request
 */
const authLink: ApolloLink = setContext((_, { headers }) => {
  const accessToken = tokenStorage.getAccessToken();

  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  };
});

/**
 * Split the link to use the websocket link for subscriptions
 * and the http link for everything else
 */
const splitLink: ApolloLink = split(
  operation => {
    return isSubscriptionOperation(operation);
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache()
});

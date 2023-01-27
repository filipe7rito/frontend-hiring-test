import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  from,
  fromPromise,
  InMemoryCache,
  split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws'; // <- import this
import tokenStorage from '../../helpers/tokenStorage';
import { REFRESH_TOKEN } from '../mutations';
import { RetryLink } from '@apollo/client/link/retry';

const url = {
  http: 'https://frontend-test-api.aircall.dev/graphql',
  ws: 'ws://frontend-test-api.aircall.dev/websocket'
};

let isRefreshingToken: boolean = false;

const getRefreshedToken = async (): Promise<void> => {
  /**
   * If we are already refreshing the token, return the current promise
   * to avoid sending multiple requests
   */
  if (isRefreshingToken) return;

  // Set refresh token as the current access token to be used in the request from authLink
  const refreshToken = tokenStorage.getRefreshToken();
  if (refreshToken) {
    tokenStorage.setAccessToken(refreshToken);
  }

  isRefreshingToken = true;

  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN,
      variables: {
        refreshToken: refreshToken
      }
    });

    isRefreshingToken = false;

    const { access_token, refresh_token } = data.refreshTokenV2;

    // Update the tokens in local storage
    tokenStorage.setAccessToken(access_token);
    tokenStorage.setRefreshToken(refresh_token);
  } catch (e) {
    throw new Error('Error refreshing token');
  }
};

const wsClient = new SubscriptionClient(url.ws, {
  lazy: true,
  reconnect: true,
  timeout: 40000,
  connectionParams: () => {
    return {
      authorization: `Bearer ${tokenStorage.getAccessToken()}`
    };
  }
});
const wsLink = new WebSocketLink(wsClient);

wsClient.onConnected(() => console.log('websocket connected!!'));
wsClient.onDisconnected(() => console.log('websocket disconnected!!'));
wsClient.onReconnected(() => console.log('websocket reconnected!!'));

const httpLink: ApolloLink = createHttpLink({
  uri: url.http
});

/**
 * Auth link to add the access token to the request
 */
const authLink: ApolloLink = setContext((_, { headers }) => {
  const accessToken = tokenStorage.getAccessToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : ''
    }
  };
});

/**
 * Error link to handle errors
 * If the error is a 401, we need to refresh the token
 */
const errorLink: ApolloLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      const exception = err.extensions.exception as { status: number };

      if (exception && exception.status === 401) {
        return fromPromise(
          getRefreshedToken().catch(() => {
            // If we get an error while refreshing the token, log the user out
            localStorage.clear();
            window.location.href = '/login';
          })
        ).flatMap(() => {
          return forward(operation);
        });
      }
    }
  }
});

/**
 * Split the link to use the websocket link for subscriptions
 * and the http link for everything else
 */
const splitLink: ApolloLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: from([errorLink, authLink, splitLink]),
  cache: new InMemoryCache()
});

import { defaultTheme, Tractor } from '@aircall/tractor';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { CallDetailsPage } from './pages/CallDetails';
import { CallsListPage } from './pages/CallsList';
import { LoginPage } from './pages/Login/Login';

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import { GlobalAppStyle } from './style/global';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <CallsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls/:callId"
          element={
            <ProtectedRoute>
              <CallDetailsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/calls" />} />
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={defaultTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;

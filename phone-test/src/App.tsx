import { defaultTheme, Tractor } from '@aircall/tractor';
import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { CallDetailsPage } from './pages/CallDetails';
import { CallsListPage } from './pages/CallsList';
import { LoginPage } from './pages/Login/Login';

import { ApolloProvider } from '@apollo/client';

import { RouterProvider } from 'react-router-dom';
import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';
import { GlobalAppStyle } from './style/global';
import { client } from './gql/client';

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

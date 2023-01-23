import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../gql/mutations';
import { useLocalStorage } from './useLocalStorage';
import { useMutation } from '@apollo/client';

type Credentials = {
  username: string;
  password: string;
};

type ProviderType = {
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: UserType | null;
};

const defaultState: ProviderType = {
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  user: null
};

const AuthContext = createContext(defaultState);

export interface AuthPRoviderProps {
  children: React.ReactNode;
}

export const AuthProvider = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [status, setStatus] = useState('loading');
  const [accessToken, setAccessToken] = useLocalStorage('access_token', undefined);
  const [refreshToken, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [lastUser, setLastUser] = useLocalStorage('user', null);
  const [loginMutation] = useMutation(LOGIN);
  const navigate = useNavigate();

  const isAuthenticated = !!window.localStorage.getItem('access_token');

  useEffect(() => {
    if (accessToken && lastUser) {
      setUser(lastUser);
    }
  }, [accessToken, lastUser]);

  // call this function when you want to authenticate the user
  const login = ({ username, password }: Credentials) => {
    return loginMutation({
      variables: { input: { username, password } },
      onCompleted: ({ login }: any) => {
        const { access_token, refresh_token, user } = login;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        setUser(user);
        setLastUser(user);
        console.log('redirect to calls');
        navigate('/calls');
      }
    });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setLastUser(null);
    setUser(null);
    navigate('/login');
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      user
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

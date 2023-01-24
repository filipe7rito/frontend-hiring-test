import * as React from 'react';

import { Flex, Icon, LogoMarkColor, Spacer, useToast } from '@aircall/tractor';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FormState } from './Login.decl';
import { LoginForm } from './LoginForm';

const LOGIN_REJECTED = 'LOGIN_REJECTED';

export const LoginPage = () => {
  const { login } = useAuth();
  const [formState, setFormState] = React.useState<FormState>('Idle');
  const { showToast, removeToast } = useToast();

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/calls" replace />;
  }

  const onSubmit = async (email: string, password: string) => {
    try {
      setFormState('Pending');
      await login({ username: email, password });
      removeToast(LOGIN_REJECTED);
    } catch (error) {
      console.log(error);
      showToast({
        id: LOGIN_REJECTED,
        message: 'Invalid email or password',
        variant: 'error'
      });
    }
  };

  return (
    <Spacer p={5} h="100%" maxW={400} direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkColor} size={60} mx="auto" />
      </Flex>
      <LoginForm onSubmit={onSubmit} formState={formState} />
    </Spacer>
  );
};

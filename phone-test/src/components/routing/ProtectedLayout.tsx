import { Box, Button, Flex, Grid, Spacer, Typography } from '@aircall/tractor';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../logo.png';

export const ProtectedLayout = () => {
  const { logout, user } = useAuth();

  return (
    <Box minWidth="100vh" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <Typography variant="body" textAlign="center" py={3}>
            {`Welcome ${user?.username}!`}
          </Typography>
          <Button size="small" mode="outline" onClick={logout}>
            logout
          </Button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};

type TokenStorage = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
};

const tokenStorage: TokenStorage = {
  getAccessToken: () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return null;
    return JSON.parse(accessToken);
  },
  getRefreshToken: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;
    return JSON.parse(refreshToken);
  },
  setAccessToken: (accessToken: string) => {
    localStorage.setItem('access_token', JSON.stringify(accessToken));
  },
  setRefreshToken: (refreshToken: string) => {
    localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
  }
};

export default tokenStorage;

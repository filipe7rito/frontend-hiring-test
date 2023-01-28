type TokenStorage = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
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
  setAccessToken: (accessToken: string | null) => {
    localStorage.setItem('access_token', JSON.stringify(accessToken));
  },
  setRefreshToken: (refreshToken: string | null) => {
    localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
  }
};

export default tokenStorage;

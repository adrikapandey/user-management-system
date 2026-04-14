import { createContext, useEffect, useMemo, useState } from "react";
import { getMeRequest, loginRequest, refreshTokenRequest } from "../api/auth.js";

const STORAGE_KEY = "ums-auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { user: null, accessToken: null, refreshToken: null };
  });
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(auth.accessToken));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!auth.accessToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const { user } = await getMeRequest(auth.accessToken);

        if (isMounted) {
          setAuth((current) => ({ ...current, user }));
        }
      } catch (error) {
        try {
          if (!auth.refreshToken) {
            throw error;
          }

          const refreshed = await refreshTokenRequest(auth.refreshToken);

          if (isMounted) {
            setAuth(refreshed);
          }
        } catch (_refreshError) {
          if (isMounted) {
            setAuth({ user: null, accessToken: null, refreshToken: null });
          }
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.accessToken && auth.user),
      isBootstrapping,
      async login(credentials) {
        const response = await loginRequest(credentials);
        setAuth(response);
        return response;
      },
      logout() {
        setAuth({ user: null, accessToken: null, refreshToken: null });
      },
      updateStoredUser(user) {
        setAuth((current) => ({ ...current, user }));
      }
    }),
    [auth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

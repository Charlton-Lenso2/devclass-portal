import { createContext, useContext, useState, useEffect } from "react";
import api, { setTokenGetter, setTokenSetter } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setTokenGetter(() => accessToken);
    setTokenSetter((token) => setAccessToken(token));
  }, [accessToken]);

  useEffect(() => {
    async function tryRestoreSession() {
      try {
        const res = await api.post("/auth/refresh");
        const token = res.data.accessToken;
        setAccessToken(token);
        const meRes = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(meRes.data);
      } catch {
      } finally {
        setInitializing(false);
      }
    }
    tryRestoreSession();
  }, []);
  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
    return res.data;
  }

  async function register(name, email, password, role = "STUDENT") {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    setUser(res.data.user);
    setAccessToken(res.data.accessToken);
    return res.data;
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, register, logout, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

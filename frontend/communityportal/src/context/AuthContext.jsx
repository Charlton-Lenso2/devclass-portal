import { createContext, useContext, useState, useEffect } from "react";
import api, { setTokenGetter } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
     setTokenGetter(() => accessToken);
   }, [accessToken]);

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
      value={{ user, accessToken, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

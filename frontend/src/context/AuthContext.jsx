import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("telemed_auth");
    return saved ? JSON.parse(saved) : { user: null, token: null };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("telemed_auth", JSON.stringify(auth));
  }, [auth]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", payload);
      setAuth({ user: data.user, token: data.token });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuth({ user: data.user, token: data.token });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("telemed_auth");
  };

  const refreshProfile = async () => {
    if (!auth.token) {
      return null;
    }
    const { data } = await api.get("/auth/me");
    setAuth((current) => ({ ...current, user: data.user }));
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ ...auth, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

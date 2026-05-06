import { createContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const setToken = (value) => {
    if (value) {
      localStorage.setItem("token", value);
      setTokenState(value);
      return;
    }
    localStorage.removeItem("token");
    setTokenState(null);
  };

  const logout = () => {
    setToken(null);
    navigate("/logout");
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken,
      logout
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

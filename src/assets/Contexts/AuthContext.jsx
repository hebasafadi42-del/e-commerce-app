import { createContext, useState } from "react";

export const AuthContext = createContext();


const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user_info"));
  } catch {
    localStorage.removeItem("user_info");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user_info", JSON.stringify(userData));
  };

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user_info");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, saveUser, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
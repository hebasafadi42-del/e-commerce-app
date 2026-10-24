import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { API_Config } from "../Config/API-Config";
import { extractError } from "../Pages/Admin/adminUtils";

const AdminContext = createContext(null);

const BASE = `${API_Config.Base_URL}/${API_Config.ENDPOINTS.ADMIN}`;
const TOKEN_KEY = "admin_token";


const pickToken = (json) =>
  json?.token ??
  json?.data?.token ??
  json?.access_token ??
  json?.data?.access_token ??
  json?.data?.plainTextToken ??
  null;

export const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const clearToken = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const request = useCallback(
    async (path, { method = "GET", body, query } = {}) => {
      const qs = query ? `?${new URLSearchParams(query)}` : "";

      
      const isForm = typeof FormData !== "undefined" && body instanceof FormData;

      const res = await fetch(`${BASE}/${path}${qs}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      });
      const json = await res.json().catch(() => null);

      if (res.status === 401 && token) clearToken();

      if (!res.ok) {
        const err = new Error(extractError(json, res.status));
        err.status = res.status;
        throw err;
      }
      return json;
    },
    [token, clearToken]
  );

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(extractError(json, res.status));

  
    const t = pickToken(json);
    if (!t) throw new Error("Login succeeded but no token was found in the response.");
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }, []);

  const logout = useCallback(async () => {
    try {
      await request("logout", { method: "POST" });
    } catch {
      
    }
    clearToken();
  }, [request, clearToken]);

  const value = useMemo(
    () => ({ token, isAuthed: !!token, request, login, logout }),
    [token, request, login, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
};
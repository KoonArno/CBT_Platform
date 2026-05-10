"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const STORAGE_KEY = "thera.auth.user";

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function makeMockUser(email: string, name?: string): AuthUser {
  const cleaned = email.trim().toLowerCase();
  return {
    id: `u_${cleaned.replace(/[^a-z0-9]/g, "_")}`,
    name: name?.trim() || cleaned.split("@")[0] || "Supervisor",
    email: cleaned,
    role: "Supervisor",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await delay(350);
    if (!email || !password) throw new Error("กรุณากรอก email และ password");
    const next = makeMockUser(email);
    writeStoredUser(next);
    setUser(next);
    return next;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await delay(450);
      if (!name || !email || !password)
        throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
      const next = makeMockUser(email, name);
      writeStoredUser(next);
      setUser(next);
      return next;
    },
    [],
  );

  const logout = useCallback(() => {
    writeStoredUser(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, signup, logout }),
    [user, loading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

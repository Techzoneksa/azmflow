"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout as serverLogout } from "@/app/actions/authActions";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser({ name: session.name, role: session.role });
      }
      setLoading(false);
    });
  }, []);

  const logout = useCallback(async () => {
    await serverLogout();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  }, [router]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

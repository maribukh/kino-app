"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<User>) => void;
  signup: (data: FormData) => Promise<void>;
  login: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  modalMode: "login" | "signup" | null;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.kinoxii.redberryinternship.ge/api";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [modalMode, setModalMode] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    queueMicrotask(() => {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    });
  }, []);

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const signup = async (formData: FormData) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    if (result?.data?.token) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      setUser(result.data.user);
      setModalMode(null);
    }
  };

  const login = async (data: Record<string, string>) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result;
    }

    if (result?.data?.token) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      setUser(result.data.user);
      setModalMode(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        updateUser,
        signup,
        login,
        logout,
        modalMode,
        openLoginModal: () => setModalMode("login"),
        openSignUpModal: () => setModalMode("signup"),
        closeAuthModal: () => setModalMode(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

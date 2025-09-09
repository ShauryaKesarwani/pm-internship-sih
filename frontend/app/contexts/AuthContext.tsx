"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  field?: string;
  contact?: string;
  about?: string;
  residence?: {
    pin?: number;
    city?: string;
    state?: string;
  };
  resume?: {
    skills?: string[];
    socialLinks?: string[];
    certifications?: string[];
  };
  links?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserData>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const login = (userData: UserData) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:7470/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("http://localhost:7470/user/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // If not authenticated, redirect to login
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:7470/user/profile", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

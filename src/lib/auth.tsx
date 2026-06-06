import * as React from "react";
import { useNavigate } from "@tanstack/react-router";

interface User {
  name: string;
  email: string;
  password: string; // plain for demo – NEVER store plain passwords in production
  gender: "male" | "female";
}

interface AuthContextValue {
  user: User | null;
  isGuest: boolean;
  register: (name: string, email: string, password: string, gender: "male" | "female") => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setGuest: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const GUEST_KEY = "wellnest.guest";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("wellnest.currentUser");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const isGuest = !user && (typeof window !== 'undefined' && sessionStorage.getItem(GUEST_KEY) === "true");

  const setGuest = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(GUEST_KEY, "true");
    }
  };

  const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem("wellnest.users");
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("wellnest.users", JSON.stringify(users));
    }
  };

  const register = (name: string, email: string, password: string, gender: "male" | "female") => {
    const users = getUsers();
    // simple duplicate check
    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }
    const newUser: User = { name, email, password, gender };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem("wellnest.currentUser", JSON.stringify(newUser));
    sessionStorage.removeItem(GUEST_KEY);
    setUser(newUser);
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      return false;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem("wellnest.currentUser", JSON.stringify(found));
      sessionStorage.removeItem(GUEST_KEY);
    }
    setUser(found);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("wellnest.currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, register, login, logout, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

/** Returns a guard function. Call it before any save/action — returns true if the user is a guest (and redirects to /register). */
export const useGuestGuard = () => {
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  return () => {
    if (isGuest) {
      navigate({ to: "/register" });
      return true;
    }
    return false;
  };
};

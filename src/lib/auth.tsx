import * as React from "react";

interface User {
  name: string;
  email: string;
  password: string; // plain for demo – NEVER store plain passwords in production
}

interface AuthContextValue {
  user: User | null;
  register: (name: string, email: string, password: string) => void;
  login: (email: string, password: string) => boolean,
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("wellnest.currentUser");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

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

  const register = (name: string, email: string, password: string) => {
    const users = getUsers();
    // simple duplicate check
    if (users.some((u) => u.email === email)) {
      alert("Email already registered");
      return;
    }
    const newUser: User = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem("wellnest.currentUser", JSON.stringify(newUser));
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
    }
    setUser(found);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("wellnest.currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
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

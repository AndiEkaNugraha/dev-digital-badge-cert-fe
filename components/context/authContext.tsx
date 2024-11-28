"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { UserData } from "@/components/interface/userInterface";

interface UserContextType {
  userData: UserData | null;
  setUserData: (user: UserData | null) => void;
}

const AuthContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

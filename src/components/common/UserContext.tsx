"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface UserInfo {
  userName: string;
  userRole: 'Admin' | 'Manager' | 'Associate';
}

interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  // For future: fetchUserFromAPI: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Fallback: get from localStorage
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = (localStorage.getItem('userRole') as UserInfo['userRole']) || 'Associate';
    setUser({ userName, userRole });
    // For future: fetch from API and setUser
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

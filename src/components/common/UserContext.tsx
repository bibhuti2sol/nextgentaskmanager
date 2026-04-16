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
  const [loading, setLoading] = useState(true);

  const updateUserInfo = (info: UserInfo) => {
    localStorage.setItem('userName', info.userName);
    localStorage.setItem('userRole', info.userRole);
    setUser(info);
    // Dispatch storage event manually for same-tab updates if needed
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const updateUserFromStorage = () => {
      const userName = localStorage.getItem('userName') || 'Bibhuti';
      const userRole = (localStorage.getItem('userRole') as UserInfo['userRole']) || 'Admin';
      setUser({ userName, userRole });
      setLoading(false);
    };
    updateUserFromStorage();
    window.addEventListener('storage', updateUserFromStorage);
    return () => window.removeEventListener('storage', updateUserFromStorage);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: updateUserInfo }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

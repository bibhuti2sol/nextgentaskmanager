'use client';

import { useState, useEffect } from 'react';
import DashboardInteractive from './components/DashboardInteractive';

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<'Admin' | 'Manager' | 'Associate'>('Associate');
  const [userName, setUserName] = useState<string>('User');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Read user role and name from localStorage (set during login)
    const savedRole = localStorage.getItem('userRole') as 'Admin' | 'Manager' | 'Associate' | null;
    const savedName = localStorage.getItem('userName');
    
    if (savedRole) {
      setUserRole(savedRole);
    }
    if (savedName) {
      setUserName(savedName);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <DashboardInteractive userRole={userRole} userName={userName} />;
}
'use client';


import { useUser } from '@/components/common/UserContext';
import DashboardInteractive from './components/DashboardInteractive';

export default function DashboardPage() {
  const { user } = useUser();
  const userRole = user?.userRole || 'Associate';
  const userName = user?.userName || 'User';
  return <DashboardInteractive userRole={userRole} userName={userName} />;
}
import type { Metadata } from 'next';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserManagementInteractive from './components/UserManagementInteractive';

export const metadata: Metadata = {
  title: 'User Management - NextGenTaskManager',
  description:
    'Manage organizational users, teams, and hierarchical structures with comprehensive administrative tools for user provisioning, role assignment, and team allocation.',
};

export default function UserManagementPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="flex-1 ml-[240px] transition-smooth">
        <div className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-8">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">User Management</h1>
              <p className="font-caption text-sm text-muted-foreground">
                Manage users, teams, and organizational hierarchy
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserRoleIndicator />
            </div>
          </div>
        </div>

        <div className="p-8">
          <UserManagementInteractive />
        </div>
      </main>
    </div>
  );
}
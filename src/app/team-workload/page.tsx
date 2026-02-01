import type { Metadata } from 'next';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import TeamWorkloadInteractive from './components/TeamWorkloadInteractive';

export const metadata: Metadata = {
  title: 'Team Workload - NextGenTaskManager',
  description:
    'Visualize team capacity, distribute tasks effectively, and monitor productivity across all team members with AI-powered workload balancing and real-time analytics.',
};

export default function TeamWorkloadPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <main className="flex-1 ml-[240px] transition-smooth">
        <div className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-8">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Team Workload</h1>
              <p className="font-caption text-sm text-muted-foreground">
                Monitor and balance team capacity
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserRoleIndicator />
            </div>
          </div>
        </div>

        <div className="p-8">
          <TeamWorkloadInteractive />
        </div>
      </main>
    </div>
  );
}
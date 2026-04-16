'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import NotificationCenter from './NotificationCenter';
import MetricsCard from './MetricsCard';
import TaskPriorityChart from './TaskPriorityChart';
import ProjectHealthChart from './ProjectHealthChart';
import ProductivityChart from './ProductivityChart';
import SubtaskChart from './SubtaskChart';
import { BellIcon } from '@heroicons/react/24/outline';

import QuickActions from './QuickActions';
import CalendarPreview from './CalendarPreview';
import TeamWorkloadOverview from './TeamWorkloadOverview';
import Icon from '@/components/ui/AppIcon';
import ProjectSelector from './ProjectSelector';

interface DashboardData {
  activeTasks: { count: number; progressPercentage: number };
  upcomingDeadlines: { count: number; progressPercentage: number };
  team: { memberCount: number; activePercentage: number };
  completionRate: { percentage: number; completedTasks: number; totalTasks: number };
  priorityOverview: { high: number; medium: number; low: number };
  weeklyProductivity: { date: string; todo: number; inProgress: number; done: number }[];
  teamWorkload: { userId: number; userName: string; assignedTaskCount: number; workloadPercentage: number }[];
}

interface Project {
  id: number;
  name: string;
}

interface DashboardInteractiveProps {
  userRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
}

const DashboardInteractive = ({ userRole: initialRole, userName = 'User' }: DashboardInteractiveProps) => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const [projects, setProjects] = useState<Project[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_AUTH = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs';

  // Fetch Projects List
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://43.205.137.114:8080/api/v1/projects?search=&status=&page=0&size=100&sort=id,desc', {
          headers: { Authorization: API_AUTH },
        });
        if (response.data && response.data.content) {
          setProjects(response.data.content.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch Dashboard Stats
  const fetchDashboardData = async (projectId: number | null) => {
    setLoading(true);
    try {
      const url = `http://43.205.137.114:8080/api/v1/dashboard${projectId ? `?projectId=${projectId}` : ''}`;
      const response = await axios.get(url, {
        headers: { Authorization: API_AUTH },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedProjectId);
  }, [selectedProjectId]);

  // Derived Metrics from API Data
  const metrics = dashboardData ? [
    { 
      title: 'Active Tasks', 
      value: String(dashboardData.activeTasks.count), 
      change: dashboardData.activeTasks.progressPercentage, 
      icon: '📋', 
      variant: 'primary' as const 
    },
    { 
      title: 'Upcoming Deadlines', 
      value: String(dashboardData.upcomingDeadlines.count), 
      change: dashboardData.upcomingDeadlines.progressPercentage, 
      icon: '⏰', 
      variant: 'warning' as const 
    },
    { 
      title: 'Team Members', 
      value: String(dashboardData.team.memberCount), 
      change: dashboardData.team.activePercentage, 
      icon: '👥', 
      variant: 'success' as const 
    },
    { 
      title: 'Completion Rate', 
      value: `${Math.round(dashboardData.completionRate.percentage)}%`, 
      change: 0, 
      icon: '✅', 
      variant: 'success' as const 
    }
  ] : [];

  // Derived Chart Data
  const priorityDistribution = dashboardData ? [
    { name: 'High', value: dashboardData.priorityOverview.high, color: '#F87171' },
    { name: 'Medium', value: dashboardData.priorityOverview.medium, color: '#FBBF24' },
    { name: 'Low', value: dashboardData.priorityOverview.low, color: '#4ADE80' },
  ] : [];

  const productivityChartData = dashboardData?.weeklyProductivity?.map(day => ({
    day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    completed: day.done,
    inProgress: day.inProgress,
    todo: day.todo
  })) || [];

  const teamWorkload = dashboardData?.teamWorkload?.map(member => ({
    id: member.userId,
    name: member.userName,
    role: 'Team Member', // API doesn't provide role yet
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userName)}&background=random`,
    alt: `${member.userName} profile picture`,
    activeTasks: member.assignedTaskCount,
    workloadPercentage: member.workloadPercentage
  })) || [];

  // Dynamic project health data based on API response
  const currentProjectsData = dashboardData ? [
    {
      id: selectedProjectId || 0,
      name: projects.find(p => p.id === selectedProjectId)?.name || 'All Projects Portfolio',
      healthScore: Math.round(dashboardData.completionRate.percentage),
      tasksCompleted: dashboardData.completionRate.completedTasks,
      totalTasks: dashboardData.completionRate.totalTasks,
      status: dashboardData.completionRate.percentage >= 80 ? 'On Track' as const : 
              dashboardData.completionRate.percentage >= 50 ? 'At Risk' as const : 
              dashboardData.activeTasks.count > 0 ? 'Delayed' as const : 'On Track' as const
    }
  ] : [];

  const mockCalendarEvents = [
    { id: 1, title: 'Sprint Planning Meeting', time: '10:00 AM - 11:30 AM', type: 'meeting' as const },
    { id: 2, title: 'Project Deadline: Mobile App', time: '5:00 PM', type: 'deadline' as const }
  ];

  const mockQuickActions = [
    {
      id: 1,
      label: 'Create Task',
      icon: 'PlusCircleIcon',
      color: 'bg-primary/10 text-primary',
      onClick: () => console.log('Create task')
    },
    {
      id: 2,
      label: 'Start Timer',
      icon: 'PlayIcon',
      color: 'bg-success/10 text-success',
      onClick: () => console.log('Start timer')
    },
    {
      id: 3,
      label: 'View Reports',
      icon: 'ChartBarIcon',
      color: 'bg-warning/10 text-warning',
      onClick: () => console.log('View reports')
    },
    {
      id: 4,
      label: 'Team Chat',
      icon: 'ChatBubbleLeftRightIcon',
      color: 'bg-accent/10 text-accent',
      onClick: () => console.log('Team chat')
    }
  ];

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) setUnreadCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div className={`transition-smooth ${sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-6">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <div>
                <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground font-caption">
                  Welcome back! Here's your overview for today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProjectSelector
                projects={projects}
                selectedProjectId={selectedProjectId}
                onProjectChange={setSelectedProjectId}
              />
              <div className="relative">
                <button onClick={toggleNotifications} className="relative focus:outline-none">
                  <BellIcon className="h-6 w-6 text-foreground cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                   <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4">
                     <h4 className="font-bold text-sm text-foreground mb-2">Notifications</h4>
                     <ul className="text-sm text-muted-foreground">
                       <li className="mb-2">Task "Design mobile app wireframes" is due tomorrow.</li>
                       <li className="mb-2">New comment on task "API endpoint documentation".</li>
                       <li>Database schema optimization task is overdue.</li>
                     </ul>
                   </div>
                )}
              </div>
              <ThemeToggle />
              <div className="h-8 w-px bg-border" />
              <UserRoleIndicator
                currentRole={user?.userRole}
                userName={user?.userName}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`p-6 transition-all duration-300 ${loading ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Quick Actions</h2>
            <QuickActions actions={mockQuickActions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-xl text-foreground">Priority Tasks</h2>
                </div>
                <TaskPriorityChart data={priorityDistribution} />
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Weekly Productivity</h2>
                <ProductivityChart data={productivityChartData} />
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Team Workload</h2>
                <TeamWorkloadOverview teamMembers={teamWorkload} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Project Health</h2>
                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <ProjectHealthChart projects={currentProjectsData} />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <CalendarPreview events={mockCalendarEvents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardInteractive;
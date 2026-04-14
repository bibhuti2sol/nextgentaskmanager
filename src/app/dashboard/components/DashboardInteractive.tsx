'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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

interface DashboardInteractiveProps {
  userRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
}

const DashboardInteractive = ({ userRole: initialRole, userName = 'User' }: DashboardInteractiveProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>(initialRole);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // Initial unread notifications count

  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://43.205.137.114:8080/api/v1/projects?page=0&size=100&sort=id,desc', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
          },
        });
        if (response.data && response.data.content) {
          setProjects(response.data.content.map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const allProjects = projects;

  const mockTasksData = [
    {
      id: 1,
      title: 'Implement user authentication system with OAuth 2.0',
      priority: 'High' as const,
      status: 'In Progress' as const,
      deadline: 'Jan 29, 2026',
      assignee: 'Sarah Johnson',
      projectId: allProjects[0]?.id || 1
    },
    {
      id: 2,
      title: 'Design new dashboard layout for mobile responsiveness',
      priority: 'Medium' as const,
      status: 'Pending' as const,
      deadline: 'Feb 02, 2026',
      assignee: 'Michael Chen',
      projectId: allProjects[1]?.id || 2
    },
    {
      id: 3,
      title: 'Update API documentation and integration guides',
      priority: 'Low' as const,
      status: 'Completed' as const,
      deadline: 'Jan 25, 2026',
      assignee: 'Emily Rodriguez',
      projectId: allProjects[0]?.id || 1
    },
    {
      id: 4,
      title: 'Setup cloud infrastructure and deployment pipeline',
      priority: 'High' as const,
      status: 'In Progress' as const,
      deadline: 'Feb 05, 2026',
      assignee: 'David Kim',
      projectId: allProjects[2]?.id || 3
    }
  ];

  const allTasks = mockTasksData;

  const allMetrics = [
    { title: 'Active Tasks', value: 24, change: 12, icon: '📋', variant: 'primary' as const, projectId: null },
    { title: 'Upcoming Deadlines', value: 8, change: -5, icon: '⏰', variant: 'warning' as const, projectId: null },
    { title: 'Team Members', value: 12, change: 8, icon: '👥', variant: 'success' as const, projectId: null },
    { title: 'Completion Rate', value: '87%', change: 15, icon: '✅', variant: 'success' as const, projectId: null }
  ];

  const allProjectsData = [
    {
      id: 1,
      name: 'NextGen Mobile App Development',
      healthScore: 85,
      tasksCompleted: 42,
      totalTasks: 50,
      status: 'On Track' as const
    },
    {
      id: 2,
      name: 'Enterprise Dashboard Redesign',
      healthScore: 62,
      tasksCompleted: 28,
      totalTasks: 45,
      status: 'At Risk' as const
    },
    {
      id: 3,
      name: 'Cloud Migration Initiative',
      healthScore: 78,
      tasksCompleted: 15,
      totalTasks: 30,
      status: 'On Track' as const
    },
    {
      id: 4,
      name: 'Customer Portal Enhancement',
      healthScore: 91,
      tasksCompleted: 22,
      totalTasks: 25,
      status: 'On Track' as const
    }
  ];

  // Filter data based on selected project
  const filteredTasks = selectedProjectId !== null
    ? allTasks.filter(task => task.projectId === selectedProjectId)
    : allTasks;

  const filteredProjects = selectedProjectId
    ? allProjectsData.filter(project => project.id === selectedProjectId)
    : allProjectsData;

  // Calculate filtered metrics
  const mockMetrics = selectedProjectId
    ? [
      { title: 'Active Tasks', value: filteredTasks.filter(t => t.status === 'In Progress').length, change: 12, icon: '📋', variant: 'primary' as const },
      { title: 'Upcoming Deadlines', value: filteredTasks.filter(t => t.status !== 'Completed').length, change: -5, icon: '⏰', variant: 'warning' as const },
      { title: 'Team Members', value: new Set(filteredTasks.map(t => t.assignee)).size, change: 8, icon: '👥', variant: 'success' as const },
      { title: 'Completion Rate', value: filteredProjects[0] ? `${Math.round((filteredProjects[0].tasksCompleted / filteredProjects[0].totalTasks) * 100)}%` : '0%', change: 15, icon: '✅', variant: 'success' as const }
    ]
    : allMetrics;

  const mockTasks = filteredTasks;
  const mockProjects = filteredProjects;

  const priorityDistribution = [
    { name: 'High', value: mockTasks.filter(t => t.priority === 'High').length, color: '#F87171' },
    { name: 'Medium', value: mockTasks.filter(t => t.priority === 'Medium').length, color: '#FBBF24' },
    { name: 'Low', value: mockTasks.filter(t => t.priority === 'Low').length, color: '#4ADE80' },
  ];

  const mockChartData = [
    { day: 'Mon', completed: 12, inProgress: 8 },
    { day: 'Tue', completed: 15, inProgress: 10 },
    { day: 'Wed', completed: 18, inProgress: 7 },
    { day: 'Thu', completed: 14, inProgress: 12 },
    { day: 'Fri', completed: 20, inProgress: 9 },
    { day: 'Sat', completed: 8, inProgress: 5 },
    { day: 'Sun', completed: 6, inProgress: 3 }];


  const mockNotifications = [
    {
      id: 1,
      type: 'escalation' as const,
      title: 'Task Escalated',
      message: 'Authentication system implementation has been escalated due to deadline proximity',
      time: '5 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'milestone' as const,
      title: 'Milestone Achieved',
      message: 'Mobile App Development project reached 80% completion',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 3,
      type: 'blocker' as const,
      title: 'Blocker Reported',
      message: 'API integration blocked by missing credentials from external team',
      time: '4 hours ago',
      isRead: true
    }];


  const mockRecommendations = [
    {
      id: 1,
      type: 'priority' as const,
      title: 'Prioritize Authentication Task',
      description: 'Based on deadline analysis, this task should be moved to top priority to avoid delays',
      action: 'Adjust Priority'
    },
    {
      id: 2,
      type: 'workload' as const,
      title: 'Balance Team Workload',
      description: 'Sarah Johnson has 8 active tasks while Michael Chen has only 3. Consider redistribution',
      action: 'View Workload'
    }];


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
    }];


  const mockCalendarEvents = [
    { id: 1, title: 'Sprint Planning Meeting', time: '10:00 AM - 11:30 AM', type: 'meeting' as const },
    { id: 2, title: 'Project Deadline: Mobile App', time: '5:00 PM', type: 'deadline' as const }];


  const mockTeamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fb6cf439-1763299224286.png",
      alt: 'Professional woman with brown hair in white blouse smiling at camera',
      activeTasks: 8,
      workloadPercentage: 92
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_144f5236b-1763295524542.png",
      alt: 'Asian man with short black hair in casual blue shirt outdoors',
      activeTasks: 3,
      workloadPercentage: 45
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Project Manager',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dc372df-1763294269106.png",
      alt: 'Hispanic woman with long dark hair in professional attire',
      activeTasks: 6,
      workloadPercentage: 78
    }];


  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setUnreadCount(0); // Clear unread count when notifications are viewed
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        userRole={currentRole}
      />

      <div
        className={`transition-smooth ${sidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`}>

        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-6">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground font-caption">
                Welcome back! Here's your overview for today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <ProjectSelector
                projects={allProjects}
                selectedProjectId={selectedProjectId}
                onProjectChange={setSelectedProjectId}
              />
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="relative focus:outline-none"
                >
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
                currentRole={currentRole}
                userName={userName}
                onRoleChange={setCurrentRole} />

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {mockMetrics.map((metric, index) =>
              <MetricsCard key={index} {...metric} value={String(metric.value)} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Quick Actions</h2>
            <QuickActions actions={mockQuickActions} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tasks & Projects */}
            <div className="lg:col-span-2 space-y-6">
              {/* Priority Tasks */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-xl text-foreground">Priority Tasks</h2>
                  <button className="text-primary text-sm font-caption font-medium hover:underline flex items-center gap-1">
                    View All
                    <Icon name="ArrowRightIcon" size={16} variant="outline" />
                  </button>
                </div>
                <TaskPriorityChart data={priorityDistribution} />
              </div>

              {/* Subtask Overview Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Subtask Overview
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between py-2 px-3 rounded-md bg-blue-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Total Subtasks</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{allTasks.length}</span>
                  </li>
                  <li className="flex items-center justify-between py-2 px-3 rounded-md bg-amber-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-sm font-medium text-gray-700">In Progress</span>
                    </div>
                    <span className="text-sm font-semibold text-amber-600">
                      {allTasks.filter(t => t.status !== 'Completed').length}
                    </span>
                  </li>
                  <li className="flex items-center justify-between py-2 px-3 rounded-md bg-green-50">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="text-sm font-medium text-gray-700">Closed</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {allTasks.filter(t => t.status === 'Completed').length}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Productivity Chart */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Weekly Productivity
                </h2>
                <ProductivityChart data={mockChartData} />
              </div>

              {/* Team Workload (Manager/Admin Only) */}
              {(currentRole === 'Manager' || currentRole === 'Admin') &&
                <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-xl text-foreground">Team Workload</h2>
                    <button className="text-primary text-sm font-caption font-medium hover:underline flex items-center gap-1">
                      View Details
                      <Icon name="ArrowRightIcon" size={16} variant="outline" />
                    </button>
                  </div>
                  <TeamWorkloadOverview teamMembers={mockTeamMembers} />
                </div>
              }
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6">
              {/* Project Health */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-xl text-foreground">Project Health</h2>
                  <button className="text-primary text-sm font-caption font-medium hover:underline flex items-center gap-1">
                    View All
                    <Icon name="ArrowRightIcon" size={16} variant="outline" />
                  </button>
                </div>
                <ProjectHealthChart projects={mockProjects} />
              </div>

              {/* Calendar Preview */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
                <CalendarPreview events={mockCalendarEvents} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

};

export default DashboardInteractive;
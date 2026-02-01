'use client';

import { useState } from 'react';
import ProjectListView from './ProjectListView';
import ProjectHealthDashboard from './ProjectHealthDashboard';
import ResourceAllocation from './ResourceAllocation';
import MilestoneTracker from './MilestoneTracker';
import ProjectCreationPanel, { ProjectFormData } from './ProjectCreationPanel';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import Icon from '@/components/ui/AppIcon';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  isMilestone: boolean;
  isCriticalPath: boolean;
}

interface HealthMetric {
  label: string;
  value: number;
  target: number;
  status: 'on-track' | 'at-risk' | 'critical';
  icon: string;
  unit: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  allocation: number;
  availability: 'available' | 'busy' | 'unavailable';
  currentTasks: number;
  capacity: number;
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  owner: string;
}

const ProjectOverviewInteractive = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>('Manager');
  const [activeTab, setActiveTab] = useState<'list' | 'resources' | 'milestones'>('list');
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectFormData[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Project Planning & Requirements',
    startDate: '2026-01-15',
    endDate: '2026-01-28',
    progress: 100,
    dependencies: [],
    assignee: 'Sarah Johnson',
    priority: 'High',
    isMilestone: true,
    isCriticalPath: true
  },
  {
    id: 'task-2',
    name: 'UI/UX Design Phase',
    startDate: '2026-01-29',
    endDate: '2026-02-18',
    progress: 75,
    dependencies: ['task-1'],
    assignee: 'Michael Chen',
    priority: 'High',
    isMilestone: false,
    isCriticalPath: true
  },
  {
    id: 'task-3',
    name: 'Frontend Development',
    startDate: '2026-02-19',
    endDate: '2026-03-25',
    progress: 45,
    dependencies: ['task-2'],
    assignee: 'Emily Rodriguez',
    priority: 'High',
    isMilestone: false,
    isCriticalPath: true
  },
  {
    id: 'task-4',
    name: 'Backend API Development',
    startDate: '2026-02-12',
    endDate: '2026-03-18',
    progress: 60,
    dependencies: ['task-1'],
    assignee: 'David Kim',
    priority: 'Medium',
    isMilestone: false,
    isCriticalPath: false
  },
  {
    id: 'task-5',
    name: 'Database Setup & Migration',
    startDate: '2026-02-05',
    endDate: '2026-02-25',
    progress: 85,
    dependencies: ['task-1'],
    assignee: 'Jessica Taylor',
    priority: 'Medium',
    isMilestone: false,
    isCriticalPath: false
  },
  {
    id: 'task-6',
    name: 'Integration Testing',
    startDate: '2026-03-26',
    endDate: '2026-04-08',
    progress: 20,
    dependencies: ['task-3', 'task-4'],
    assignee: 'Robert Martinez',
    priority: 'High',
    isMilestone: false,
    isCriticalPath: true
  },
  {
    id: 'task-7',
    name: 'Beta Testing & QA',
    startDate: '2026-04-09',
    endDate: '2026-04-22',
    progress: 0,
    dependencies: ['task-6'],
    assignee: 'Amanda Wilson',
    priority: 'High',
    isMilestone: true,
    isCriticalPath: true
  },
  {
    id: 'task-8',
    name: 'Production Deployment',
    startDate: '2026-04-23',
    endDate: '2026-04-30',
    progress: 0,
    dependencies: ['task-7'],
    assignee: 'Christopher Lee',
    priority: 'High',
    isMilestone: true,
    isCriticalPath: true
  }];


  const mockHealthMetrics: HealthMetric[] = [
  {
    label: 'Tasks Completed',
    value: 42,
    target: 68,
    status: 'on-track',
    icon: 'CheckCircleIcon',
    unit: ''
  },
  {
    label: 'Budget Utilized',
    value: 68,
    target: 100,
    status: 'on-track',
    icon: 'CurrencyDollarIcon',
    unit: '%'
  },
  {
    label: 'Team Velocity',
    value: 7.8,
    target: 10,
    status: 'at-risk',
    icon: 'BoltIcon',
    unit: ''
  },
  {
    label: 'Risk Score',
    value: 3,
    target: 10,
    status: 'on-track',
    icon: 'ShieldExclamationIcon',
    unit: ''
  }];


  const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Sarah Johnson',
    role: 'Project Manager',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
    alt: 'Professional woman with brown hair in business attire smiling at camera',
    allocation: 95,
    availability: 'busy',
    currentTasks: 8,
    capacity: 10
  },
  {
    id: 'member-2',
    name: 'Michael Chen',
    role: 'UI/UX Designer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cd09ec58-1763296862264.png",
    alt: 'Asian man with glasses in casual blue shirt smiling outdoors',
    allocation: 85,
    availability: 'busy',
    currentTasks: 6,
    capacity: 8
  },
  {
    id: 'member-3',
    name: 'Emily Rodriguez',
    role: 'Frontend Developer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dc372df-1763294269106.png",
    alt: 'Hispanic woman with long dark hair in professional attire',
    allocation: 78,
    availability: 'available',
    currentTasks: 5,
    capacity: 8
  },
  {
    id: 'member-4',
    name: 'David Kim',
    role: 'Backend Developer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf9d07e2-1763295152029.png",
    alt: 'Young man with short black hair in casual attire smiling',
    allocation: 60,
    availability: 'available',
    currentTasks: 4,
    capacity: 8
  },
  {
    id: 'member-5',
    name: 'Jessica Taylor',
    role: 'Database Administrator',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_152c5c9f3-1763296503496.png",
    alt: 'Woman with blonde hair in professional white blouse',
    allocation: 72,
    availability: 'available',
    currentTasks: 5,
    capacity: 8
  }];


  const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    name: 'Project Kickoff & Planning',
    dueDate: '2026-01-28',
    status: 'completed',
    progress: 100,
    tasksCompleted: 12,
    totalTasks: 12,
    owner: 'Sarah Johnson'
  },
  {
    id: 'milestone-2',
    name: 'Design Phase Completion',
    dueDate: '2026-02-18',
    status: 'in-progress',
    progress: 75,
    tasksCompleted: 9,
    totalTasks: 12,
    owner: 'Michael Chen'
  },
  {
    id: 'milestone-3',
    name: 'Development Phase Complete',
    dueDate: '2026-03-25',
    status: 'in-progress',
    progress: 52,
    tasksCompleted: 18,
    totalTasks: 35,
    owner: 'Emily Rodriguez'
  },
  {
    id: 'milestone-4',
    name: 'Beta Testing Complete',
    dueDate: '2026-04-22',
    status: 'upcoming',
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 15,
    owner: 'Amanda Wilson'
  },
  {
    id: 'milestone-5',
    name: 'Production Launch',
    dueDate: '2026-04-30',
    status: 'upcoming',
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 8,
    owner: 'Christopher Lee'
  }];


  const tabs = [
  { id: 'list', label: 'List View', icon: 'TableCellsIcon' },
  { id: 'resources', label: 'Resource Management', icon: 'UsersIcon' },
  { id: 'milestones', label: 'Milestone Tracking', icon: 'FlagIcon' }];

  const handleExportSubmit = (format: string) => {
    console.log(`Exporting report in ${format} format`);
    // Simulate export process
    setIsExportModalOpen(false);
    // Show success notification (optional)
  };

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings);
    setIsSettingsModalOpen(false);
    // Show success notification (optional)
  };

  const handleReportGenerate = (reportType: string) => {
    console.log(`Generating ${reportType} report`);
    setIsReportModalOpen(false);
    // Show success notification (optional)
  };

  const handleMeetingSchedule = (meetingData: any) => {
    console.log('Meeting scheduled:', meetingData);
    setIsMeetingModalOpen(false);
    // Show success notification (optional)
  };


  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed} />


      <div
        className={`transition-smooth ${
        isSidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`
        }>

        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-6">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Project Overview</h1>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                Comprehensive project tracking with AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsProjectPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                <Icon name="PlusIcon" size={18} variant="outline" />
                <span className="font-caption text-sm font-medium">Add Task</span>
              </button>
              <button 
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
              >
                <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
                <span className="font-caption text-sm">Export Report</span>
              </button>
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
              >
                <Icon name="Cog6ToothIcon" size={18} variant="outline" />
                <span className="font-caption text-sm">Settings</span>
              </button>
              <div className="h-8 w-px bg-border" />
              <ThemeToggle isCollapsed={false} />
              <UserRoleIndicator
                currentRole={currentRole}
                userName="Alex Morgan"
                isCollapsed={false}
                onRoleChange={setCurrentRole} />

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Project Health Dashboard */}
          <div className="mb-6">
            <ProjectHealthDashboard
              projectName="NextGenTaskManager - Phase 1 MVP"
              overallHealth={78}
              metrics={mockHealthMetrics} />

          </div>

          {/* Tabbed Content */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border bg-muted/30">
              {tabs.map((tab) =>
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-smooth ${
                activeTab === tab.id ?
                'bg-primary text-primary-foreground' :
                'text-muted-foreground hover:text-foreground hover:bg-muted'}`
                }>

                  <Icon name={tab.icon as any} size={18} variant="outline" />
                  <span className="font-caption text-sm font-medium">{tab.label}</span>
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'list' &&
              <ProjectListView />
              }
              {activeTab === 'resources' &&
              <ResourceAllocation teamMembers={mockTeamMembers} />
              }
              {activeTab === 'milestones' &&
              <MilestoneTracker milestones={mockMilestones} />
              }
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="DocumentChartBarIcon" size={24} variant="outline" className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">Generate Report</h4>
                <p className="font-caption text-xs text-muted-foreground">Create detailed project report</p>
              </div>
              <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-muted-foreground" />
            </button>

            <button 
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="CalendarDaysIcon" size={24} variant="outline" className="text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">Schedule Meeting</h4>
                <p className="font-caption text-xs text-muted-foreground">Coordinate with team members</p>
              </div>
              <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-muted-foreground" />
            </button>

            <button 
              onClick={() => setIsAlertsModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="BellAlertIcon" size={24} variant="outline" className="text-warning" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">View Alerts</h4>
                <p className="font-caption text-xs text-muted-foreground">Check critical notifications</p>
              </div>
              <Icon name="ChevronRightIcon" size={20} variant="outline" className="text-muted-foreground" />
            </button>
          </div>
        </main>
      </div>

      {/* Project Creation Panel */}
      <ProjectCreationPanel
        isOpen={isProjectPanelOpen}
        onClose={() => setIsProjectPanelOpen(false)}
        onSubmit={(projectData) => {
          setProjects(prev => [...prev, projectData]);
          setIsProjectPanelOpen(false);
          // Show success notification (optional)
          console.log('Project created:', projectData);
        }}
      />

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Export Report</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Select the format for your project report</p>
            <div className="space-y-3">
              <button
                onClick={() => handleExportSubmit('pdf')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="DocumentTextIcon" size={24} variant="outline" className="text-primary" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">PDF Document</p>
                  <p className="font-caption text-xs text-muted-foreground">Portable document format</p>
                </div>
              </button>
              <button
                onClick={() => handleExportSubmit('excel')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="TableCellsIcon" size={24} variant="outline" className="text-accent" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">Excel Spreadsheet</p>
                  <p className="font-caption text-xs text-muted-foreground">Data analysis format</p>
                </div>
              </button>
              <button
                onClick={() => handleExportSubmit('csv')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="DocumentIcon" size={24} variant="outline" className="text-muted-foreground" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">CSV File</p>
                  <p className="font-caption text-xs text-muted-foreground">Comma-separated values</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Project Settings</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">Default View</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>List View</option>
                  <option>Resource Management</option>
                  <option>Milestone Tracking</option>
                </select>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">Notification Frequency</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>Real-time</option>
                  <option>Daily Digest</option>
                  <option>Weekly Summary</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-foreground">Show Critical Path</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-foreground">Auto-save Changes</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSettingsSave({})}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Generate Report</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Choose the type of report to generate</p>
            <div className="space-y-3">
              <button
                onClick={() => handleReportGenerate('Progress Summary')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="ChartBarIcon" size={24} variant="outline" className="text-primary" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">Progress Summary</p>
                  <p className="font-caption text-xs text-muted-foreground">Overall project progress</p>
                </div>
              </button>
              <button
                onClick={() => handleReportGenerate('Resource Utilization')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="UsersIcon" size={24} variant="outline" className="text-accent" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">Resource Utilization</p>
                  <p className="font-caption text-xs text-muted-foreground">Team allocation analysis</p>
                </div>
              </button>
              <button
                onClick={() => handleReportGenerate('Budget Analysis')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="CurrencyDollarIcon" size={24} variant="outline" className="text-warning" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">Budget Analysis</p>
                  <p className="font-caption text-xs text-muted-foreground">Financial overview</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Schedule Meeting</h3>
              <button onClick={() => setIsMeetingModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g., Sprint Planning Meeting"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-caption text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-caption text-sm font-medium text-foreground mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">Duration</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">Participants</label>
                <input
                  type="text"
                  placeholder="Select team members..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsMeetingModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMeetingSchedule({})}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Alerts Modal */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Project Alerts</h3>
              <button onClick={() => setIsAlertsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 border border-warning/30 bg-warning/5 rounded-lg">
                <Icon name="ExclamationTriangleIcon" size={20} variant="outline" className="text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">Budget Threshold Warning</p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">Project has utilized 68% of allocated budget. Consider reviewing expenses.</p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                <Icon name="XCircleIcon" size={20} variant="outline" className="text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">Critical Path Delay</p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">Task "Frontend Development" is behind schedule and may impact project timeline.</p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-accent/30 bg-accent/5 rounded-lg">
                <Icon name="InformationCircleIcon" size={20} variant="outline" className="text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">Milestone Approaching</p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">"Design Phase Completion" milestone is due in 3 days. Current progress: 75%</p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-primary/30 bg-primary/5 rounded-lg">
                <Icon name="CheckCircleIcon" size={20} variant="outline" className="text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">Resource Availability</p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">David Kim has 40% capacity available for new task assignments.</p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">2 days ago</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>);

};

export default ProjectOverviewInteractive;
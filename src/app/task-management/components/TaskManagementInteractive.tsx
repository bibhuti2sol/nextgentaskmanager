'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import ViewModeToggle from './ViewModeToggle';
import FilterToolbar, { FilterState } from './FilterToolbar';
import TaskListView from './TaskListView';
import EditTaskModal from './EditTaskModal';
import TaskKanbanView from './TaskKanbanView';
import TaskFocusView from './TaskFocusView';
import TaskCreationPanel from './TaskCreationPanel';

interface Task {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
    alt: string;
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number;
  project: string;
  subtasks: number;
  completedSubtasks: number;
  description: string;
  timeTracked: string;
  estimatedTime: string;
  subtaskList?: { id: string; title: string; status: 'To Do' | 'In Progress' | 'Review' | 'Completed' }[];
  comments: string; // Added property
}

const TaskManagementInteractive = () => {
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const handleExport = (type: 'csv' | 'pdf' | 'xlsx') => {
      setShowExportDropdown(false);
      // TODO: Implement export logic for filteredTasks
      alert(`Exporting ${filteredTasks.length} tasks as ${type.toUpperCase()}`);
    };
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'focus'>('list');
  const [currentRole, setCurrentRole] = useState<'Admin' | 'Manager' | 'Associate'>('Manager');
  const [isCreationPanelOpen, setIsCreationPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    assignee: [],
    project: [],
    status: [],
    dateRange: null
  });

  const [tasks, setTasks] = useState<Task[]>([
  {
    id: '1',
    title: 'Implement user authentication system',
    assignee: {
      name: 'Sarah Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18a713e78-1763297858426.png",
      alt: 'Professional headshot of Asian woman with long black hair in white blouse'
    },
    priority: 'High',
    status: 'In Progress',
    startDate: '01/15/2026',
    endDate: '01/30/2026',
    progress: 65,
    project: 'Website Redesign',
    subtasks: 5,
    completedSubtasks: 3,
    description: 'Design and implement a secure authentication system with JWT tokens, password hashing, and multi-factor authentication support. Ensure compliance with security best practices and OWASP guidelines.',
    timeTracked: '12h 30m',
    estimatedTime: '20h 00m',
    comments: 'Initial implementation of JWT authentication completed.',
    subtaskList: [
      { id: '1-1', title: 'Set up JWT authentication', status: 'Completed' },
      { id: '1-2', title: 'Implement password hashing', status: 'In Progress' },
      { id: '1-3', title: 'Add multi-factor authentication', status: 'To Do' },
      { id: '1-4', title: 'Security review', status: 'To Do' },
      { id: '1-5', title: 'Write documentation', status: 'Review' }
    ]
  },
  {
    id: '2',
    title: 'Design mobile app wireframes',
    assignee: {
      name: 'Michael Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19ad99abc-1763299907968.png",
      alt: 'Professional portrait of Hispanic man with short brown hair in navy blazer'
    },
    priority: 'Medium',
    status: 'Review',
    startDate: '01/20/2026',
    endDate: '02/05/2026',
    progress: 90,
    project: 'Mobile App',
    subtasks: 8,
    completedSubtasks: 7,
    description: 'Create comprehensive wireframes for all major screens in the mobile application, including user flows, navigation patterns, and interaction designs.',
    timeTracked: '18h 15m',
    estimatedTime: '20h 00m',
    comments: 'Wireframes for home and profile screens approved.',
    subtaskList: [
      { id: '2-1', title: 'Home screen wireframe', status: 'Completed' },
      { id: '2-2', title: 'Profile screen wireframe', status: 'Completed' },
      { id: '2-3', title: 'Settings screen wireframe', status: 'Review' },
      { id: '2-4', title: 'Navigation flow', status: 'In Progress' }
    ]
  },
  {
    id: '3',
    title: 'API endpoint documentation',
    assignee: {
      name: 'Emily Watson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1158c42da-1763295926268.png",
      alt: 'Professional headshot of Caucasian woman with blonde hair in gray business suit'
    },
    priority: 'Low',
    status: 'To Do',
    startDate: '02/01/2026',
    endDate: '02/10/2026',
    progress: 0,
    project: 'API Integration',
    subtasks: 3,
    completedSubtasks: 0,
    description: 'Document all REST API endpoints with request/response examples, authentication requirements, and error handling specifications.',
    timeTracked: '0h 00m',
    estimatedTime: '8h 00m',
    comments: 'Pending completion of API development.',
  },
  {
    id: '4',
    title: 'Database schema optimization',
    assignee: {
      name: 'David Kim',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1f09ffa-1763296911571.png",
      alt: 'Professional portrait of Asian man with black hair in dark blue shirt'
    },
    priority: 'High',
    status: 'In Progress',
    startDate: '01/18/2026',
    endDate: '01/28/2026',
    progress: 45,
    project: 'Website Redesign',
    subtasks: 6,
    completedSubtasks: 2,
    description: 'Analyze and optimize database queries, add proper indexes, and restructure tables for improved performance and scalability.',
    timeTracked: '9h 45m',
    estimatedTime: '16h 00m',
    comments: 'Indexing of user table improved query performance by 30%.',
  },
  {
    id: '5',
    title: 'Social media campaign assets',
    assignee: {
      name: 'Sarah Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18a713e78-1763297858426.png",
      alt: 'Professional headshot of Asian woman with long black hair in white blouse'
    },
    priority: 'Medium',
    status: 'Completed',
    startDate: '01/10/2026',
    endDate: '01/25/2026',
    progress: 100,
    project: 'Marketing Campaign',
    subtasks: 4,
    completedSubtasks: 4,
    description: 'Create engaging visual assets for social media platforms including Instagram, Facebook, and LinkedIn with brand-consistent designs.',
    timeTracked: '12h 00m',
    estimatedTime: '12h 00m',
    comments: 'All assets delivered and approved by the marketing team.',
  },
  {
    id: '6',
    title: 'User testing session preparation',
    assignee: {
      name: 'Michael Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19ad99abc-1763299907968.png",
      alt: 'Professional portrait of Hispanic man with short brown hair in navy blazer'
    },
    priority: 'High',
    status: 'To Do',
    startDate: '01/25/2026',
    endDate: '02/01/2026',
    progress: 0,
    project: 'Mobile App',
    subtasks: 7,
    completedSubtasks: 0,
    description: 'Prepare test scenarios, recruit participants, and set up testing environment for comprehensive user experience evaluation.',
    timeTracked: '0h 00m',
    estimatedTime: '10h 00m',
    comments: 'Need to finalize test scenarios and recruit participants.',
  }]
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const handleTaskClick = (taskId: string) => {
    // Optionally: open details, not edit
  };
  const handleEditTask = (taskId: string) => {
    setEditTaskId(taskId);
  };
  const handleSaveTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    setEditTaskId(null);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  const handleTaskCreate = (newTask: any) => {
    console.log('New task created:', newTask);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesAssignee = filters.assignee.length === 0 || filters.assignee.includes(task.assignee.name);
    const matchesProject = filters.project.length === 0 || filters.project.includes(task.project);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);

    return matchesSearch && matchesPriority && matchesAssignee && matchesProject && matchesStatus;
  });

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed} />


      <div
        className={`transition-smooth ${
        isSidebarCollapsed ? 'ml-[60px]' : 'ml-[240px]'}`
        }>

        <header className="sticky top-0 z-[999] bg-card border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="font-heading text-2xl font-semibold text-foreground">Task Management</h1>
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Icon
                    name="MagnifyingGlassIcon"
                    size={18}
                    variant="outline"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreationPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth">
                <Icon name="PlusIcon" size={18} variant="outline" />
                <span className="hidden sm:inline">New Task</span>
              </button>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-caption font-medium text-sm hover:bg-accent/90 transition-smooth"
                  onClick={() => setShowExportDropdown((prev) => !prev)}
                >
                  <Icon name="DocumentArrowDownIcon" size={18} variant="outline" />
                  <span className="hidden sm:inline">Export Report</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded shadow-lg z-50">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted font-caption text-sm"
                      onClick={() => handleExport('csv')}
                    >
                      Download CSV
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted font-caption text-sm"
                      onClick={() => handleExport('pdf')}
                    >
                      Download PDF
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-muted font-caption text-sm"
                      onClick={() => handleExport('xlsx')}
                    >
                      Download XLSX
                    </button>
                  </div>
                )}
              </div>
              <div className="hidden lg:block">
                <ThemeToggle isCollapsed={false} />
              </div>
              <div className="hidden lg:block">
                <UserRoleIndicator isCollapsed={false} onRoleChange={setCurrentRole} />
              </div>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ViewModeToggle currentView={currentView} onViewChange={setCurrentView} />

              <div className="flex items-center gap-3">
                <span className="font-caption text-sm text-muted-foreground">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-md font-caption text-xs font-medium hover:bg-muted/80 transition-smooth">
                  <Icon name="ArrowsUpDownIcon" size={14} variant="outline" />
                  Sort
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-md font-caption text-xs font-medium hover:bg-muted/80 transition-smooth">
                  <Icon name="AdjustmentsHorizontalIcon" size={14} variant="outline" />
                  Group
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <FilterToolbar onFilterChange={setFilters} />

          {currentView === 'list' &&
          <TaskListView
            tasks={filteredTasks.map((task) => ({
              ...task,
              assignee: task.assignee.name, // Convert `assignee` object to `name` string
              subtaskList: task.subtaskList?.map((subtask) => ({
                ...subtask,
                assignee: '', // Default value for `assignee`
                startDate: '', // Default value for `startDate`
                endDate: '', // Default value for `endDate`
              })),
            }))}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange}
            onEditTask={handleEditTask}
          />

          }

          {currentView === 'kanban' &&
          <TaskKanbanView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onStatusChange={handleStatusChange} />

          }

          {currentView === 'focus' &&
          <TaskFocusView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          }
        </main>
      </div>


      <TaskCreationPanel
        isOpen={isCreationPanelOpen}
        onClose={() => setIsCreationPanelOpen(false)}
        onTaskCreate={handleTaskCreate} />

      {editTaskId && (
        <EditTaskModal
          task={{
            ...tasks.find((t) => t.id === editTaskId)!,
            assignee: tasks.find((t) => t.id === editTaskId)?.assignee.name || '', // Convert `assignee` object to `name` string
          }}
          onSave={handleSaveTask}
          onClose={() => setEditTaskId(null)}
        />
      )}

    </div>);

};

export default TaskManagementInteractive;
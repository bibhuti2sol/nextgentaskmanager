'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
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
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    assignee: [],
    project: [],
    status: [],
    dateRange: null
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesAssignee = filters.assignee.length === 0 || filters.assignee.includes(task.assignee.name);
    const matchesProject = filters.project.length === 0 || filters.project.includes(task.project);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);

    return matchesSearch && matchesPriority && matchesAssignee && matchesProject && matchesStatus;
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const priorityMap: Record<string, string> = {
        'High': 'HIGH',
        'Medium': 'MEDIUM',
        'Low': 'LOW'
      };

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        'Review': 'REVIEW',
        'Completed': 'DONE'
      };

      const params = new URLSearchParams({
        search: searchQuery,
        page: '0',
        size: '100',
        sort: 'id,desc'
      });

      if (filters.priority.length > 0) {
        params.append('priority', priorityMap[filters.priority[0]] || '');
      }
      if (filters.status.length > 0) {
        params.append('status', statusMap[filters.status[0]] || '');
      }
      // Note: projectId and assigneeId can be added here if available in FilterState

      const baseUrl = 'http://43.205.137.114:8080/api/v1/tasks';
      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });

      const data = response.data.content || response.data.data || [];

      const mappedTasks: Task[] = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        assignee: {
          name: item.assigneeName || 'Unassigned',
          avatar: "https://via.placeholder.com/150",
          alt: item.assigneeName || 'Unassigned'
        },
        priority: (item.priority?.charAt(0) + item.priority?.slice(1).toLowerCase()) as any || 'Medium',
        status: item.status === 'TODO' ? 'To Do'
          : item.status === 'IN_PROGRESS' ? 'In Progress'
            : item.status === 'REVIEW' ? 'Review'
              : 'Completed',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        progress: item.progressPercentage || 0,
        project: item.projectName || 'General',
        subtasks: item.subTasks?.length || 0,
        completedSubtasks: item.subTasks?.filter((st: any) => st.status === 'DONE').length || 0,
        description: item.description || '',
        timeTracked: '0h', // Not in API yet
        estimatedTime: '0h', // Not in API yet
        comments: '', // Summary of comments if needed
        subtaskList: item.subTasks?.map((st: any) => ({
          id: st.id.toString(),
          title: st.name,
          status: st.status === 'TODO' ? 'To Do'
            : st.status === 'IN_PROGRESS' ? 'In Progress'
              : st.status === 'REVIEW' ? 'Review'
                : 'Completed',
        })) || []
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchTasks();
    setIsHydrated(true);
  }, [fetchTasks]);


  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const handleTaskClick = (taskId: string) => {
    // Optionally: open details, not edit
  };
  const handleEditTask = (taskId: string) => {
    setEditTaskId(taskId);
  };
  const handleSaveTask = (updatedTask: Task) => {
    // Optimistic update
    setTasks(tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
    setEditTaskId(null);
    // Persist from backend
    fetchTasks();
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, status: newStatus } : task));
  };

  const handleTaskCreate = (newTask: any) => {
    console.log('New task created:', newTask);
    fetchTasks();
  };

  if (!isHydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-caption animate-pulse">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircleIcon" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Failed to load tasks</h2>
          <p className="text-muted-foreground font-caption text-sm mb-6">{error}</p>
          <button
            onClick={() => fetchTasks()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div
        className={`transition-smooth min-h-screen ${isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'} 
        ml-0`}
      >

        <header className="sticky top-0 z-[50] bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-foreground truncate">Task Management</h1>
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
              tasks={filteredTasks}
              onTaskClick={handleTaskClick}
              onStatusChange={handleStatusChange}
              onEditTask={handleEditTask}
              onTaskUpdate={handleSaveTask}
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
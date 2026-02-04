'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

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
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskListView = ({ tasks, onTaskClick, onStatusChange, onEditTask }: TaskListViewProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleSort = (column: keyof Task) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10';
      case 'Medium':
        return 'text-warning bg-warning/10';
      case 'Low':
        return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'To Do':
        return 'text-muted-foreground bg-muted';
      case 'In Progress':
        return 'text-primary bg-primary/10';
      case 'Review':
        return 'text-warning bg-warning/10';
      case 'Completed':
        return 'text-success bg-success/10';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {selectedTasks.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
          <span className="font-caption text-sm text-foreground">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="ArrowPathIcon" size={14} variant="outline" />
              Change Status
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="UserGroupIcon" size={14} variant="outline" />
              Reassign
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth">
              <Icon name="TrashIcon" size={14} variant="outline" />
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Task Title
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assignee')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Assignee
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Priority
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Status
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Start Date
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('endDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  End Date
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Overdue Tasks</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Progress</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const today = new Date();
              const endDate = new Date(task.endDate);
              const isOverdue = endDate < today && task.status !== 'Completed';
              return (
                <tr
                  key={task.id}
                  className="border-b border-border hover:bg-muted/30 transition-smooth cursor-pointer"
                  onClick={() => onTaskClick(task.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => handleSelectTask(task.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-caption font-medium text-sm text-foreground">{task.title}</p>
                      <p className="font-caption text-xs text-muted-foreground mt-0.5">
                        {task.project} • {task.completedSubtasks}/{task.subtasks} subtasks
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <AppImage
                          src={task.assignee.avatar}
                          alt={task.assignee.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-caption text-sm text-foreground">{task.assignee.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-caption font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-caption text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(task.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(task.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    {isOverdue ? <span className="font-caption text-xs text-error font-bold">Overdue</span> : <span className="font-caption text-xs text-muted-foreground">-</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-caption text-sm font-medium text-foreground">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {/* ...existing actions cell... */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskListView;
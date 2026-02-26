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

interface TaskKanbanViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskKanbanView = ({ tasks, onTaskClick, onStatusChange }: TaskKanbanViewProps) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const columns: Array<{ id: Task['status']; label: string; color: string }> = [
    { id: 'To Do', label: 'To Do', color: 'bg-muted' },
    { id: 'In Progress', label: 'In Progress', color: 'bg-primary/10' },
    { id: 'Review', label: 'Review', color: 'bg-warning/10' },
    { id: 'Completed', label: 'Completed', color: 'bg-success/10' },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'border-l-error';
      case 'Medium':
        return 'border-l-warning';
      case 'Low':
        return 'border-l-success';
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      onStatusChange(draggedTask, status);
      setDraggedTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div
            key={column.id}
            className="flex flex-col bg-card border border-border rounded-lg overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className={`px-4 py-3 ${column.color} border-b border-border`}>
              <div className="flex items-center justify-between">
                <h3 className="font-caption font-semibold text-sm text-foreground">
                  {column.label}
                </h3>
                <span className="bg-background text-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)]">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  onClick={() => onTaskClick(task.id)}
                  className={`bg-background border-l-4 ${getPriorityColor(task.priority)} border-r border-t border-b border-border rounded-lg p-3 cursor-move hover:shadow-elevation-2 transition-smooth ${
                    draggedTask === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-caption font-medium text-sm text-foreground flex-1 pr-2">
                      {task.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                      aria-label="Task options"
                    >
                      <Icon name="EllipsisVerticalIcon" size={16} variant="outline" />
                    </button>
                  </div>

                  <p className="font-caption text-xs text-muted-foreground mb-3">
                    {task.project}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CheckCircleIcon" size={14} variant="outline" className="text-muted-foreground" />
                    <span className="font-caption text-xs text-muted-foreground">
                      {task.completedSubtasks}/{task.subtasks} subtasks
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="CalendarIcon" size={14} variant="outline" className="text-muted-foreground" />
                    <span className="font-caption text-xs text-muted-foreground">
                      {task.endDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                        <AppImage
                          src={task.assignee.avatar}
                          alt={task.assignee.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-caption text-xs text-foreground">
                        {task.assignee.name.split(' ')[0]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-smooth"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="font-caption text-xs text-muted-foreground">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon name="InboxIcon" size={32} variant="outline" className="text-muted-foreground mb-2" />
                  <p className="font-caption text-sm text-muted-foreground">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskKanbanView;
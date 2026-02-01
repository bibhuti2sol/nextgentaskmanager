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
  description: string;
  timeTracked: string;
  estimatedTime: string;
}

interface TaskFocusViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
}

const TaskFocusView = ({ tasks, onTaskClick }: TaskFocusViewProps) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setIsTimerRunning(false);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setIsTimerRunning(false);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10 border-error/20';
      case 'Medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Low':
        return 'text-success bg-success/10 border-success/20';
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

  if (!currentTask) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Icon name="InboxIcon" size={64} variant="outline" className="text-muted-foreground mb-4" />
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">No tasks to focus on</h3>
        <p className="font-caption text-sm text-muted-foreground">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="font-caption text-sm text-muted-foreground">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousTask}
                disabled={currentTaskIndex === 0}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous task"
              >
                <Icon name="ChevronLeftIcon" size={20} variant="outline" />
              </button>
              <button
                onClick={handleNextTask}
                disabled={currentTaskIndex === tasks.length - 1}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next task"
              >
                <Icon name="ChevronRightIcon" size={20} variant="outline" />
              </button>
            </div>
          </div>

          <button
            onClick={() => onTaskClick(currentTask.id)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
          >
            <Icon name="ArrowTopRightOnSquareIcon" size={16} variant="outline" />
            View Full Details
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-caption font-medium border ${getPriorityColor(currentTask.priority)}`}>
                  {currentTask.priority} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-caption font-medium ${getStatusColor(currentTask.status)}`}>
                  {currentTask.status}
                </span>
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                {currentTask.title}
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                {currentTask.project}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <AppImage
                  src={currentTask.assignee.avatar}
                  alt={currentTask.assignee.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-caption text-xs text-muted-foreground">Assigned to</p>
                <p className="font-caption font-medium text-sm text-foreground">
                  {currentTask.assignee.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-primary" />
              </div>
              <div>
                <p className="font-caption text-xs text-muted-foreground">Start Date</p>
                <p className="font-caption font-medium text-sm text-foreground">
                  {currentTask.startDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-primary" />
              </div>
              <div>
                <p className="font-caption text-xs text-muted-foreground">End Date</p>
                <p className="font-caption font-medium text-sm text-foreground">
                  {currentTask.endDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Icon name="ChartBarIcon" size={20} variant="outline" className="text-success" />
              </div>
              <div>
                <p className="font-caption text-xs text-muted-foreground">Progress</p>
                <p className="font-caption font-medium text-sm text-foreground">
                  {currentTask.progress}% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-caption font-semibold text-sm text-foreground mb-3">Description</h3>
            <p className="font-caption text-sm text-muted-foreground leading-relaxed">
              {currentTask.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-caption font-semibold text-sm text-foreground">
                Subtasks ({currentTask.completedSubtasks}/{currentTask.subtasks})
              </h3>
              <button className="flex items-center gap-2 text-xs font-caption font-medium text-primary hover:text-primary/80 transition-smooth">
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Subtask
              </button>
            </div>
            <div className="space-y-2">
              {Array.from({ length: currentTask.subtasks }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <input
                    type="checkbox"
                    checked={index < currentTask.completedSubtasks}
                    readOnly
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className={`font-caption text-sm flex-1 ${index < currentTask.completedSubtasks ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    Subtask {index + 1}: Complete implementation phase
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-caption font-semibold text-sm text-foreground mb-4">Time Tracking</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-caption text-xs text-muted-foreground mb-1">Time Tracked</p>
                  <p className="font-data text-2xl font-semibold text-foreground">
                    {currentTask.timeTracked}
                  </p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <p className="font-caption text-xs text-muted-foreground mb-1">Estimated</p>
                  <p className="font-data text-2xl font-semibold text-muted-foreground">
                    {currentTask.estimatedTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-caption font-medium text-sm transition-smooth ${
                  isTimerRunning
                    ? 'bg-error text-error-foreground hover:bg-error/90'
                    : 'bg-success text-success-foreground hover:bg-success/90'
                }`}
              >
                <Icon
                  name={isTimerRunning ? 'PauseIcon' : 'PlayIcon'}
                  size={20}
                  variant="solid"
                />
                {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
              </button>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-smooth"
                style={{ width: `${currentTask.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFocusView;
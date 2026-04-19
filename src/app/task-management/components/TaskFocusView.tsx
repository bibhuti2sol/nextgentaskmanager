'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import EditSubtask from './EditSubtask';

interface Subtask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee?: string;
  assigneeId?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
}

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
  subtaskList?: Subtask[];
}

interface TaskFocusViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onSubtaskToggle: (taskId: string, subtaskId: string, completed: boolean) => void;
  onSubtaskDelete?: (taskId: string, subtaskId: string) => void;
}

const TaskFocusView = ({ tasks, onTaskClick, onAddSubtask, onSubtaskToggle, onSubtaskDelete }: TaskFocusViewProps) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const currentTask = tasks[currentTaskIndex];

  const handleNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setIsTimerRunning(false);
      setIsAddingSubtask(false);
    }
  };

  const handlePreviousTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
      setIsTimerRunning(false);
      setIsAddingSubtask(false);
    }
  };

  const handleAddSubtaskSubmit = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask(currentTask.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (onSubtaskDelete) {
      onSubtaskDelete(currentTask.id, subtaskId);
    }
  };

  const handleSubtaskCreated = (newSubtask: Subtask) => {
    // Optimistically add just the visual since EditSubtask already made the API call
    if (currentTask.subtaskList) {
      currentTask.subtaskList.push(newSubtask);
      currentTask.subtasks += 1;
    }
    setIsAddingSubtask(false);
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
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-1">
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
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-primary/90 transition-smooth shadow-sm"
          >
            <Icon name="ArrowTopRightOnSquareIcon" size={16} variant="outline" />
            View Full Details
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(currentTask.priority)}`}>
                  {currentTask.priority} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(currentTask.status)}`}>
                  {currentTask.status}
                </span>
              </div>
              <h2 className="font-heading text-2xl font-black text-foreground mb-2">
                {currentTask.title}
              </h2>
              <p className="font-caption text-sm text-muted-foreground">
                {currentTask.project}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div>
                <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned to</p>
                <p className="font-caption font-black text-sm text-foreground">
                  {currentTask.assignee.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-primary" />
              </div>
              <div>
                <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Start Date</p>
                <p className="font-caption font-black text-sm text-foreground">
                  {currentTask.startDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="CalendarIcon" size={20} variant="outline" className="text-primary" />
              </div>
              <div>
                <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider">End Date</p>
                <p className="font-caption font-black text-sm text-foreground">
                  {currentTask.endDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Icon name="ChartBarIcon" size={20} variant="outline" className="text-success" />
              </div>
              <div>
                <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</p>
                <p className="font-caption font-black text-sm text-foreground">
                  {currentTask.progress}% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-caption font-bold text-xs text-muted-foreground uppercase tracking-widest mb-3">Description</h3>
            <p className="font-caption text-sm text-foreground leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/50">
              {currentTask.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-caption font-bold text-xs text-muted-foreground uppercase tracking-widest">
                Subtasks ({currentTask.completedSubtasks}/{currentTask.subtasks})
              </h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    if (currentTask.subtasks === 0) {
                      alert('No subtasks to delete.');
                      return;
                    }
                    if (confirm(`Are you sure you want to delete all subtasks? This action cannot be undone.`)) {
                      currentTask.subtaskList?.forEach(st => {
                        handleDeleteSubtask(st.id);
                      });
                    }
                  }}
                  disabled={currentTask.subtasks === 0}
                  className="flex items-center gap-2 text-xs font-bold text-error hover:text-error/80 transition-smooth group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-6 h-6 rounded-full bg-error/10 flex items-center justify-center group-hover:bg-error group-hover:text-white transition-smooth">
                     <Icon name="TrashIcon" size={14} variant="outline" />
                  </div>
                  Delete Subtask
                </button>
                <button 
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-smooth group"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-smooth">
                     <Icon name="PlusIcon" size={14} variant="outline" />
                  </div>
                  Add Subtask
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {currentTask.subtaskList && currentTask.subtaskList.length > 0 ? (
                currentTask.subtaskList.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth border border-border/50 group"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.status === 'Completed'}
                      onChange={(e) => onSubtaskToggle(currentTask.id, subtask.id, e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                    <span className={`font-caption text-sm flex-1 ${subtask.status === 'Completed' ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                      {subtask.title}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(subtask.status)}`}>
                       {subtask.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteSubtask(subtask.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-error hover:bg-error/10 transition-all"
                      title="Delete subtask"
                    >
                      <Icon name="TrashIcon" size={14} variant="outline" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-muted/10 rounded-xl border border-dashed border-border">
                   <p className="text-xs text-muted-foreground font-caption">No subtasks found for this task.</p>
                </div>
              )}

              {isAddingSubtask && (
                <EditSubtask
                  taskId={currentTask.id}
                  subtask={{ id: '', title: '', status: 'To Do', description: '', assignee: '', assigneeId: undefined, startDate: '', endDate: '' }}
                  onSave={handleSubtaskCreated}
                  onClose={() => setIsAddingSubtask(false)}
                />
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-caption font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">Time Tracking</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Time Tracked</p>
                  <p className="font-data text-2xl font-black text-foreground">
                    {currentTask.timeTracked}
                  </p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="font-caption text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Estimated</p>
                  <p className="font-data text-2xl font-bold text-muted-foreground">
                    {currentTask.estimatedTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-caption font-black text-sm transition-smooth shadow-lg hover:scale-[1.02] active:scale-95 ${
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

            <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-smooth"
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
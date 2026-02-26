'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TaskCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate: (task: any) => void;
}

const TaskCreationPanel = ({ isOpen, onClose, onTaskCreate }: TaskCreationPanelProps) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
    project: '',
    startDate: '',
    endDate: '',
    isRecurring: false,
    recurringPattern: 'daily',
  });

  const [subtasks, setSubtasks] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTaskCreate({
      ...taskData,
      subtasks: subtasks.filter((s) => s.trim() !== ''),
    });
    onClose();
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[2000] transition-smooth"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-card border-l border-border z-[2001] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">Create New Task</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="Close panel"
            >
              <Icon name="XMarkIcon" size={24} variant="outline" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Description
            </label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe the task in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Priority *
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Assignee *
              </label>
              <select
                value={taskData.assignee}
                onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select assignee</option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Michael Rodriguez">Michael Rodriguez</option>
                <option value="Emily Watson">Emily Watson</option>
                <option value="David Kim">David Kim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                Project *
              </label>
              <select
                value={taskData.project}
                onChange={(e) => setTaskData({ ...taskData, project: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select project</option>
                <option value="Website Redesign">Website Redesign</option>
                <option value="Mobile App">Mobile App</option>
                <option value="API Integration">API Integration</option>
                <option value="Marketing Campaign">Marketing Campaign</option>
              </select>
            </div>

            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={taskData.endDate}
                onChange={(e) => setTaskData({ ...taskData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-caption font-medium text-sm text-foreground mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={taskData.startDate}
              onChange={(e) => setTaskData({ ...taskData, startDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block font-caption font-medium text-sm text-foreground">
                Subtasks
              </label>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="flex items-center gap-2 text-xs font-caption font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                <Icon name="PlusIcon" size={14} variant="outline" />
                Add Subtask
              </button>
            </div>
            <div className="space-y-2">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subtask}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Subtask ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="p-2 rounded-md text-error hover:bg-error/10 transition-smooth"
                    aria-label="Remove subtask"
                  >
                    <Icon name="TrashIcon" size={18} variant="outline" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="recurring"
              checked={taskData.isRecurring}
              onChange={(e) => setTaskData({ ...taskData, isRecurring: e.target.checked })}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="recurring" className="flex-1 font-caption text-sm text-foreground cursor-pointer">
              Make this a recurring task
            </label>
            {taskData.isRecurring && (
              <select
                value={taskData.recurringPattern}
                onChange={(e) => setTaskData({ ...taskData, recurringPattern: e.target.value })}
                className="px-3 py-1.5 bg-background border border-border rounded-md font-caption text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-caption font-medium text-sm hover:bg-muted/80 transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TaskCreationPanel;
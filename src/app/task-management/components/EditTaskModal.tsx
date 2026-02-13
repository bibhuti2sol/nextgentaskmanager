import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface EditTaskModalProps {
  task: {
    id: string;
    title: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
    startDate: string;
    endDate: string;
    progress: number;
    project: string;
    description: string;
    comments: string;
  };
  onSave: (updated: any) => void;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({ ...task });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40">
      <form className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="font-heading text-xl font-bold mb-4">Edit Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <input name="assignee" value={form.assignee} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input name="startDate" value={form.startDate} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input name="endDate" value={form.endDate} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Progress (%)</label>
            <input name="progress" type="number" min="0" max="100" value={form.progress} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <input name="project" value={form.project} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea name="comments" value={form.comments} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-muted text-foreground">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;

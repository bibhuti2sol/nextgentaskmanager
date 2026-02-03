"use client";
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    status: 'active' | 'on-hold' | 'completed' | 'at-risk';
    progress: number;
    startDate: string;
    endDate: string;
    owner: string;
    budget: string;
    team: number;
    priority: 'High' | 'Medium' | 'Low';
    projectType?: 'normal' | 'budget';
  };
  onSave: (updatedProject: EditProjectModalProps['project']) => void;
  onClose: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState({
    ...project,
    projectType: project.projectType || 'normal',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'team' || name === 'progress' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40">
      <form className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="font-heading text-xl font-bold mb-4">Edit Project</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border">
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="at-risk">At Risk</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Progress (%)</label>
            <input name="progress" type="number" min="0" max="100" value={form.progress} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
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
            <label className="block text-sm font-medium mb-1">Owner</label>
            <input name="owner" value={form.owner} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Type</label>
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border"
            >
              <option value="normal">Normal</option>
              <option value="budget">Budget</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Budget</label>
            <input name="budget" value={form.budget} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Team Size</label>
            <input name="team" type="number" min="1" value={form.team} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full px-3 py-2 rounded border border-border">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
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

export default EditProjectModal;

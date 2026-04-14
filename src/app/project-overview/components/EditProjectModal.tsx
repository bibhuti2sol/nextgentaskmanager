"use client";
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
    progress: number;
    startDate: string;
    endDate: string;
    owner: string;
    budget: string;
    team: number;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    projectType?: 'normal' | 'budget';
  };
  onSave: (updatedProject: EditProjectModalProps['project']) => void;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState({
    ...project,
    projectType: project.projectType || 'normal',
  });
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://43.205.137.114:8080/api/v1/teams/leads/eligible', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedUsers: User[] = (data || []).map((manager: any) => ({
        id: manager.id.toString(),
        name: manager.fullName,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback data for development purposes
      setUsers([
        { id: '1', name: 'Sarah Johnson' },
        { id: '2', name: 'Michael Chen' },
        { id: '3', name: 'Emily Rodriguez' },
        { id: '4', name: 'David Kim' },
        { id: '5', name: 'Jessica Taylor' },
        { id: '6', name: 'Amanda Wilson' },
      ]);
    }
  };

  useEffect(() => {
    setForm({
      ...project,
      projectType: project.projectType || 'normal',
    });
  }, [project]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'team' || name === 'progress' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.status}
              onChange={handleChange}
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
              Progress (%)
            </label>
            <input
              type="number"
              id="progress"
              name="progress"
              min="0"
              max="100"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.progress}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Project Manager
            </label>
            <select
              id="owner"
              name="owner"
              value={form.owner}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth border-border"
            >
              <option value="">Select Project Manager</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700">
              Project Type
            </label>
            <select
              id="projectType"
              name="projectType"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.projectType}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="budget">Budget</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.budget}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;

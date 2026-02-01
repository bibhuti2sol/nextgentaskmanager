'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProjectCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
}

export interface ProjectFormData {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  priority: 'High' | 'Medium' | 'Low';
  projectManager: string;
  teamMembers: string[];
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
}

const ProjectCreationPanel = ({ isOpen, onClose, onSubmit }: ProjectCreationPanelProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'Medium',
    projectManager: '',
    teamMembers: [],
    status: 'Planning'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!formData.projectManager.trim()) {
      newErrors.projectManager = 'Project manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      handleReset();
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      priority: 'Medium',
      projectManager: '',
      teamMembers: [],
      status: 'Planning'
    });
    setErrors({});
  };

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-card border-l border-border z-50 overflow-y-auto shadow-elevation-3">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-foreground">Create New Project</h2>
            <p className="font-caption text-sm text-muted-foreground mt-1">Fill in the details to create a new project</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
          >
            <Icon name="XMarkIcon" size={20} variant="outline" className="text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => handleChange('projectName', e.target.value)}
              className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                errors.projectName ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter project name"
            />
            {errors.projectName && (
              <p className="mt-1 font-caption text-xs text-destructive">{errors.projectName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                errors.description ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Describe the project objectives and scope"
            />
            {errors.description && (
              <p className="mt-1 font-caption text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-2">
                Start Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.startDate ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-2">
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.endDate ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Budget <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-caption text-sm">$</span>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className={`w-full pl-8 pr-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.budget ? 'border-destructive' : 'border-border'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.budget && (
              <p className="mt-1 font-caption text-xs text-destructive">{errors.budget}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Priority
            </label>
            <div className="flex gap-3">
              {(['High', 'Medium', 'Low'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => handleChange('priority', priority)}
                  className={`flex-1 px-4 py-2 rounded-md font-caption text-sm font-medium transition-smooth ${
                    formData.priority === priority
                      ? priority === 'High' ?'bg-destructive text-destructive-foreground'
                        : priority === 'Medium' ?'bg-warning text-warning-foreground' :'bg-success text-success-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Project Manager */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Project Manager <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.projectManager}
              onChange={(e) => handleChange('projectManager', e.target.value)}
              className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                errors.projectManager ? 'border-destructive' : 'border-border'
              }`}
            >
              <option value="">Select project manager</option>
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Michael Chen">Michael Chen</option>
              <option value="Emily Rodriguez">Emily Rodriguez</option>
              <option value="David Kim">David Kim</option>
              <option value="Jessica Taylor">Jessica Taylor</option>
            </select>
            {errors.projectManager && (
              <p className="mt-1 font-caption text-xs text-destructive">{errors.projectManager}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block font-caption text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as ProjectFormData['status'])}
              className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm font-medium text-foreground hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
            >
              <Icon name="PlusIcon" size={18} variant="outline" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProjectCreationPanel;
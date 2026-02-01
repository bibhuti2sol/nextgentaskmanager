'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Project {
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
}

interface ProjectListViewProps {
  projects?: Project[];
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectListView = ({ projects: propProjects, onEdit, onDelete }: ProjectListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'progress' | 'endDate'>('name');

  const defaultProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'NextGenTaskManager - Phase 1 MVP',
      status: 'active',
      progress: 78,
      startDate: '2026-01-15',
      endDate: '2026-04-30',
      owner: 'Sarah Johnson',
      budget: '$125,000',
      team: 8,
      priority: 'High'
    },
    {
      id: 'proj-2',
      name: 'Mobile App Development',
      status: 'active',
      progress: 45,
      startDate: '2026-02-01',
      endDate: '2026-06-15',
      owner: 'Michael Chen',
      budget: '$85,000',
      team: 5,
      priority: 'High'
    },
    {
      id: 'proj-3',
      name: 'API Integration Project',
      status: 'on-hold',
      progress: 30,
      startDate: '2026-01-20',
      endDate: '2026-05-10',
      owner: 'Emily Rodriguez',
      budget: '$45,000',
      team: 3,
      priority: 'Medium'
    },
    {
      id: 'proj-4',
      name: 'Database Migration',
      status: 'completed',
      progress: 100,
      startDate: '2025-12-01',
      endDate: '2026-01-31',
      owner: 'Jessica Taylor',
      budget: '$32,000',
      team: 4,
      priority: 'High'
    },
    {
      id: 'proj-5',
      name: 'UI/UX Redesign',
      status: 'at-risk',
      progress: 62,
      startDate: '2026-01-10',
      endDate: '2026-03-20',
      owner: 'David Kim',
      budget: '$58,000',
      team: 6,
      priority: 'Medium'
    },
    {
      id: 'proj-6',
      name: 'Security Audit & Enhancement',
      status: 'active',
      progress: 55,
      startDate: '2026-02-15',
      endDate: '2026-04-25',
      owner: 'Robert Martinez',
      budget: '$72,000',
      team: 4,
      priority: 'High'
    },
    {
      id: 'proj-7',
      name: 'Marketing Website Launch',
      status: 'completed',
      progress: 100,
      startDate: '2025-11-01',
      endDate: '2026-01-15',
      owner: 'Amanda Wilson',
      budget: '$28,000',
      team: 3,
      priority: 'Low'
    }
  ];

  const projects = propProjects || defaultProjects;

  const statusConfig = {
    active: { label: 'Active', color: 'bg-primary text-primary-foreground', icon: 'PlayIcon' },
    'on-hold': { label: 'On Hold', color: 'bg-warning text-warning-foreground', icon: 'PauseIcon' },
    completed: { label: 'Completed', color: 'bg-success text-success-foreground', icon: 'CheckCircleIcon' },
    'at-risk': { label: 'At Risk', color: 'bg-destructive text-destructive-foreground', icon: 'ExclamationTriangleIcon' }
  };

  const priorityConfig = {
    High: 'text-error',
    Medium: 'text-warning',
    Low: 'text-success'
  };

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'endDate') return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      return 0;
    });

  const handleEdit = (projectId: string) => {
    if (onEdit) {
      onEdit(projectId);
    } else {
      console.log('Edit project:', projectId);
    }
  };

  const handleDelete = (projectId: string) => {
    if (onDelete) {
      onDelete(projectId);
    } else {
      console.log('Delete project:', projectId);
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={18} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-[280px] bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="at-risk">At Risk</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="progress">Sort by Progress</option>
            <option value="endDate">Sort by End Date</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth">
            <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">
            <Icon name="PlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Add Project</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Project Name</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Progress</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Owner</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Timeline</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Budget</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Team</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Priority</span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProjects.map((project) => {
              const statusInfo = statusConfig[project.status];
              return (
                <tr key={project.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="FolderIcon" size={20} variant="outline" className="text-primary" />
                      </div>
                      <div>
                        <p className="font-caption font-medium text-sm text-foreground">{project.name}</p>
                        <p className="font-caption text-xs text-muted-foreground">ID: {project.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      <Icon name={statusInfo.icon as any} size={14} variant="solid" />
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="font-caption text-sm font-medium text-foreground min-w-[40px] text-right">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="font-caption text-xs font-medium text-accent">{project.owner.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="font-caption text-sm text-foreground">{project.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-caption text-sm text-foreground">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="font-caption text-xs text-muted-foreground">to {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm font-medium text-foreground">{project.budget}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Icon name="UsersIcon" size={16} variant="outline" className="text-muted-foreground" />
                      <span className="font-caption text-sm text-foreground">{project.team} members</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-caption text-sm font-medium ${priorityConfig[project.priority]}`}>{project.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project.id)}
                        className="p-2 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-primary-foreground transition-smooth"
                        title="Edit project"
                      >
                        <Icon name="PencilIcon" size={16} variant="outline" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                        title="Delete project"
                      >
                        <Icon name="TrashIcon" size={16} variant="outline" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
        <p className="font-caption text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredProjects.length}</span> of <span className="font-medium text-foreground">{projects.length}</span> projects
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-smooth disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-smooth">
            1
          </button>
          <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-smooth">
            2
          </button>
          <button className="px-3 py-1.5 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-smooth">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectListView;
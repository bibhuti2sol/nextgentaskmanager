'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Project {
  id: string;
  name: string;
   status: 'in-progress' | 'on-hold' | 'completed' | 'planning';
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
  budget: string;
  team: number;
  priority: 'High' | 'Medium' | 'Low';
  projectType?: 'normal' | 'budget';
}

interface ProjectListViewProps {
  projects?: Project[];
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  currentRole?: 'Admin' | 'Manager' | 'Associate';
}

const ProjectListView = ({ projects: propProjects, onEdit, onDelete, currentRole = 'Manager' }: ProjectListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'progress' | 'endDate'>('name');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // Total number of projects
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const pageSize = 10;

  const fetchProjects = async (search = '', page = 0, size = 10, sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const response = await fetch(`http://43.205.137.114:8080/api/v1/projects?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Log the API response for debugging
        if (data.content && Array.isArray(data.content)) {
          const formattedProjects = data.content.map((project: any) => {
            console.log('Project Data:', project); // Log each project for debugging
            return {
              id: project.id,
              name: project.name,
              status: project.status ? project.status.replace('_', '-').toLowerCase() : 'unknown', // Normalize status to match statusConfig keys
              progress: project.progressPercentage || 0,
              startDate: project.startDate || '',
              endDate: project.endDate || '',
              owner: project.projectManagerName || 'Unknown', // Map projectManagerName to owner
              budget: project.budget || '0',
              priority: project.priority || 'Low',
              projectType: project.type || 'normal', // Map type to projectType
            };
          });
          setProjects(formattedProjects); // Replace the current list of projects with the new data
          setTotalElements(data.totalElements); // Update total elements
          setTotalPages(data.totalPages); // Update total pages
        } else {
          console.error('Unexpected response format:', data);
        }
      } else {
        console.error('Failed to fetch projects:', response.status);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(0); // Reset to first page on search or filter change
    fetchProjects(searchQuery, 0, pageSize, 'id,desc');
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchProjects(searchQuery, currentPage, pageSize, 'id,desc');
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const statusConfig = {
    'in-progress': { label: 'In Progress', color: 'bg-primary text-primary-foreground', icon: 'PlayIcon' },
    'on-hold': { label: 'On Hold', color: 'bg-warning text-warning-foreground', icon: 'PauseIcon' },
    completed: { label: 'Completed', color: 'bg-success text-success-foreground', icon: 'CheckCircleIcon' },
    planning: { label: 'Planning', color: 'bg-info text-info-foreground', icon: 'ClipboardDocumentListIcon' },
  };

  const priorityConfig = {
    High: 'text-error',
    Medium: 'text-warning',
    Low: 'text-success'
  };

  // Ensure `propProjects` is defined before filtering.
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return b.name.localeCompare(a.name); // Sort by name in descending order
      if (sortBy === 'status') return b.status.localeCompare(a.status); // Sort by status in descending order
      if (sortBy === 'progress') return b.progress - a.progress; // Sort by progress in descending order
      if (sortBy === 'endDate') return new Date(b.endDate).getTime() - new Date(a.endDate).getTime(); // Sort by endDate in descending order
      return 0;
    });

  console.log('Filtered Projects:', filteredProjects); // Log filtered projects for debugging

  const paginatedProjects = filteredProjects; // Display all projects without slicing for pagination

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
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
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
          <button
            className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-export-modal'));
              }
            }}
          >
            <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Export</span>
          </button>
          {currentRole !== 'Associate' && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition-smooth"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  // Use custom event to notify parent to open modal
                  window.dispatchEvent(new CustomEvent('open-project-modal'));
                }
              }}
            >
              <Icon name="PlusIcon" size={18} variant="outline" />
              <span className="font-caption text-sm">Add Project</span>
            </button>
          )}
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
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Type</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Status</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Progress</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Project Manager</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Timeline</span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">Budget</span>
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
            {paginatedProjects.map((project, index) => {
              const statusInfo = statusConfig[project.status] || { label: 'Unknown', color: 'bg-muted text-muted-foreground', icon: 'QuestionMarkCircleIcon' };
              return (
                <tr key={`${project.id}-${index}`} className="hover:bg-muted/30 transition-smooth">
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
                    <span className="font-caption text-sm text-foreground capitalize">{project.projectType ? project.projectType : 'normal'}</span>
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
                        <span className="font-caption text-xs font-medium text-accent">{(project.owner || 'Unknown').split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="font-caption text-sm text-foreground">{project.owner || 'Unknown'}</span>
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
                    <span className={`font-caption text-sm font-medium ${priorityConfig[project.priority]}`}>{project.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {(currentRole === 'Admin' || currentRole === 'Manager') && (
                        <>
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
        <p className="font-caption text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span> to{' '}
          <span className="font-medium text-foreground">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> of{' '}
          <span className="font-medium text-foreground">{totalElements}</span> projects
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="ChevronLeftIcon" size={14} variant="outline" />
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                  currentPage === i
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            Next
            <Icon name="ChevronRightIcon" size={14} variant="outline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectListView;
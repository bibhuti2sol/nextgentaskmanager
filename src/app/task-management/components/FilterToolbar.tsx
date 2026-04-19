'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface FilterToolbarProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priority: string[];
  assignee: string[];
  project: string[];
  status: string[];
  dateRange: { start: string; end: string } | null;
}

const FilterToolbar = ({ onFilterChange }: FilterToolbarProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    priority: [],
    assignee: [],
    project: [],
    status: [],
    dateRange: null,
  });

  const priorities = ['High', 'Medium', 'Low'];
  const [assignees, setAssignees] = React.useState<string[]>([]);
  const [dynamicProjects, setDynamicProjects] = React.useState<string[]>([]);
  const statuses = ['To Do', 'In Progress', 'Review', 'Completed'];

  React.useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs';
        const response = await fetch('http://43.205.137.114:8080/api/v1/users/assignees', {
          headers: { Authorization: token }
        });
        if (response.ok) {
          const data = await response.json();
          const uniqueNames = Array.from(new Set(data.map((a: any) => a.fullName).filter((name: any) => !!name))) as string[];
          setAssignees(uniqueNames);
        }
      } catch (error) {
        console.error('Failed to fetch assignees for filter:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXJlbmRyYS5tb2RpQGV4YW1wbGUuY29tIiwiaWQiOjM5LCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiUk9MRV9BRE1JTiJ9XSwiaWF0IjoxNzc2MTQ5NDkwLCJleHAiOjE3Nzg3NDE0OTB9.1YBLYJP5OKWGx-qgBllPTaqjae5ShbDrgOw-rr5wRTs';
        const response = await fetch('http://43.205.137.114:8080/api/v1/projects?search=&status=&page=0&size=500&sort=id,desc', {
          headers: { Authorization: token }
        });
        if (response.ok) {
          const data = await response.json();
          const projectList = data.content || data.data || [];
          const uniqueProjects = Array.from(new Set(projectList.map((p: any) => p.title || p.name).filter((name: any) => !!name))) as string[];
          setDynamicProjects(uniqueProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects for filter:', error);
      }
    };

    fetchAssignees();
    fetchProjects();
  }, []);

  const handleFilterToggle = (category: keyof Omit<FilterState, 'dateRange'>, value: string) => {
    const newFilters = { ...filters };
    const currentValues = newFilters[category];
    
    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter((v) => v !== value);
    } else {
      newFilters[category] = [...currentValues, value];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      priority: [],
      assignee: [],
      project: [],
      status: [],
      dateRange: null,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = 
    filters.priority.length + 
    filters.assignee.length + 
    filters.project.length + 
    filters.status.length +
    (filters.dateRange ? 1 : 0);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
        >
          <Icon name="FunnelIcon" size={20} variant="outline" />
          <span className="font-caption font-medium text-sm">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <Icon 
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
            size={16} 
            variant="outline" 
          />
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">Priority</label>
              <select
                value={filters.priority[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, priority: val ? [val] : [] };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">Assignee</label>
              <select
                value={filters.assignee[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, assignee: val ? [val] : [] };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Assignees</option>
                {assignees.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">Project</label>
              <select
                value={filters.project[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, project: val ? [val] : [] };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Projects</option>
                {dynamicProjects.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">Status</label>
              <select
                value={filters.status[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, status: val ? [val] : [] };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
  
          {/* Clear Filters Button */}
          <div className="pt-2 border-t border-border flex justify-end">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-caption font-semibold border border-error/30 text-error bg-error/5 hover:bg-error/15 transition-smooth"
            >
              <Icon name="XMarkIcon" size={14} variant="outline" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;